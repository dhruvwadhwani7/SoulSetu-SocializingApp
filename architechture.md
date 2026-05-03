# Soul Setu — System Architecture Documentation

## 1. High-Level Architecture

Soul Setu follows a **serverless, event-driven architecture** with a React Native mobile frontend, a Supabase-managed backend, and multiple external API integrations. The system is designed as a modular monolith at the backend (all logic in PostgreSQL RPC) with microservice-like external service integrations for chat (Sendbird), auth/SMS (Twilio), and geospatial data (OSM/Foursquare).

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                  │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │              React Native App (iOS + Android)                   │  │
│  │  Expo Router │ React Query │ NativeWind │ Sendbird UIKit SDK    │  │
│  │  Expo Camera │ BLE PLX │ GPS │ QR SVG │ Image Picker           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼───────────────────────────────────────┐
│                      SUPABASE PLATFORM                                │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  PostgREST   │  │  Supabase    │  │  Supabase    │  │ Realtime │  │
│  │  (REST API)  │  │  Auth        │  │  Storage     │  │  (WS)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │
│         └─────────────────┼─────────────────┼──────────────┘         │
│                           │                 │                         │
│  ┌────────────────────────▼─────────────────▼───────────────────────┐ │
│  │                  PostgreSQL 15 + PostGIS                          │ │
│  │  Profiles │ Interactions │ Proximity │ Chat │ Location Cache      │ │
│  │  RPC Functions │ Triggers │ RLS Policies │ Vault                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTP/REST (from RPC or Frontend)
┌──────────────────────────────▼───────────────────────────────────────┐
│                    EXTERNAL SERVICES                                  │
│                                                                        │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Twilio  │  │  Sendbird  │  │  Foursquare  │  │ OpenStreetMap │  │
│  │  OTP SMS │  │  Chat API  │  │  Places API  │  │ Overpass API  │  │
│  └──────────┘  └────────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Three-Layer Architecture

### Layer 1: Presentation Layer (React Native)

Responsibilities:
- All UI rendering and state presentation
- Hardware I/O: Camera (QR scanning), BLE scanner/advertiser, GPS
- Server-state management via React Query
- Deep link routing via Expo Router
- Sendbird SDK integration for chat UI

**Does NOT contain:**
- Business logic (no validation beyond form input)
- Direct database access
- API credentials (all via environment variables or server-fetched)

### Layer 2: Application Logic Layer (Supabase RPC + Auth)

Responsibilities:
- All business rules in PostgreSQL stored procedures
- Identity validation (`auth.uid()` on every sensitive operation)
- Matchmaking algorithm (spatial + preference filtering)
- BLE token lifecycle management
- External API orchestration (Sendbird channel CRUD from RPC)

### Layer 3: Data Management Layer (PostgreSQL + PostGIS + Storage)

Responsibilities:
- Persistent data storage with relational integrity
- Geospatial indexing and queries (PostGIS GIST)
- RLS-enforced data isolation per user
- Encrypted secrets (Supabase Vault)
- Profile media storage (Storage buckets)

---

## 3. Module Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SOUL SETU MODULES                            │
├──────────────┬───────────────┬──────────────┬────────────────────────┤
│ AUTH MODULE  │ PROFILE       │ DISCOVERY    │ INTERACTION MODULE      │
│              │ MODULE        │ MODULE       │                         │
│ OTP via      │ Profile CRUD  │ get_profiles │ like_profile()          │
│ Twilio       │ Photo upload  │ PostGIS      │ skip_profile()          │
│ Supabase     │ update_profile│ spatial      │ match()                 │
│ Auth JWT     │ JSONB arrays  │ filtering    │ unmatch()               │
│ handle_new   │ Storage       │ Age/Gender   │ Sendbird channel        │
│ _user()      │ bucket        │ filters      │ create/delete           │
├──────────────┼───────────────┼──────────────┼────────────────────────┤
│ CHAT MODULE  │ QR MODULE     │ BLE MODULE   │ LOCATION MODULE         │
│              │               │              │                         │
│ Sendbird SDK │ QR SVG gen    │ BLE PLX scan │ GPS coordinates         │
│ GroupChannel │ Deep link     │ Native BLE   │ OSM Overpass API        │
│ ListFragment │ UUID encode   │ advertise    │ Foursquare Places       │
│ Real-time    │ Expo Camera   │ Token gen    │ Supabase location       │
│ messaging    │ scan+parse    │ resolve RPC  │ cache (1h TTL)          │
│ Sendbird Vault│ Profile view │ Session TTL  │ Hybrid enrichment       │
└──────────────┴───────────────┴──────────────┴────────────────────────┘
```

---

## 4. Data Flow: End-to-End per Feature

### 4.1 Authentication Flow

```
[User] Enter Phone Number
    │
    ▼
