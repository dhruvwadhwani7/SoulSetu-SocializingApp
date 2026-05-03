# Soul Setu — Frontend Documentation

## 1. Overview

Soul Setu's frontend is a cross-platform mobile application built with **React Native** using the **Expo** managed/bare workflow. The UI layer spans authentication, onboarding, profile management, discovery, matchmaking, real-time chat, QR identity sharing, BLE proximity detection, and location-based nearby place recommendations. The entire frontend communicates with a Supabase PostgreSQL backend via typed RPC calls, REST endpoints, and Sendbird's SDK.

**Key Design Philosophy:**
- Component isolation with single responsibility
- Server-state managed exclusively via React Query (TanStack Query)
- UI driven by NativeWind (Tailwind CSS for React Native)
- Deep link-first navigation using Expo Router
- Hardware integration (Camera, BLE, GPS) handled through Expo and native modules

---

## 2. Technology Stack

| Technology | Version / Package | Purpose |
|---|---|---|
| React Native | 0.73+ (Expo SDK 50) | Core cross-platform runtime |
| Expo Framework | SDK 50 | Managed workflow, OTA updates, build toolchain |
| Expo Router | v3 | File-system based routing + deep linking |
| NativeWind | v4 | TailwindCSS utility classes in React Native |
| TanStack React Query | v5 | Server-state sync, caching, background refetch |
| Sendbird UIKit SDK | v3 | Real-time chat UI components |
| Expo Camera | v14 | QR code scanning |
| React Native QR SVG | latest | QR code generation |
| React Native BLE PLX | v3 | BLE scanning and discovery |
| Expo Media Library | latest | Saving QR images to device |
| Expo Sharing | latest | Native share sheet for QR cards |
| Expo Image Picker | latest | Profile photo selection |
| Expo Image Manipulator | latest | Image compression before upload |
| Expo AV | latest | Media playback in chat/profile |
| React Native View Shot | latest | QR component capture as image |
| JavaScript (ES6+) | — | Core application logic |

---

## 3. Project Structure

```
/src
├── app/                         # Expo Router pages (file-system routing)
│   ├── (auth)/
│   │   ├── index.tsx            # Landing / splash screen
│   │   ├── login.tsx            # Phone number entry
│   │   └── verify.tsx           # OTP verification screen
│   ├── (onboarding)/
│   │   ├── basic-info.tsx       # Name, DOB, gender, pronouns
│   │   ├── identity.tsx         # Ethnicity, sexuality, zodiac, pets
│   │   ├── location.tsx         # Map-based location selection
│   │   └── photos.tsx           # Photo upload (min 2)
│   ├── (tabs)/
│   │   ├── discover.tsx         # Main swipe-based discovery feed
│   │   ├── matches.tsx          # Match list + chat navigation
│   │   ├── nearby.tsx           # BLE proximity discovery
│   │   ├── places.tsx           # Nearby places recommendations
│   │   └── profile.tsx          # Profile view/edit
│   ├── chat/
│   │   └── [channelUrl].tsx     # Dynamic chat screen per channel
│   ├── qr/
│   │   ├── generate.tsx         # QR code display + share
│   │   └── scan.tsx             # Camera QR scanner
│   └── profile/
│       └── [userId].tsx         # Resolved profile view (from QR/BLE)
├── components/
│   ├── auth/
│   ├── discovery/
│   ├── profile/
│   ├── chat/
│   ├── bluetooth/
│   ├── qr/
│   ├── places/
│   └── shared/
├── hooks/
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useDiscovery.ts
│   ├── useInteraction.ts
│   ├── useChat.ts
│   ├── useBLE.ts
│   ├── useQR.ts
│   └── usePlaces.ts
├── lib/
│   ├── supabase.ts              # Supabase client singleton
│   ├── sendbird.ts              # Sendbird SDK initialization
│   └── queryClient.ts           # React Query client config
├── utils/
│   ├── deepLink.ts              # Deep link parsing/generation
│   ├── bleToken.ts              # BLE token encoding/decoding
│   ├── geo.ts                   # Coordinate utilities
│   └── imageUtils.ts            # Compression, resize helpers
├── constants/
│   ├── theme.ts                 # Design tokens
│   └── config.ts                # API keys, URLs (env-loaded)
└── types/
    ├── profile.ts
    ├── interaction.ts
    ├── chat.ts
    └── places.ts
```

