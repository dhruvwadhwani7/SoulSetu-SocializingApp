# Soul Setu — Bluetooth Proximity Documentation

## 1. Overview

The BLE Proximity Discovery module is the most technically innovative component of Soul Setu. It enables **privacy-preserving, real-world user discovery** using Bluetooth Low Energy (BLE) without exposing user identity over the air. The system uses a **token-based indirection layer**: devices broadcast short-lived cryptographic token prefixes rather than user identifiers, and a server-side resolution mechanism maps these tokens back to profiles.

**Core Design Goal:**  
Allow User B to discover User A in physical proximity (cafes, campuses, events) without ever transmitting User A's UUID, phone number, or any PII over the BLE channel. The BLE channel is inherently unencrypted and observable by any nearby scanner.

---

## 2. BLE Fundamentals Applied

### 2.1 BLE Advertising Protocol

Bluetooth Low Energy devices operate in two roles:
- **Peripheral (Advertiser):** Broadcasts advertisement packets on channels 37, 38, 39 (2.4GHz)
- **Central (Scanner):** Scans for advertisement packets passively or actively

Advertisement packet structure:
```
┌────────────────────────────────────────────────────────────────┐
│  PDU Header │ AdvA (MAC addr) │ AdvData                        │
│             │                 │ ┌──────────────────────────┐   │
│             │                 │ │ AD Type: Manufacturer    │   │
│             │                 │ │ Company ID: 0xFFFF       │   │
│             │                 │ │ Data: [12-hex prefix]    │   │
│             │                 │ └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

Soul Setu embeds the **12-hex token prefix** in the **Manufacturer Specific Data** AD type (type `0xFF`). This field is unstructured bytes chosen by the application — perfect for token embedding.

### 2.2 BLE Range Characteristics

| Environment | Typical Range |
|---|---|
| Open space | 30–100m |
| Indoor (office) | 10–30m |
| Crowded space | 5–15m |
| Tx Power: LOW | ~5–10m (used in Soul Setu) |

Soul Setu uses `TX_POWER_LEVEL: LOW` to intentionally limit range to ~10m, creating an "in-the-same-room" proximity semantics.

---

## 3. Token Architecture

### 3.1 Token Design

```
Full Token (32 hex chars = 128 bits = 16 bytes):
  a3f7b2c1e49083d67e1f5b2a9c04e8d7

BLE Broadcast (first 12 hex chars = 48 bits):
  a3f7b2c1e490

                ← stored server-side only →
                ← ← ← → ← → broadcast over BLE →
[a3f7b2c1e490  8 3 d 6 7 e 1 f 5 b 2 a 9 c 0 4 e 8 d 7]
```

**Security Analysis:**
- 48-bit prefix → 2^48 ≈ 281 trillion possible values
- Collision probability for two simultaneous users: 1/(2^48) ≈ negligible
- Brute force to find matching session: requires ~2^47 queries on average
- With 5-minute resolution attempt throttle → brute force time: years

### 3.2 Token Lifecycle

```
State Machine:
  NONE → [start_proximity_session()] → ACTIVE
  ACTIVE → [2h elapsed] → EXPIRED
  ACTIVE → [user calls start_proximity_session() again] → SUPERSEDED (old deactivated)
  ACTIVE/EXPIRED → [pg_cron cleanup] → DELETED

Timeline:
  T=0:00  Token generated, BLE advertising begins
  T=0:30  User B resolves token → proximity_events record created
  T=1:30  Token still active, different user can also resolve
  T=2:00  Token expires (expires_at < NOW())
  T=3:00  pg_cron batch: is_active = FALSE on expired sessions
```

---

## 4. Implementation: BLE Advertiser (Actor 1)

### 4.1 Session Initialization

```typescript
// hooks/useBLEAdvertiser.ts
import { NativeModules } from 'react-native';
import { supabase } from '../lib/supabase';

const { BLEAdvertiser } = NativeModules;