[Frontend] supabase.auth.signInWithOtp({ phone })
    │
    ▼ HTTPS POST
[Supabase Auth] Generates 6-digit TOTP code
    │
    ▼ REST API
[Twilio] Delivers SMS: "Your Soul Setu code: 123456"
    │
    ▼
[User] Enters OTP in app
    │
    ▼
[Frontend] supabase.auth.verifyOtp({ phone, token })
    │
    ▼ JWT issued by Supabase Auth
[Supabase Auth] Validates OTP, creates session
    │
    ▼ DB Trigger fires
[PostgreSQL] handle_new_user() inserts blank profiles row
    │
    ▼
[Frontend] Receives JWT, persists to AsyncStorage
    │
    ▼
[App] Navigates to Onboarding (if new) or Discovery (if returning)
```

**Request:** `POST /auth/v1/otp` body `{ phone: '+91XXXXXXXXXX' }`  
**Response:** `200 OK` (OTP sent)  
**Second Request:** `POST /auth/v1/verify` body `{ phone, token, type: 'sms' }`  
**Response:** `{ access_token, refresh_token, user: { id, phone } }`

---

### 4.2 Profile Discovery Flow

```
[User] Opens Discover tab
    │
    ▼
[Frontend] useDiscovery() hook fires
    │
    ▼ React Query checks cache (staleTime: 2min)
    │ Cache miss → API call
    ▼
[Frontend] supabase.rpc('get_profiles', { p_offset: 0, p_limit: 10 })
    │
    ▼ HTTPS POST /rest/v1/rpc/get_profiles
    │ Headers: Authorization: Bearer {JWT}
    ▼
[Supabase PostgREST] Routes to PostgreSQL
    │
    ▼
[get_profiles() RPC]
    1. auth.uid() → resolve caller's profile
    2. Load caller preferences (age, gender, max_distance_km)
    3. ST_DWithin(p.location, caller.location, max_dist_meters) [GIST index]
    4. EXTRACT(AGE(dob)) BETWEEN min_age AND max_age
    5. gender_id = ANY(profile_gender_preferences)
    6. NOT IN (SELECT target_id FROM interactions WHERE actor_id = caller)
    7. ORDER BY ST_Distance ASC
    8. LIMIT 10 OFFSET 0
    9. Aggregate photos + answers as JSONB
    │
    ▼ Returns JSONB array of 10 profiles
[Frontend] React Query caches result
    │
    ▼
[UI] CardStack renders top 3 profiles from array
    │
    ▼ User swipes left (skip)
[Frontend] Optimistic: remove card from stack
[Frontend] supabase.rpc('skip_profile', { p_target_id })
    │
    ▼
[skip_profile() RPC] INSERT into interactions (skip)
    │
    ▼ When 3 cards left → React Query prefetches next page
    │ useInfiniteQuery getNextPageParam → offset 10
```

---

### 4.3 Match + Chat Creation Flow

```
[User A] Swipes right on User B
    │
    ▼
[like_profile(B)] RPC
    1. INSERT interactions (A→B, 'like')
    2. SELECT: does (B→A, 'like') exist?
    │
    ├── NO: return { matched: false }
    │   └── [UI] Continue swiping
    │
    └── YES: mutual like detected!
        │
        ▼
    [match(A, B)] function called
        1. Fetch Sendbird token from Vault
        2. Generate channel_url: "soulsetu_{A_id}_{B_id}"
        3. HTTP POST to Sendbird API → create GroupChannel
        4. INSERT chat_channels (channel_url)
        5. INSERT chat_participants (A, B)
        6. UPDATE interactions → status = 'match'
        │
        ▼ Returns channel_url
    [Frontend] Receives { matched: true, channel_url }
        │
        ▼
    [UI] Match animation modal shown
        ├── "Start Chat" → navigate to /chat/{channel_url}
        └── "Maybe later" → continue swiping
```

---

### 4.4 QR Profile Sharing Flow

```
ACTOR 1 (QR Generator):
[User A] Opens QR tab
    │
    ▼ auth.uid() available in frontend
[Frontend] deepLink = 'soulsetu://profile/' + user.id
    │
    ▼ UUID entropy validation + app scheme check
[Frontend] <QRCode value={deepLink} /> renders
    │
    ▼ User taps "Share QR"
[captureRef(qrRef)] → PNG image URI
    │
    ▼
[Sharing.shareAsync(uri)] → Native share sheet

ACTOR 2 (QR Scanner):
[User B] Opens Scan QR screen
    │
    ▼