---

## 4. Routing and Navigation

### 4.1 Expo Router (File-System Routing)

Expo Router v3 uses the `/app` directory as the routing root. Each file maps to a route:

```
app/(auth)/login.tsx      → /login
app/(tabs)/discover.tsx   → /discover (tab)
app/chat/[channelUrl].tsx → /chat/:channelUrl
app/profile/[userId].tsx  → /profile/:userId
```

**Route Groups:**
- `(auth)` — unauthenticated screens, redirected away post-login
- `(onboarding)` — new user profile setup wizard
- `(tabs)` — main tab navigator (Discover, Matches, Nearby, Places, Profile)

### 4.2 Deep Linking Configuration

Deep links follow the scheme `soulsetu://profile/:userId`. The Expo Router `linking` config maps these to `app/profile/[userId].tsx`:

```typescript
// app.json / app.config.ts
{
  "scheme": "soulsetu",
  "intentFilters": [
    {
      "action": "VIEW",
      "data": [{ "scheme": "soulsetu", "host": "profile" }],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

When a QR code is scanned, the encoded `soulsetu://profile/UUID` deep link is resolved by Expo Router, which renders `app/profile/[userId].tsx`, fetching profile data via RPC.

---

## 5. State Management — React Query

React Query (TanStack Query v5) manages **all server state**. Local UI state uses `useState`/`useReducer`. No Redux or Zustand.

### 5.1 Query Client Configuration

```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 min stale window
      gcTime: 1000 * 60 * 30,          // 30 min garbage collection
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    }
  }
});
```

### 5.2 Query Key Strategy

All query keys follow a hierarchical tuple convention:

```typescript
const QUERY_KEYS = {
  profiles: ['profiles'] as const,
  profileById: (id: string) => ['profiles', id] as const,
  discovery: (userId: string) => ['discovery', userId] as const,
  interactions: (userId: string) => ['interactions', userId] as const,
  matches: (userId: string) => ['matches', userId] as const,
  nearbyPlaces: (lat: number, lng: number, radius: number) =>
    ['places', lat, lng, radius] as const,
  bleNearby: (sessionToken: string) => ['ble', sessionToken] as const,
};
```

### 5.3 Key Hooks

#### `useDiscovery`
```typescript
export function useDiscovery() {
  const { user } = useAuth();
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.discovery(user.id),
    queryFn: ({ pageParam = 0 }) =>
      supabase.rpc('get_profiles', {
        p_offset: pageParam,
        p_limit: 10
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.data?.length === 10 ? pages.length * 10 : undefined,
    staleTime: 1000 * 60 * 2,
  });
}
```

#### `useInteraction`
```typescript
export function useInteraction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const likeMutation = useMutation({
    mutationFn: (targetId: string) =>
      supabase.rpc('like_profile', { p_target_id: targetId }),
    onSuccess: (data) => {
      if (data.data?.matched) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matches(user.id) });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.discovery(user.id) });
    }
  });

  const skipMutation = useMutation({
    mutationFn: (targetId: string) =>
      supabase.rpc('skip_profile', { p_target_id: targetId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.discovery(user.id) });
    }
  });

  return { likeMutation, skipMutation };
}
```

---

## 6. Authentication Flow

### 6.1 Screen Flow

```
SplashScreen
  → check Supabase session (supabase.auth.getSession())
    → session exists → navigate to (tabs)/discover
    → no session     → navigate to (auth)/login
```

### 6.2 OTP Authentication