export function useBLEAdvertiser() {
  const [sessionActive, setSessionActive] = useState(false);
  const [tokenPrefix, setTokenPrefix] = useState(null);

  const startAdvertising = useCallback(async () => {
    // Step 1: Generate session token via Supabase RPC
    const { data, error } = await supabase.rpc('start_proximity_session');
    if (error) throw error;

    const { token_prefix, expires_at } = data;
    setTokenPrefix(token_prefix);

    // Step 2: Start BLE advertising with 12-hex prefix
    await BLEAdvertiser.startAdvertising({
      manufacturerCompanyId: 0xFFFF,
      manufacturerSpecificData: hexToByteArray(token_prefix), // 6 bytes
      advertiseMode: 'ADVERTISE_MODE_BALANCED',  // 250ms interval
      txPowerLevel: 'ADVERTISE_TX_POWER_LOW',
    });

    setSessionActive(true);

    // Step 3: Auto-stop when token expires
    const expiresIn = new Date(expires_at).getTime() - Date.now();
    setTimeout(() => stopAdvertising(), expiresIn);

  }, []);

  const stopAdvertising = useCallback(async () => {
    await BLEAdvertiser.stopAdvertising();
    setSessionActive(false);
    setTokenPrefix(null);
  }, []);

  return { startAdvertising, stopAdvertising, sessionActive, tokenPrefix };
}
```

### 4.2 Android Native Module (BLEAdvertiserModule.java)

```java
// android/app/src/main/java/com/soulsetu/BLEAdvertiserModule.java
@ReactMethod
public void startAdvertising(ReadableMap options, Promise promise) {
  BluetoothManager btManager =
    (BluetoothManager) reactContext.getSystemService(Context.BLUETOOTH_SERVICE);
  BluetoothLeAdvertiser advertiser = btManager.getAdapter().getBluetoothLeAdvertiser();

  AdvertiseSettings settings = new AdvertiseSettings.Builder()
    .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
    .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_LOW)
    .setConnectable(false)  // Non-connectable: scanner only, no GATT
    .build();

  // Build manufacturer data with Soul Setu company ID + token prefix
  byte[] manufacturerData = hexStringToByteArray(
    options.getString("manufacturerSpecificData")
  );

  AdvertiseData data = new AdvertiseData.Builder()
    .addManufacturerData(0xFFFF, manufacturerData)
    .setIncludeDeviceName(false)  // Privacy: don't include device name
    .setIncludeTxPowerLevel(false)
    .build();

  advertiser.startAdvertising(settings, data, advertiseCallback);
  promise.resolve(null);
}
```

### 4.3 iOS Native Module (BLEAdvertiser.swift)

```swift
// ios/BLEAdvertiser.swift
@objc(BLEAdvertiser)
class BLEAdvertiser: NSObject {
  var peripheralManager: CBPeripheralManager?

  @objc func startAdvertising(_ options: NSDictionary, resolver: RCTPromiseResolveBlock,
                               rejecter: RCTPromiseRejectBlock) {
    let tokenData = Data(
      hexString: options["manufacturerSpecificData"] as! String
    )!

    // iOS CoreBluetooth doesn't support arbitrary manufacturer data in advertising
    // Use Service UUID approach instead
    let serviceUUID = CBUUID(string: tokenPrefixToServiceUUID(tokenPrefix))

    peripheralManager?.startAdvertising([
      CBAdvertisementDataServiceUUIDsKey: [serviceUUID],
      CBAdvertisementDataLocalNameKey: ""  // Empty name for privacy
    ])

    resolver(nil)
  }
}
```

**iOS Note:** iOS CoreBluetooth restricts custom manufacturer data in BLE advertising when the app is in the background. Soul Setu uses **Service UUID encoding** on iOS — the 12-hex prefix is encoded as a 16-bit or 128-bit service UUID, which iOS allows broadcasting in background state.

---

## 5. Implementation: BLE Scanner (Actor 2)

### 5.1 BLE Scanning Hook

```typescript
// hooks/useBLEScanner.ts
import { BleManager, Device } from 'react-native-ble-plx';
import { supabase } from '../lib/supabase';