[Expo Camera] Permission check → enable camera
    │
    ▼
[Camera.onBarCodeScanned] receives data: 'soulsetu://profile/UUID'
    │
    ▼ Extract UUID, check Supabase session
[Frontend] supabase.rpc('get_profile_by_id', { p_profile_id: UUID })
    │
    ▼ RPC validates:
    │  - Caller is authenticated
    │  - Target profile exists
    │  - Returns only: first_name, age, 1 photo, distance (RLS filtered)
    ▼
[Frontend] router.push('/profile/' + UUID)
    │
    ▼
[ProfileViewScreen] renders filtered profile data
```

---

### 4.5 BLE Proximity Flow

```
ACTOR 1 (Advertiser):
[User A] Opens Nearby tab
    │
    ▼
[supabase.rpc('start_proximity_session')]
    1. gen_random_bytes(16) → 32-hex token
    2. Deactivate old sessions
    3. INSERT proximity_sessions { token, expires_at: +2h }
    4. Return { token, token_prefix (first 12 chars) }
    │
    ▼ token_prefix = 'a3f7b2c1e490'
[BLEAdvertiser.startAdvertising({ manufacturerData: token_prefix })]
    │
    ▼ BLE signal broadcast ~10m radius

ACTOR 2 (Scanner):
[User B] Nearby tab → Bluetooth ON, permissions granted
    │
    ▼
[BleManager.startDeviceScan()]
    │
    ▼ Device B detects A's BLE signal
[device.manufacturerData] → extract 12-hex prefix
    │
    ▼ Debounce: skip if seen < 30s ago
[supabase.rpc('resolve_proximity_session', { p_token_prefix })]
    │
    ▼
[resolve_proximity_session() RPC]
    1. SELECT profile_id FROM proximity_sessions
       WHERE LEFT(session_token, 12) = token_prefix
         AND is_active = TRUE AND expires_at > NOW()
       -- Uses functional index → O(log n)
    2. Prevent self-resolution check
    3. INSERT proximity_events (audit log)
    4. Return filtered profile: { id, first_name, age, 1 photo, distance }
    │
    ▼
[UI] NearbyUserCard appears for User A
    │
    ▼ Pruning: users inactive >60s removed from list
    ▼ Retry: if network fails, exponential backoff on RPC
```

---

### 4.6 Nearby Places Flow

```
[User] Opens Places tab
    │
    ▼
[useLocation()] → GPS: { lat: 23.0225, lng: 72.5714 }
    │
    ▼
[usePlaces(lat, lng, 2000)] → React Query
    │
    ▼
[supabase.rpc('get_nearby_places', { p_lat, p_lng, p_radius_km: 2 })]
    │
    ├── Cache HIT (< 1h old):
    │   └── Return cached JSONB → render list/map
    │
    └── Cache MISS:
        │
        ├── [Foursquare API] GET /v3/places/search?ll={lat,lng}&radius=2000
        │   Response: [{ name, category, rating, distance, fsq_id }]
        │
        ├── [OSM Overpass API] POST query for cafes/restaurants/parks
        │   Response: [{ id, name, lat, lon, tags }]
        │
        ├── [Frontend] Merge datasets by proximity
        │   - OSM provides: raw coordinates, OSM type tags
        │   - Foursquare provides: category icons, ratings, hours
        │
        ├── [supabase.rpc('cache_nearby_places', { key, data })]
        │
        └── [UI] MapView markers + ListView cards
```

---

## 5. Request/Response Lifecycle

### 5.1 Standard RPC Call

```
Frontend
  POST https://{ref}.supabase.co/rest/v1/rpc/{function_name}
  Headers:
    apikey: {anon_key}              ← Public key, safe to expose
    Authorization: Bearer {JWT}     ← User's session token
    Content-Type: application/json
  Body: { "p_param": "value" }

Supabase PostgREST Gateway:
  1. Validates JWT signature (HS256 with Supabase JWT secret)
  2. Extracts auth.uid() from JWT claims
  3. Sets current_user = authenticated
  4. Calls PostgreSQL function
  5. Returns JSONB result

PostgreSQL Function:
  1. auth.uid() available as session variable
  2. SECURITY DEFINER bypasses RLS if needed
  3. Business logic executes
  4. Returns JSONB

HTTP Response:
  200 OK → { ...result }
  400 Bad Request → { error: "message" }
  401 Unauthorized → JWT invalid/expired
  500 Internal Server Error → PostgreSQL exception