```typescript
// hooks/useAuth.ts

// Step 1: Send OTP
const sendOTP = async (phone: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
    options: { channel: 'sms' }  // Twilio routes SMS
  });
  if (error) throw error;
};

// Step 2: Verify OTP
const verifyOTP = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: `+91${phone}`,
    token,
    type: 'sms'
  });
  if (error) throw error;
  return data.session;
};
```

**Supabase trigger fires** `handle_new_user()` on first OTP verification, auto-creating a `profiles` row linked to `auth.users.id`.

### 6.3 Session Persistence

Supabase client is configured with `AsyncStorage` for session persistence across app restarts:

```typescript
// lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});
```

---

## 7. Profile Management

### 7.1 Onboarding Wizard

The onboarding flow is a multi-step wizard with local state accumulating across screens:

```
BasicInfoScreen → IdentityScreen → LocationScreen → PhotosScreen → ProfilePreview
```

Each screen writes incrementally to a local `profileDraft` object (managed via `useReducer`), submitted in a single `update_profile()` RPC call at the end.

### 7.2 Profile Update Flow

```
User edits field in App
  → local state update (optimistic)
  → mutation: supabase.rpc('update_profile', { ...payload })
  → onSuccess: queryClient.invalidateQueries(['profiles', userId])
  → React Query refetches → UI re-renders with fresh data
```

### 7.3 Photo Upload

```typescript
const uploadPhoto = async (uri: string, userId: string) => {
  // 1. Compress image
  const compressed = await manipulateAsync(uri, [
    { resize: { width: 800 } }
  ], { compress: 0.7, format: SaveFormat.JPEG });

  // 2. Convert to ArrayBuffer
  const response = await fetch(compressed.uri);
  const blob = await response.blob();

  // 3. Upload to Supabase Storage (bucket: 'profiles')
  const filePath = `${userId}/${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(filePath, blob, { contentType: 'image/jpeg' });

  // 4. Get public URL
  const { data: urlData } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);

  // 5. Save URL to profile_photos table via RPC
  await supabase.rpc('update_profile', {
    p_photos: [{ photo_url: urlData.publicUrl, photo_order: order }]
  });
};
```

---

## 8. Discovery Feed

### 8.1 Architecture

The discovery screen renders profiles as a **card stack** (swipeable). Profiles are fetched via `useInfiniteQuery`, with pagination handled automatically when the stack runs low.

```
DiscoverScreen
├── CardStack (renders top 3 cards)
│   └── ProfileCard
│       ├── PhotoCarousel (profile images)
│       ├── BasicInfo (name, age, location)
│       └── Prompts (profile_answers)
├── ActionButtons (Like, Skip, Super-like)
└── EmptyState (when all profiles exhausted)
```

### 8.2 Swipe Gesture Implementation

Using React Native's `PanResponder` or `react-native-gesture-handler` to detect swipe direction:

```typescript
const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: (_, gesture) =>
    Math.abs(gesture.dx) > 10,
  onPanResponderRelease: (_, gesture) => {
    if (gesture.dx > 100) handleLike();
    else if (gesture.dx < -100) handleSkip();
    else resetCardPosition();
  }
});
```

### 8.3 Optimistic Updates

When user swipes, the card is removed from UI immediately (optimistic), then the mutation fires. On error, the card is restored:

```typescript
const handleLike = () => {
  const currentProfile = profiles[currentIndex];
  setCurrentIndex(i => i + 1); // optimistic removal
  likeMutation.mutate(currentProfile.id, {
    onError: () => setCurrentIndex(i => i - 1) // rollback
  });
};
```

---

## 9. Chat Integration (Sendbird)

### 9.1 Sendbird Initialization

```typescript
// lib/sendbird.ts
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

export const sb = SendbirdChat.init({
  appId: SENDBIRD_APP_ID,
  modules: [new GroupChannelModule()],
});