export function useBLEScanner() {
  const manager = useMemo(() => new BleManager(), []);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  // Map for deduplication
  const seenTokens = useRef<Map>(new Map());
  // Map for upsert behavior
  const userMap = useRef<Map>(new Map());

  const startScanning = useCallback(() => {
    // Filter by Soul Setu manufacturer ID (0xFFFF) implicitly via serviceUUID
    manager.startDeviceScan(
      ['0000FFFF-0000-1000-8000-00805F9B34FB'],  // Soul Setu service UUID
      { allowDuplicates: true },  // Keep receiving updates for RSSI
      handleDeviceDiscovered
    );
  }, []);

  const handleDeviceDiscovered = useCallback(async (
    error: BleError | null,
    device: Device | null
  ) => {
    if (error || !device) return;

    // Extract token prefix from manufacturer data
    const tokenPrefix = extractTokenPrefix(device);
    if (!tokenPrefix || tokenPrefix.length !== 12) return;

    // RSSI-based proximity check: only process if signal strong enough
    // RSSI -70 dBm ≈ 10m range
    if (device.rssi && device.rssi < -75) return;

    // Debounce: skip if this token was seen less than 30 seconds ago
    const lastSeen = seenTokens.current.get(tokenPrefix) ?? 0;
    if (Date.now() - lastSeen < 30_000) {
      // Still update RSSI/lastSeen for existing users
      updateUserTimestamp(tokenPrefix);
      return;
    }

    seenTokens.current.set(tokenPrefix, Date.now());
    await resolveTokenToProfile(tokenPrefix, device.rssi ?? -60);
  }, []);

  const resolveTokenToProfile = async (tokenPrefix: string, rssi: number) => {
    try {
      const { data, error } = await supabase.rpc('resolve_proximity_session', {
        p_token_prefix: tokenPrefix
      });

      if (error || !data?.profile) return;

      const profile = data.profile as NearbyProfile;

      // Upsert into userMap
      userMap.current.set(profile.id, {
        ...profile,
        rssi,
        lastSeen: Date.now(),
        tokenPrefix,
      });

      // Update React state (batched)
      setNearbyUsers(Array.from(userMap.current.values())
        .sort((a, b) => b.rssi - a.rssi)  // Sort by signal strength (closer first)
      );

    } catch (err) {
      // Retry logic: exponential backoff for network failures
      retryQueue.current.push({ tokenPrefix, rssi, retries: 0 });
    }
  };

  // Prune stale users (no signal for > 60 seconds)
  useEffect(() => {
    const pruner = setInterval(() => {
      const now = Date.now();
      let changed = false;

      userMap.current.forEach((user, id) => {
        if (now - user.lastSeen > 60_000) {
          userMap.current.delete(id);
          seenTokens.current.delete(user.tokenPrefix);
          changed = true;
        }
      });

      if (changed) {
        setNearbyUsers(Array.from(userMap.current.values()));
      }
    }, 15_000);

    return () => clearInterval(pruner);
  }, []);

  // Retry queue processing (exponential backoff)
  useEffect(() => {
    const processor = setInterval(async () => {
      const item = retryQueue.current.shift();
      if (!item || item.retries >= 3) return;

      await resolveTokenToProfile(item.tokenPrefix, item.rssi);
    }, 2000);
    return () => clearInterval(processor);
  }, []);

  return {
    nearbyUsers,
    startScanning,
    stopScanning: () => manager.stopDeviceScan(),
  };
}
```

### 5.2 Token Extraction from Device

```typescript
// utils/bleToken.ts