```

### 5.2 Sendbird Real-Time Message Lifecycle

```
User A sends message
  → channel.sendUserMessage({ message: 'Hello' })
  → Sendbird SDK encrypts + sends to Sendbird WebSocket server
  → Sendbird stores message, assigns message_id + timestamp
  → Sendbird pushes WebSocket event to User B's active connection
      Event: { type: 'MESSAGE_RECEIVED', channel, message }

User B's SDK handler:
  isScreenOpen?
    YES → append to local message array → UI updates
    NO  → channel.unreadMessageCount++ → badge updates
          channel.lastMessage = message → list preview updates

Read receipt:
  User B opens chat → channel.markAsRead()
  → Sendbird broadcasts READ_RECEIPT to User A
  → User A's UI updates: ✓✓ marks
```

---

## 6. Security Architecture

### 6.1 JWT Flow

```
Supabase Auth issues JWT after OTP verification:
  {
    "iss": "https://xxx.supabase.co/auth/v1",
    "sub": "auth_user_uuid",               ← becomes auth.uid()
    "aud": "authenticated",
    "exp": 1234567890,                     ← 1 hour expiry
    "phone": "+91XXXXXXXXXX",
    "role": "authenticated"
  }
```

JWT is verified on every request by PostgREST using the Supabase JWT secret (HMAC-SHA256). Expired JWTs trigger a 401 response; the client uses the refresh token to get a new pair.

### 6.2 Defense-in-Depth

```
Attack Surface          │ Mitigation
───────────────────────────────────────────────────────────────────
Unauthorized read       │ RLS: user_id = auth.uid() on profiles
Cross-user write        │ SECURITY DEFINER + auth.uid() resolution
BLE stalking            │ 12-char prefix only; 2h token expiry; audit log
API credential leak     │ Supabase Vault (AES-256 encrypted)
Photo unauthorized write│ Storage policy: folder = auth.uid()
SQL injection           │ Parameterized RPC arguments
OTP brute force         │ 60s cooldown + 5min expiry
JWT tampering           │ HS256 signature verification
Network interception    │ TLS 1.3 enforced by Supabase
```

---

## 7. System Architecture Diagram (Module-Level)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              User Mobile App                             │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │ Profile  │  │ Discover │  │  Chat    │  │ Nearby   │  │
│  │  Screen  │  │  Screen  │  │  Screen  │  │  Screen  │  │ Screen   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │              │        │
│  ┌────▼──────────────▼──────────────▼──────────────▼──────────────▼────┐ │
│  │                         React Query State Layer                      │ │
│  │               (useAuth / useProfile / useDiscovery /                 │ │
│  │                useChat / useBLE / usePlaces)                         │ │
│  └────────────────────────────────┬────────────────────────────────────┘ │
└───────────────────────────────────┼────────────────────────────────────── ┘
                                    │
          ┌─────────────────────────┼──────────────────────────────┐
          │                         │                              │
    ┌─────▼──────┐          ┌───────▼────────┐          ┌──────────▼──────┐
    │  Supabase  │          │   Sendbird     │          │  External APIs  │
    │  Auth API  │          │   Chat API     │          │  (Foursquare /  │
    │  (Twilio)  │          │   WebSocket    │          │   OSM Overpass) │
    └─────┬──────┘          └───────┬────────┘          └─────────────────┘
          │                         │
    ┌─────▼──────────────────────────▼────────────────────┐
    │                   PostgreSQL + PostGIS               │
    │                                                      │
    │  handle_new_user │ update_profile │ get_profiles     │
    │  like_profile │ skip_profile │ match │ unmatch       │
    │  start_proximity │ resolve_proximity                 │
    │  get_nearby_places │ cache_nearby_places             │
    │                                                      │
    │  [profiles] [interactions] [chat_channels]           │
    │  [proximity_sessions] [proximity_events]             │
    │  [location_cache] [reference tables]                 │
    │                                                      │
    │  Supabase Storage (profile photos)                   │
    │  Supabase Vault (Sendbird API token)                 │
    └──────────────────────────────────────────────────────┘
```

---

## 8. DSA Usage in System Design

### 8.1 Spatial Indexing — R-Tree (GIST)

PostGIS GIST index is a **generalized R-tree**. When `ST_DWithin` executes:
1. Traverses R-tree to find bounding boxes intersecting the search circle
2. Prunes subtrees outside the radius in O(log n)
3. Applies exact distance check only on candidates
- **Worst case:** O(n) if all points are within radius
- **Average case:** O(k log n) where k = result count

### 8.2 Token Prefix — HashMap Analogy

The functional index `LEFT(session_token, 12)` on `proximity_sessions` is conceptually a **hash map** where 12-hex prefix = key, profile = value:
- Insert: O(log n) via B-tree index
- Lookup: O(log n) via B-tree on functional expression
- Collision resistance: 12 hex = 6 bytes = 48 bits → 1 in 2^48 collision probability