export const connectSendbird = async (userId: string, accessToken: string) => {
  await sb.connect(userId, accessToken);
};
```

Sendbird `userId` = Supabase `auth.uid()`. The `accessToken` is fetched from Supabase Vault via RPC and passed to the frontend securely.

### 9.2 Matches Screen Flow

```
MatchesScreen mounts
  → fetchSendbirdToken() RPC call (gets token from Vault)
  → sb.connect(userId, token)
  → GroupChannelListFragment renders all channels
  → User taps channel → navigate to chat/[channelUrl]
```

### 9.3 Chat Screen

```
ChatScreen mounts with channelUrl param
  → sb.groupChannel.getChannel(channelUrl)
  → LoadGroupChannelFragment (Sendbird UIKit)
  → fetchMessageHistory()
  → subscribeToRealtimeEvents()
    ├── onMessageReceived → append to list
    ├── onDeliveryReceiptUpdated → update delivery status
    └── onReadReceiptUpdated → show "read" indicator
```

### 9.4 Message Flow

```
Actor 1 types message
  → sendUserMessage(channelUrl, messageText)
  → Sendbird Server receives
  → Realtime event pushed to Actor 2
  → Actor 2's handler: is chat screen open?
      YES → append message to UI
      NO  → update unread count badge + lastMessage preview
```

---

## 10. QR Profile Sharing

### 10.1 QR Generation Screen

```typescript
const GenerateQRScreen = () => {
  const { user } = useAuth();

  // Build deep link
  const deepLink = `soulsetu://profile/${user.id}`;

  // Validate UUID entropy + app scheme
  const isValid = validateDeepLink(deepLink);

  return (
    <View>
      <ProfileCard user={user} />
      <QRCode
        value={deepLink}
        size={200}
        ref={qrRef}
      />
      <Button onPress={shareQR}>Share QR</Button>
      <Button onPress={saveQR}>Save to Gallery</Button>
    </View>
  );
};

const shareQR = async () => {
  // Capture QR component as image
  const uri = await captureRef(qrRef, { format: 'png' });
  // Share via native share sheet
  await Sharing.shareAsync(uri);
};
```

### 10.2 QR Scanning Flow

```typescript
const ScanQRScreen = () => {
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Validate scheme
    if (!data.startsWith('soulsetu://profile/')) return;

    // Extract UUID
    const profileId = data.replace('soulsetu://profile/', '');

    // Check Supabase session
    const session = await supabase.auth.getSession();
    if (!session.data.session) { router.push('/login'); return; }

    // Store temporarily as scanned_profile_id
    setScannedProfileId(profileId);

    // RPC: fetch filtered profile (RLS applied, metadata only)
    const { data: profile } = await supabase.rpc('get_profile_by_id', {
      p_profile_id: profileId
    });

    // Navigate to profile view
    router.push(`/profile/${profileId}`);
  };

  return (
    <Camera
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
    />
  );
};
```

---

## 11. Bluetooth Proximity Screen

### 11.1 BLE Screen Architecture

```
NearbyScreen
├── BluetoothPermissionCheck
│   ├── NO → PermissionRequestUI
│   └── YES → BluetoothStateCheck
│       ├── OFF → PromptEnableDialog
│       └── ON  → BLEScannerView
│           ├── NearbyUserCard (for each resolved user)
│           └── ScanningIndicator (animated)
```

### 11.2 BLE Hook

```typescript
// hooks/useBLE.ts
export function useBLE() {
  const manager = useMemo(() => new BleManager(), []);
  const [nearbyUsers, setNearbyUsers] = useState<ResolvedUser[]>([]);
  const scannedTokens = useRef<Map<string, number>>(new Map()); // token → timestamp

  const startScanning = useCallback(() => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error || !device?.manufacturerData) return;

      // Extract 12-hex-char token prefix from manufacturer data
      const tokenPrefix = extractTokenPrefix(device.manufacturerData);
      if (!tokenPrefix) return;

      // Debounce: only process if not seen in last 30s
      const lastSeen = scannedTokens.current.get(tokenPrefix) ?? 0;
      if (Date.now() - lastSeen < 30_000) return;
      scannedTokens.current.set(tokenPrefix, Date.now());

      // Resolve via backend
      resolveToken(tokenPrefix);
    });
  }, [manager]);

  const resolveToken = async (tokenPrefix: string) => {
    const { data } = await supabase.rpc('resolve_proximity_session', {
      p_token_prefix: tokenPrefix
    });
    if (data?.profile) {
      setNearbyUsers(prev => {
        // Upsert by profile id
        const filtered = prev.filter(u => u.id !== data.profile.id);
        return [...filtered, { ...data.profile, lastSeen: Date.now() }];
      });
    }
  };

  // Prune stale users (inactive > 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyUsers(prev =>
        prev.filter(u => Date.now() - u.lastSeen < 60_000)
      );
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  return { nearbyUsers, startScanning, stopScanning: () => manager.stopDeviceScan() };
}
```

### 11.3 BLE Advertising (Native Module)

BLE advertising (broadcasting the token) is handled via a custom React Native native module since Expo does not expose BLE peripheral mode:

```typescript
// utils/bleToken.ts
import { NativeModules } from 'react-native';
const { BLEAdvertiser } = NativeModules;