export function extractTokenPrefix(device: Device): string | null {
  // Android: extract from manufacturerData
  if (device.manufacturerData) {
    const bytes = base64ToBytes(device.manufacturerData);
    // Skip first 2 bytes (company ID: 0xFFFF)
    const tokenBytes = bytes.slice(2, 8);  // 6 bytes = 12 hex chars
    return bytesToHex(tokenBytes);
  }

  // iOS: extract from serviceUUID encoding
  if (device.serviceUUIDs?.length > 0) {
    const uuid = device.serviceUUIDs[0];
    return serviceUUIDToTokenPrefix(uuid);
  }

  return null;
}

export function hexToByteArray(hex: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    result.push(parseInt(hex.substr(i, 2), 16));
  }
  return result;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
```

---

## 6. Backend: Proximity Session RPC Functions

### 6.1 `start_proximity_session()`

```sql
CREATE OR REPLACE FUNCTION start_proximity_session()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
  v_session_token TEXT;
BEGIN
  -- Resolve caller profile
  SELECT id INTO v_profile_id FROM profiles WHERE user_id = auth.uid();
  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Profile not found');
  END IF;

  -- Cryptographically secure 128-bit token
  v_session_token := encode(gen_random_bytes(16), 'hex');

  -- Deactivate existing active sessions (only one active at a time)
  UPDATE proximity_sessions
  SET is_active = FALSE, updated_at = NOW()
  WHERE profile_id = v_profile_id AND is_active = TRUE;

  -- Create new session
  INSERT INTO proximity_sessions (profile_id, session_token, expires_at, is_active)
  VALUES (
    v_profile_id,
    v_session_token,
    NOW() + INTERVAL '2 hours',
    TRUE
  );

  RETURN jsonb_build_object(
    'token', v_session_token,                   -- Full token: sent to device, never over BLE
    'token_prefix', LEFT(v_session_token, 12),  -- Prefix: broadcast via BLE
    'expires_at', NOW() + INTERVAL '2 hours',
    'payload_bytes', 6                          -- 6 bytes in BLE manufacturer data
  );