### 8.3 Discovery Queue — Priority Queue Pattern

The discovery feed ordered by `ST_Distance ASC` implements a **nearest-neighbor priority queue**:
- PostgreSQL uses the KNN operator `<->` for ordered traversal
- With GIST index, this is O(k log n) for top-k nearest results
- Infinite scroll pagination = chunked extraction from the ordered sequence

### 8.4 Interaction Deduplication — Set Membership

The `UNIQUE (actor_id, target_id)` constraint on `interactions` + `ON CONFLICT DO UPDATE` implements **upsert semantics** — equivalent to a hash set `contains()` check + conditional insert in O(log n) via unique index.

### 8.5 Nearby Users List — LRU-like Expiry

The frontend BLE nearby user list uses a **Map<token, timestamp>** for debouncing + a 60-second timeout to prune stale entries. This is equivalent to an LRU cache with TTL-based eviction:
- O(1) lookup by token prefix (JS Map)
- O(n) eviction scan every 15 seconds (small n in practice, typically < 20 users)

---

## 9. Scalability Analysis

### 9.1 Vertical Scaling Limits

| Component | Current Limit | Bottleneck |
|---|---|---|
| Supabase Free/Pro | 500MB DB, 1GB storage | Pro plan removes most limits |
| PostgREST | Scales with PG connections | PGBouncer connection pooling |
| Sendbird | 100 MAU free tier | Per-plan pricing |
| Twilio OTP | 1 SMS/60s per number | Configurable |
| Foursquare API | 950 calls/day free | Rate limiting required |

### 9.2 Horizontal Scaling Strategy

```
Users 0–10K:    Single Supabase instance (current)
Users 10K–100K: Supabase Pro + Read replicas for get_profiles()
Users 100K+:    Shard profiles by geography (PostGIS-native partitioning)
                Redis (Upstash) for location cache
                CDN for profile photos (Cloudflare Images)
                Sendbird Enterprise (multi-region WebSocket)
```

### 9.3 Discovery Query Optimization at Scale

```sql
-- Current (up to ~100K users): single table scan with GIST
-- At 1M+ users: geo-sharding by h3 index

-- Add H3 geospatial index (Uber's hexagonal grid)
ALTER TABLE profiles ADD COLUMN h3_index TEXT
  GENERATED ALWAYS AS (h3_geo_to_h3index(ST_Y(location::geometry),
                                          ST_X(location::geometry), 7)) STORED;
CREATE INDEX profiles_h3_idx ON profiles (h3_index);

-- Query first narrows by H3 hex cell, then PostGIS for exact distance
```

---

## 10. Deployment Architecture

```
Source Code (GitHub)
    │
    ▼ CI trigger
EAS Build (Expo Application Services)
    ├── iOS build → IPA → TestFlight → App Store
    └── Android build → AAB → Play Console → Play Store

Backend:
    Supabase Cloud (managed PostgreSQL + PostGIS)
        ├── SQL migrations via supabase db push
        ├── Storage buckets (profiles photos)
        └── Vault (Sendbird credentials)

Docker (local/staging):
    docker-compose up
        ├── supabase/postgres (local DB)
        ├── supabase/kong (API gateway)
        └── supabase/studio (DB admin UI)

OTA Updates (no App Store review):
    eas update --branch production
    (JS bundle pushed to EAS CDN, downloaded on next app open)
```

---

## 11. Trade-off Analysis

| Decision | Choice Made | Alternative | Rationale |
|---|---|---|---|
| Backend pattern | Supabase RPC | Node.js/Express REST | No server management; RLS co-located with data; faster dev |
| Auth | OTP via Twilio | Social OAuth | Indian market preference for phone-first auth; no email required |
| Chat | Sendbird | Custom WebSocket | Message history, delivery receipts, offline handling handled by Sendbird |
| Geospatial | PostGIS | Elasticsearch geo | PostGIS co-located with profile data; avoids data duplication |
| State management | React Query | Redux/Zustand | Server-state is primary; React Query eliminates boilerplate |
| BLE advertising | Native module | Expo BLE | Expo doesn't expose BLE peripheral mode; native required |
| Location API | OSM + Foursquare hybrid | Google Places only | Cost (OSM is free); Foursquare for metadata quality |
| Token security | 12-char prefix broadcast | Full UUID broadcast | Reduces BLE sniffing attack surface significantly |
| Profile update | Single RPC (atomic) | Multiple table REST | Atomicity guaranteed; no partial update states |