export const startBLEAdvertising = async (sessionToken: string) => {
  // Take first 12 hex chars as prefix
  const prefix = sessionToken.substring(0, 12);

  await BLEAdvertiser.startAdvertising({
    manufacturerId: 0xFFFF,
    manufacturerData: prefix,
    advertiseMode: 'LOW_POWER',
    txPowerLevel: 'LOW',
  });
};
```

---

## 12. Nearby Places Screen

### 12.1 Data Flow

```
PlacesScreen mounts
  → useLocation() → GPS coordinates
  → queryClient fetches ['places', lat, lng, radius]
  → usePlaces hook:
      1. Check Supabase Postgres cache (location_cache table)
      2. Cache HIT → return cached data
      3. Cache MISS:
          a. Determine request type (place details vs geocoding)
          b. If place details → check Foursquare rate limit → call Foursquare API
          c. If geocoding → check OSM rate limit → call OSM Overpass API
          d. Store result in Supabase cache
          e. Return location data
  → Render ListView + MapView with markers
```

### 12.2 Places Hook

```typescript
export function usePlaces(lat: number, lng: number, radius: number) {
  return useQuery({
    queryKey: QUERY_KEYS.nearbyPlaces(lat, lng, radius),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_nearby_places', {
        p_lat: lat,
        p_lng: lng,
        p_radius_km: radius / 1000,
        p_types: ['cafe', 'restaurant', 'park']
      });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 min - places don't change often
    enabled: !!(lat && lng),
  });
}
```

---

## 13. UI Component Design

### 13.1 Styling with NativeWind

All components use NativeWind Tailwind classes:

```tsx
// components/profile/ProfileCard.tsx
const ProfileCard = ({ profile }: { profile: Profile }) => (
  <View className="bg-white rounded-3xl shadow-lg overflow-hidden mx-4">
    <Image
      source={{ uri: profile.photos[0]?.photo_url }}
      className="w-full h-96 object-cover"
    />
    <View className="p-4">
      <Text className="text-2xl font-bold text-gray-900">
        {profile.first_name}, {calculateAge(profile.dob)}
      </Text>
      <Text className="text-sm text-gray-500 mt-1">
        {profile.location_label}
      </Text>
    </View>
  </View>
);
```

### 13.2 Design Token System

```typescript
// constants/theme.ts
export const colors = {
  primary: '#7C3AED',    // Violet-600 (Soul Setu brand)
  secondary: '#DDD6FE',  // Violet-200
  accent: '#F59E0B',     // Amber-500
  danger: '#EF4444',     // Red-500
  surface: '#FFFFFF',
  background: '#F9FAFB',
  text: { primary: '#111827', secondary: '#6B7280' }
};
```

---

## 14. Error Handling & Edge Cases

### 14.1 Network Errors

React Query's `retry: 2` handles transient failures. Custom error boundaries catch render-time errors:

```tsx
<ErrorBoundary fallback={<ErrorScreen onRetry={refetch} />}>
  <DiscoverScreen />