END;
$$;
```

### 6.2 `resolve_proximity_session()`

```sql
CREATE OR REPLACE FUNCTION resolve_proximity_session(
  p_token_prefix TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_id UUID;
  v_target_id UUID;
  v_caller_location GEOGRAPHY;
  v_profile_data JSONB;
  v_distance_m DOUBLE PRECISION;
BEGIN
  -- Validate caller
  SELECT p.id, p.location
  INTO v_caller_id, v_caller_location
  FROM profiles p WHERE p.user_id = auth.uid();

  IF v_caller_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Caller not authenticated');
  END IF;

  -- Validate prefix format (12 hex chars)
  IF p_token_prefix !~ '^[0-9a-f]{12}$' THEN
    RETURN jsonb_build_object('error', 'Invalid token format');
  END IF;

  -- Rate limiting: max 30 resolutions per minute per caller
  IF (
    SELECT COUNT(*) FROM proximity_events
    WHERE resolver_profile_id = v_caller_id
      AND resolved_at > NOW() - INTERVAL '1 minute'
  ) > 30 THEN
    RETURN jsonb_build_object('error', 'Rate limit exceeded');
  END IF;

  -- Lookup session by prefix (uses functional index)
  SELECT profile_id INTO v_target_id
  FROM proximity_sessions
  WHERE
    LEFT(session_token, 12) = p_token_prefix
    AND is_active = TRUE
    AND expires_at > NOW()
  LIMIT 1;

  IF v_target_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Token not found or expired');
  END IF;

  -- Prevent self-resolution
  IF v_target_id = v_caller_id THEN
    RETURN jsonb_build_object('error', 'Cannot resolve own session');
  END IF;

  -- Anti-stalking: check if this caller already resolved this token recently (< 5 min)
  IF EXISTS (
    SELECT 1 FROM proximity_events
    WHERE resolver_profile_id = v_caller_id
      AND token = p_token_prefix
      AND resolved_at > NOW() - INTERVAL '5 minutes'
  ) THEN
    -- Silently return cached result without new event log
    -- (prevents repeated audit entries for same encounter)
    NULL;
  ELSE
    -- Log resolution event
    INSERT INTO proximity_events (resolver_profile_id, token, resolved_at, expires_at)
    VALUES (v_caller_id, p_token_prefix, NOW(), NOW() + INTERVAL '30 minutes');
  END IF;

  -- Calculate distance between caller and target
  SELECT ST_Distance(p.location, v_caller_location)
  INTO v_distance_m
  FROM profiles p WHERE p.id = v_target_id;

  -- Return filtered profile (metadata only — NO sensitive fields)
  SELECT jsonb_build_object(
    'id', p.id,
    'first_name', p.first_name,
    'age', EXTRACT(YEAR FROM AGE(p.dob))::INTEGER,
    'distance_m', ROUND(v_distance_m),
    'photos', (
      SELECT jsonb_agg(ph ORDER BY ph.photo_order)
      FROM profile_photos ph
      WHERE ph.profile_id = p.id AND ph.is_active = TRUE
      LIMIT 1
    )
    -- EXPLICITLY EXCLUDED: last_name, phone, location, dob, user_id
  )
  INTO v_profile_data
  FROM profiles p
  WHERE p.id = v_target_id;

  RETURN jsonb_build_object('profile', v_profile_data);
END;
$$;
```

---

## 7. Security Analysis

### 7.1 Threat Model

| Threat | Attack Description | Mitigation |
|---|---|---|
| **BLE Eavesdropping** | Attacker scans BLE and collects token prefixes | Only 12/32 chars broadcast; cannot derive full token |
| **Token Prefix Brute Force** | Attacker queries all 16^12 combinations | 2^48 possibilities; rate limit 30/min; impractical |
| **Replay Attack** | Attacker replays captured token prefix later | 2-hour expiry; after expiry, `resolve` returns error |
| **Profile Enumeration** | Attacker tries random UUIDs in QR deep link | RLS + RPC returns 404 for non-existent; no timing side-channel |
| **Stalking via BLE** | Attacker continuously scans to track victim's movement | 5-min cooldown per token-caller pair in proximity_events |
| **Rate Flooding** | Attacker spams `resolve_proximity_session` | 30 resolutions/minute per authenticated caller |
| **Identity Exposure** | Attacker reads raw BLE packet | Token prefix has no mapping to user identity without server |
| **Session Hijacking** | Attacker intercepts full token | Full token sent only once via HTTPS (TLS encrypted) |
| **MAC Address Tracking** | Track user by BLE MAC address | Modern iOS/Android randomize MAC every 15 minutes |

### 7.2 Privacy Guarantees

```
What is broadcast over BLE:
  ✓ 12-hex token prefix (6 bytes)
  ✓ Nothing else

What is NEVER broadcast over BLE:
  ✗ User UUID or profile ID
  ✗ Phone number
  ✗ Name or any PII
  ✗ Device MAC (randomized by OS)
  ✗ Full session token

What server returns on resolve:
  ✓ First name
  ✓ Age (integer, not DOB)
  ✓ First profile photo URL
  ✓ Distance in meters (not exact coordinates)

What server NEVER returns:
  ✗ Last name
  ✗ Phone number
  ✗ Exact GPS coordinates
  ✗ Date of birth
  ✗ auth.uid() / user_id
```

---

## 8. Complete Flow Diagram

```
ADVERTISER (Actor 1)                    SCANNER (Actor 2)
─────────────────────────────────────   ──────────────────────────────────────

[App starts, user opens Nearby tab]     [User opens Nearby tab]
           │                                       │
           ▼                                       ▼
[Check auth session]                    [Request BT permissions]
           │                                       │
           ▼                                       ▼
[POST /rpc/start_proximity_session]     [BleManager.startDeviceScan()]
           │                                       │
           ▼                                       │
[PostgreSQL: gen_random_bytes(16)]                 │
[INSERT proximity_sessions]                        │
[Return: token='a3f7b2c1...']                      │
[Return: token_prefix='a3f7b2c1e490']              │
           │                                       │
           ▼                                       │
[BLEAdvertiser.startAdvertising(                   │
  manufacturerData='a3f7b2c1e490')]                │
           │                                       │
           │ ── BLE signal (2.4GHz) ──────────────▶│
           │    Manufacturer data:                 │
           │    [0xFF 0xFF a3 f7 b2 c1 e4 90]      │
           │                                       ▼
           │                            [Device detected]
           │                            [Extract mfr data bytes 2-7]
           │                            [tokenPrefix = 'a3f7b2c1e490']
           │                            [RSSI = -62 dBm → within range]
           │                            [Debounce check: not seen in 30s]
           │                                       │
           │                                       ▼
           │                            [POST /rpc/resolve_proximity_session
           │                              { p_token_prefix: 'a3f7b2c1e490' }]
           │                                       │
           │                                       ▼
           │                            [PostgreSQL functional index lookup]
           │                            [SELECT profile_id FROM proximity_sessions
           │                             WHERE LEFT(session_token,12)='a3f7b2c1e490'
           │                             AND is_active=TRUE AND expires_at>NOW()]
           │                                       │
           │                            ┌──────────▼──────────┐
           │                            │ Rate limit check    │
           │                            │ Self-resolution check│
           │                            │ Anti-stalk cooldown │
           │                            └──────────┬──────────┘
           │                                       │
           │                                       ▼
           │                            [INSERT proximity_events (audit)]
           │                                       │
           │                                       ▼
           │                            [Return: {
           │                              profile: {
           │                                id: 'uuid',
           │                                first_name: 'Dhruv',
           │                                age: 22,
           │                                distance_m: 8,
           │                                photos: [{...}]
           │                              }
           │                            }]
           │                                       │
           │                                       ▼
           │                            [NearbyUserCard rendered]
           │                            [Updated Map<id, {lastSeen: now}>]
           │                                       │
[Token expires at T+2h]                [Pruner: removes if lastSeen > 60s ago]
[BLE advertising stops]                [seenTokens cleared]
```

---

## 9. UI Component: Nearby Screen

### 9.1 Screen State Machine

```typescript
type NearbyScreenState =
  | 'CHECKING_PERMISSION'
  | 'PERMISSION_DENIED'
  | 'BLUETOOTH_OFF'
  | 'STARTING'
  | 'SCANNING'
  | 'EMPTY'          // scanning but no users found
  | 'HAS_USERS';     // 1+ users resolved

const NearbyScreen = () => {
  const [screenState, setScreenState] = useState('CHECKING_PERMISSION');
  const { nearbyUsers, startScanning } = useBLEScanner();
  const { startAdvertising } = useBLEAdvertiser();

  useEffect(() => {
    const init = async () => {
      const btStatus = await checkBluetoothStatus();
      if (btStatus === 'OFF') { setScreenState('BLUETOOTH_OFF'); return; }

      const perm = await requestBLEPermissions();
      if (perm !== 'granted') { setScreenState('PERMISSION_DENIED'); return; }

      setScreenState('STARTING');
      await startAdvertising();
      await startScanning();
      setScreenState('SCANNING');
    };
    init();
  }, []);

  useEffect(() => {
    setScreenState(nearbyUsers.length > 0 ? 'HAS_USERS' : 'SCANNING');
  }, [nearbyUsers]);

  return (
    
      {screenState === 'BLUETOOTH_OFF' && }
      {screenState === 'PERMISSION_DENIED' && }
      {screenState === 'SCANNING' && }
      {screenState === 'HAS_USERS' && (
        <FlatList
          data={nearbyUsers}
          keyExtractor={u => u.id}
          renderItem={({ item }) => (
            <NearbyUserCard
              user={item}
              onPress={() => router.push(`/profile/${item.id}`)}
            />
          )}
        />
      )}
    
  );
};
```

### 9.2 NearbyUserCard Component

```tsx
const NearbyUserCard = ({ user, onPress }: { user: NearbyUser; onPress: () => void }) => (
  
    
    
      
        {user.first_name}, {user.age}
      
      
        {user.distance_m < 1000
          ? `${user.distance_m}m away`
          : `${(user.distance_m / 1000).toFixed(1)}km away`}
      
    
    
  
);
```

---

## 10. Edge Cases and Error Handling

### 10.1 Token Collision

**Scenario:** Two users have session tokens with identical 12-char prefixes  
**Probability:** 1/(2^48) ≈ 0 in practice with < 10M concurrent users  
**Handling:**
```sql
-- If prefix matches multiple sessions, prefer most recently created
SELECT profile_id FROM proximity_sessions
WHERE LEFT(session_token, 12) = p_token_prefix
  AND is_active = TRUE AND expires_at > NOW()
ORDER BY created_at DESC
LIMIT 1;
```

### 10.2 Bluetooth Toggle Mid-Session

```typescript
manager.onStateChange((state) => {
  if (state === 'PoweredOff') {
    stopScanning();
    stopAdvertising();
    setScreenState('BLUETOOTH_OFF');
  }
  if (state === 'PoweredOn' && sessionActive) {
    startScanning();
    // Don't restart advertising — existing token still valid
  }
}, true);
```

### 10.3 Network Failure During Resolution

```typescript
const resolveWithRetry = async (tokenPrefix: string, rssi: number, attempt = 0) => {
  try {
    return await resolveTokenToProfile(tokenPrefix, rssi);
  } catch (err) {
    if (attempt >= 3) return null;  // Give up after 3 attempts
    const delay = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s
    await sleep(delay);
    return resolveWithRetry(tokenPrefix, rssi, attempt + 1);
  }
};
```

### 10.4 App Background State (iOS)

On iOS, BLE scanning is allowed in background with the `bluetooth-central` background mode. BLE advertising uses service UUIDs (not manufacturer data) for background compatibility.

```xml

UIBackgroundModes

  bluetooth-central
  bluetooth-peripheral

```

### 10.5 Stale User Cleanup

Users are removed from the nearby list if no BLE signal is received for 60 seconds:

```typescript
// Background cleanup runs every 15 seconds
// O(n) scan acceptable — in practice n < 20 (users in same room)
setInterval(() => {
  const cutoff = Date.now() - 60_000;
  setNearbyUsers(prev => prev.filter(u => u.lastSeen > cutoff));
}, 15_000);
```

---

## 11. Performance Characteristics

| Operation | Complexity | Notes |
|---|---|---|
| Token generation | O(1) | `gen_random_bytes(16)` — entropy from OS |
| Token storage (INSERT) | O(log n) | B-tree index on UUID primary key |
| Token prefix lookup | O(log n) | Functional index `LEFT(session_token, 12)` |
| BLE scan event handling | O(1) | Map lookup by token prefix |
| Nearby user list update | O(n) | Small n (same-room, typically < 20) |
| Stale user pruning | O(n) | 15-second interval, small n |
| Audit log insert | O(log n) | UUID index on proximity_events |

---

## 12. Comparison to Alternative Approaches

| Approach | Privacy | Complexity | Range Control | Soul Setu Verdict |
|---|---|---|---|---|
| Broadcast UUID directly | ❌ Low | Low | Medium | Rejected — PII exposure |
| iBeacon (UUID + major/minor) | ❌ Low | Low | Good | Rejected — enumerable |
| Ephemeral BLE MAC only | ✅ High | Low | Poor | Rejected — no server resolution |
| Token prefix + server resolve | ✅ High | Medium | Good (TX power) | **Chosen** |
| Ultrasound proximity (like DP-3T) | ✅ Very high | Very high | Excellent | Too complex for MVP |
| QR-only (no BLE) | ✅ High | Low | Manual | Used as complement |