</ErrorBoundary>
```

### 14.2 Offline Support

React Query's cache serves stale data when offline. A network status hook shows a banner:

```typescript
const { isConnected } = useNetInfo(); // @react-native-community/netinfo
```

### 14.3 BLE Permission Flow

```
Android: REQUEST_BLUETOOTH_SCAN + REQUEST_BLUETOOTH_CONNECT + ACCESS_FINE_LOCATION
iOS: NSBluetoothAlwaysUsageDescription in Info.plist
```

If denied, `Show Permission UI` screen guides users to system settings.

### 14.4 Camera Permission Flow

```
Android: android.permission.CAMERA
iOS: NSCameraUsageDescription
```

QR scan screen shows permission rationale dialog before requesting.

---

## 15. Performance Optimizations

| Technique | Applied To | Benefit |
|---|---|---|
| `React.memo` | ProfileCard, PlaceCard | Prevents unnecessary re-renders |
| `useMemo` | BLE manager instance | Single BLE manager lifetime |
| `useCallback` | Event handlers | Stable references across renders |
| `FlashList` (Shopify) | Discovery feed, Match list | Virtualized list, 60fps scroll |
| Image compression | Photo upload | 70% quality, max 800px width |
| React Query `staleTime` | All queries | Reduces redundant API calls |
| Infinite Query pagination | Discovery feed | Loads 10 profiles at a time |
| Debounce (30s) | BLE token scanning | Prevents duplicate RPC calls |
| 60s user pruning | BLE nearby list | Keeps only active users shown |
| `AsyncStorage` session | Auth | Avoids login on each app restart |

---

## 16. Build and Deployment

### 16.1 Development

```bash
npx expo start              # Metro bundler
npx expo start --dev-client  # With native BLE modules
```

### 16.2 Production Builds

```bash
eas build --platform android  # APK/AAB via EAS Build
eas build --platform ios      # IPA via EAS Build
```

### 16.3 OTA Updates

```bash
eas update --branch production  # Over-the-air JS bundle update
```

### 16.4 Environment Configuration

```
.env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_SENDBIRD_APP_ID=...
EXPO_PUBLIC_FOURSQUARE_API_KEY=...
```

---

## 17. Data Flow Summary per Feature

| Feature | UI Event | Hook/Mutation | Supabase/API Call | UI Update |
|---|---|---|---|---|
| Login | Phone submit | `sendOTP()` | `supabase.auth.signInWithOtp` | Navigate to OTP screen |
| OTP Verify | OTP submit | `verifyOTP()` | `supabase.auth.verifyOtp` | Navigate to discover/onboarding |
| Profile Update | Save button | `updateProfileMutation` | `rpc('update_profile')` | Invalidate profile query |
| Photo Upload | Image selected | `uploadPhoto()` | Storage.upload + `rpc('update_profile')` | Photo appears in grid |
| Discovery Load | Screen mount | `useDiscovery` | `rpc('get_profiles')` | Card stack renders |
| Like Profile | Swipe right | `likeMutation` | `rpc('like_profile')` | Card removed; match modal if match |
| Skip Profile | Swipe left | `skipMutation` | `rpc('skip_profile')` | Card removed |
| Chat Open | Tap match | `connectSendbird` | Sendbird connect + getChannel | Chat UI loads |
| Send Message | Send button | `channel.sendUserMessage` | Sendbird server | Message appears; push to other user |
| QR Generate | QR tab open | `useAuth` | `auth.uid()` | QR code renders |
| QR Scan | Camera scan | `handleBarCodeScanned` | `rpc('get_profile_by_id')` | Navigate to profile |
| BLE Start | Nearby tab | `useBLE.startScanning` | `rpc('resolve_proximity_session')` | Nearby user cards |
| Places Load | Places tab | `usePlaces` | `rpc('get_nearby_places')` | Map + list render |