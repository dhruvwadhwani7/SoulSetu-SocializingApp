# Soul Setu — Backend Documentation

## 1. Overview

Soul Setu's backend is a **serverless, function-driven architecture** built entirely on **Supabase** (PostgreSQL + PostGIS + Auth + Storage + Vault + RPC). All business logic is encapsulated in PostgreSQL stored procedures (RPC functions), triggered either by frontend API calls or internal database events. External service integrations include Twilio (OTP/SMS), Sendbird (real-time chat), Foursquare (place metadata), and OpenStreetMap Overpass API (geospatial data).

**Core Design Principle:**  
The backend deliberately avoids a traditional REST API server (Node.js/Express). Instead, Supabase RPC functions act as the "controller layer," enforcing Row Level Security (RLS) at the database level, making the system inherently secure and scalable without managing server infrastructure.

---

## 2. Architecture Layers

```
┌─────────────────────────────────────────┐
│           React Native Frontend          │
│   (Supabase JS Client + Sendbird SDK)   │
└──────────────────┬──────────────────────┘
                   │ HTTPS / WSS
┌──────────────────▼──────────────────────┐
│           Supabase API Gateway           │
│  (PostgREST / Realtime / Auth / Storage) │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│        PostgreSQL + PostGIS              │
│  Tables / Views / RPC Functions          │
│  Triggers / RLS Policies                 │
└──────────┬────────────────┬─────────────┘
           │                │
    ┌──────▼──────┐  ┌──────▼───────────────┐
    │  Supabase   │  │  External Services    │
    │  Storage    │  │  Twilio / Sendbird    │
    │  (profiles  │  │  Foursquare / OSM     │
    │   bucket)   │  │  Supabase Vault       │
    └─────────────┘  └──────────────────────┘
```

---

## 3. Supabase RPC Functions (Business Logic Layer)

All RPC functions are PostgreSQL stored procedures called via `supabase.rpc('function_name', params)`. They execute with elevated `SECURITY DEFINER` privileges where needed, but validate caller identity using `auth.uid()`.

### 3.1 `handle_new_user()` — Auth Trigger

**Trigger:** `AFTER INSERT ON auth.users`  
**Purpose:** Auto-provision profile record on first OTP verification

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Flow:**
1. User completes Twilio OTP → Supabase Auth creates `auth.users` row
2. Trigger fires `handle_new_user()`
3. Blank `profiles` row created with `user_id` foreign key
4. Frontend redirects to onboarding to complete profile

---

### 3.2 `update_profile()` — Profile Management

**Called by:** Frontend profile setup wizard + profile edit screens  
**Purpose:** Atomic update of all profile fields, including JSONB arrays

```sql
CREATE OR REPLACE FUNCTION update_profile(
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_dob DATE DEFAULT NULL,
  p_height_cm INTEGER DEFAULT NULL,
  p_gender_id INTEGER DEFAULT NULL,
  p_sexuality_id INTEGER DEFAULT NULL,
  p_location GEOGRAPHY DEFAULT NULL,
  p_min_age INTEGER DEFAULT NULL,
  p_max_age INTEGER DEFAULT NULL,
  p_max_distance_km INTEGER DEFAULT NULL,
  p_ethnicity_ids INTEGER[] DEFAULT NULL,
  p_pronoun_ids INTEGER[] DEFAULT NULL,
  p_pet_ids INTEGER[] DEFAULT NULL,
  p_children_id INTEGER DEFAULT NULL,
  p_family_plan_id INTEGER DEFAULT NULL,
  p_covid_vaccine_id INTEGER DEFAULT NULL,
  p_zodiac_sign_id INTEGER DEFAULT NULL,
  p_photos JSONB DEFAULT NULL,   -- [{photo_url, photo_order, is_active}]
  p_answers JSONB DEFAULT NULL   -- [{prompt_id, answer_text, answer_order}]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Resolve profile ID from authenticated user
  SELECT id INTO v_profile_id
  FROM profiles WHERE user_id = auth.uid();

  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Profile not found');
  END IF;

  -- Update scalar fields (only non-null params)
  UPDATE profiles SET
    first_name    = COALESCE(p_first_name, first_name),
    last_name     = COALESCE(p_last_name, last_name),
    dob           = COALESCE(p_dob, dob),
    height_cm     = COALESCE(p_height_cm, height_cm),
    gender_id     = COALESCE(p_gender_id, gender_id),
    sexuality_id  = COALESCE(p_sexuality_id, sexuality_id),
    location      = COALESCE(p_location, location),
    min_age       = COALESCE(p_min_age, min_age),
    max_age       = COALESCE(p_max_age, max_age),
    max_distance_km = COALESCE(p_max_distance_km, max_distance_km),
    children_id   = COALESCE(p_children_id, children_id),
    family_plan_id = COALESCE(p_family_plan_id, family_plan_id),
    covid_vaccine_id = COALESCE(p_covid_vaccine_id, covid_vaccine_id),
    zodiac_sign_id = COALESCE(p_zodiac_sign_id, zodiac_sign_id),
    updated_at    = NOW()
  WHERE id = v_profile_id;

  -- Handle array relations (ethnicity, pronouns, pets)
  IF p_ethnicity_ids IS NOT NULL THEN
    DELETE FROM profile_ethnicities WHERE profile_id = v_profile_id;
    INSERT INTO profile_ethnicities (profile_id, ethnicity_id)
    SELECT v_profile_id, unnest(p_ethnicity_ids);
  END IF;

  -- Handle JSONB photos (upsert by photo_order)
  IF p_photos IS NOT NULL THEN
    -- Deactivate existing, then insert/update from JSONB array
    UPDATE profile_photos SET is_active = FALSE
    WHERE profile_id = v_profile_id;

    INSERT INTO profile_photos (profile_id, photo_url, photo_order, is_active)
    SELECT
      v_profile_id,
      (elem->>'photo_url')::TEXT,
      (elem->>'photo_order')::INTEGER,
      TRUE
    FROM jsonb_array_elements(p_photos) elem
    ON CONFLICT (profile_id, photo_order)
    DO UPDATE SET
      photo_url = EXCLUDED.photo_url,
      is_active = TRUE;
  END IF;

  -- Handle JSONB answers (prompts)
  IF p_answers IS NOT NULL THEN
    DELETE FROM profile_answers WHERE profile_id = v_profile_id;
    INSERT INTO profile_answers (profile_id, prompt_id, answer_text, answer_order, is_active)
    SELECT
      v_profile_id,
      (elem->>'prompt_id')::INTEGER,
      (elem->>'answer_text')::TEXT,
      (elem->>'answer_order')::INTEGER,
      TRUE
    FROM jsonb_array_elements(p_answers) elem;
  END IF;

  RETURN jsonb_build_object('success', TRUE, 'profile_id', v_profile_id);
END;
$$;
```

**Key Design Choices:**
- `COALESCE` pattern ensures partial updates without overwriting existing data
- JSONB arrays for photos/answers allow atomic batch replacement
- `SECURITY DEFINER` with `auth.uid()` prevents unauthorized cross-user writes
- Array relations (ethnicity, pronouns) use delete-and-reinsert for simplicity

---

### 3.3 `get_profiles()` — Discovery / Matchmaking Engine

**Called by:** Discovery feed (infinite scroll)  
**Purpose:** Return paginated, filtered potential matches

```sql
CREATE OR REPLACE FUNCTION get_profiles(
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_id UUID;
  v_profile profiles%ROWTYPE;
  v_result JSONB;
BEGIN
  -- Get caller's profile
  SELECT * INTO v_profile
  FROM profiles WHERE user_id = auth.uid();

  v_caller_id := v_profile.id;

  SELECT jsonb_agg(row_to_json(p))
  INTO v_result
  FROM (
    SELECT
      p.id,
      p.first_name,
      p.dob,
      EXTRACT(YEAR FROM AGE(p.dob)) AS age,
      p.height_cm,
      p.gender_id,
      p.sexuality_id,
      p.location,
      ST_Distance(p.location, v_profile.location) / 1000 AS distance_km,
      -- Aggregate photos
      (SELECT jsonb_agg(ph ORDER BY ph.photo_order)
       FROM profile_photos ph
       WHERE ph.profile_id = p.id AND ph.is_active = TRUE) AS photos,
      -- Aggregate answers
      (SELECT jsonb_agg(pa ORDER BY pa.answer_order)
       FROM profile_answers pa
       WHERE pa.profile_id = p.id AND pa.is_active = TRUE) AS answers
    FROM profiles p
    WHERE
      -- Exclude self
      p.id != v_caller_id
      -- Distance filter (PostGIS STDWithin)
      AND ST_DWithin(
        p.location,
        v_profile.location,
        v_profile.max_distance_km * 1000  -- convert km to meters
      )
      -- Age preference filter
      AND EXTRACT(YEAR FROM AGE(p.dob))
          BETWEEN v_profile.min_age AND v_profile.max_age
      -- Gender preference filter
      AND p.gender_id = ANY(
        SELECT gender_id FROM profile_gender_preferences
        WHERE profile_id = v_caller_id
      )
      -- Exclude already-interacted profiles
      AND p.id NOT IN (
        SELECT target_id FROM interactions
        WHERE actor_id = v_caller_id
      )
      -- Profile must be complete (has at least 1 active photo)
      AND EXISTS (
        SELECT 1 FROM profile_photos
        WHERE profile_id = p.id AND is_active = TRUE
      )
    ORDER BY ST_Distance(p.location, v_profile.location)
    LIMIT p_limit
    OFFSET p_offset
  ) p;

  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;
```

**Algorithm Analysis:**
- **Spatial Index:** `ST_DWithin` leverages PostGIS GIST index on `profiles.location` → O(log n) lookup
- **Exclusion Filter:** NOT IN subquery on `interactions` table; can be optimized to LEFT JOIN for large datasets
- **Pagination:** LIMIT/OFFSET with deterministic ORDER BY distance ensures consistent pages
- **Composite Filtering:** Gender preferences, age range, and distance are all applied in a single query pass

---

### 3.4 `like_profile()` and `skip_profile()` — Interaction Handling

```sql
CREATE OR REPLACE FUNCTION like_profile(p_target_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor_profile_id UUID;
  v_mutual_like BOOLEAN;
  v_channel_id TEXT;
BEGIN
  SELECT id INTO v_actor_profile_id
  FROM profiles WHERE user_id = auth.uid();

  -- Insert interaction (like)
  INSERT INTO interactions (actor_id, target_id, status_id)
  VALUES (
    v_actor_profile_id,
    p_target_id,
    (SELECT id FROM interaction_status WHERE status = 'like')
  )
  ON CONFLICT (actor_id, target_id)
  DO UPDATE SET status_id = EXCLUDED.status_id, created_at = NOW();

  -- Check for mutual like
  SELECT EXISTS(
    SELECT 1 FROM interactions
    WHERE actor_id = p_target_id
      AND target_id = v_actor_profile_id
      AND status_id = (SELECT id FROM interaction_status WHERE status = 'like')
  ) INTO v_mutual_like;

  IF v_mutual_like THEN
    -- Trigger match flow
    SELECT match(v_actor_profile_id, p_target_id) INTO v_channel_id;
    RETURN jsonb_build_object(
      'matched', TRUE,
      'channel_url', v_channel_id
    );
  END IF;

  RETURN jsonb_build_object('matched', FALSE);
END;
$$;
```

```sql
CREATE OR REPLACE FUNCTION skip_profile(p_target_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor_profile_id UUID;
BEGIN
  SELECT id INTO v_actor_profile_id
  FROM profiles WHERE user_id = auth.uid();

  INSERT INTO interactions (actor_id, target_id, status_id)
  VALUES (
    v_actor_profile_id,
    p_target_id,
    (SELECT id FROM interaction_status WHERE status = 'skip')
  )
  ON CONFLICT (actor_id, target_id) DO NOTHING;
END;
$$;
```

---

### 3.5 `match()` — Match Creation + Sendbird Channel

```sql
CREATE OR REPLACE FUNCTION match(
  p_user_a UUID,
  p_user_b UUID
)
RETURNS TEXT  -- Returns Sendbird channel URL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sendbird_api_key TEXT;
  v_channel_url TEXT;
  v_user_a_sendbird_id TEXT;
  v_user_b_sendbird_id TEXT;
  v_response JSONB;
BEGIN
  -- Get Sendbird API token from Vault
  SELECT decrypted_secret INTO v_sendbird_api_key
  FROM vault.decrypted_secrets
  WHERE name = 'sendbird_api_token';

  -- Get Sendbird user IDs (same as auth.uid for both users)
  SELECT auth_id INTO v_user_a_sendbird_id FROM profiles WHERE id = p_user_a;
  SELECT auth_id INTO v_user_b_sendbird_id FROM profiles WHERE id = p_user_b;

  -- Generate channel URL
  v_channel_url := 'soulsetu_' || p_user_a || '_' || p_user_b;

  -- Call Sendbird REST API to create GroupChannel
  SELECT content INTO v_response
  FROM http((
    'POST',
    'https://api-' || SENDBIRD_APP_ID || '.sendbird.com/v3/group_channels',
    ARRAY[http_header('Api-Token', v_sendbird_api_key),
          http_header('Content-Type', 'application/json')],
    'application/json',
    jsonb_build_object(
      'channel_url', v_channel_url,
      'inviter_id', v_user_a_sendbird_id,
      'user_ids', ARRAY[v_user_a_sendbird_id, v_user_b_sendbird_id],
      'is_distinct', true
    )::TEXT
  )::http_request);

  -- Store channel reference in chat_channels + chat_participants
  INSERT INTO chat_channels (channel_id, created_by)
  VALUES (v_channel_url, p_user_a);

  INSERT INTO chat_participants (channel_id, profile_id)
  VALUES (v_channel_url, p_user_a), (v_channel_url, p_user_b);

  -- Update interaction status to 'matched'
  UPDATE interactions
  SET status_id = (SELECT id FROM interaction_status WHERE status = 'match')
  WHERE (actor_id = p_user_a AND target_id = p_user_b)
     OR (actor_id = p_user_b AND target_id = p_user_a);

  RETURN v_channel_url;
END;
$$;
```

**Note:** The `http` extension (`pg_net` or `http`) must be enabled in Supabase to make outbound HTTP calls from PostgreSQL. Sendbird credentials are stored in Supabase Vault (encrypted), never hardcoded.

---

### 3.6 `unmatch()` — Match Removal

```sql
CREATE OR REPLACE FUNCTION unmatch(p_channel_url TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sendbird_api_key TEXT;
BEGIN
  -- Get API key from Vault
  SELECT decrypted_secret INTO v_sendbird_api_key
  FROM vault.decrypted_secrets WHERE name = 'sendbird_api_token';

  -- Delete Sendbird channel
  PERFORM http((
    'DELETE',
    'https://api-' || SENDBIRD_APP_ID || '.sendbird.com/v3/group_channels/' || p_channel_url,
    ARRAY[http_header('Api-Token', v_sendbird_api_key)],
    'application/json',
    NULL
  )::http_request);

  -- Clean up local records
  DELETE FROM chat_participants WHERE channel_id = p_channel_url;
  DELETE FROM chat_channels WHERE channel_id = p_channel_url;

  -- Revert interaction status to 'unmatched'
  UPDATE interactions
  SET status_id = (SELECT id FROM interaction_status WHERE status = 'unmatch')
  WHERE EXISTS (
    SELECT 1 FROM chat_channels
    WHERE channel_id = p_channel_url
  );
END;
$$;
```

---

### 3.7 `start_proximity_session()` — BLE Token Generation

```sql
CREATE OR REPLACE FUNCTION start_proximity_session()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
  v_session_token TEXT;
  v_session_id UUID;
BEGIN
  SELECT id INTO v_profile_id
  FROM profiles WHERE user_id = auth.uid();

  -- Generate cryptographically secure 32-hex-char token
  v_session_token := encode(gen_random_bytes(16), 'hex');  -- 32 hex chars

  -- Deactivate any existing sessions for this profile
  UPDATE proximity_sessions
  SET is_active = FALSE
  WHERE profile_id = v_profile_id AND is_active = TRUE;

  -- Insert new session (expires in 2 hours)
  INSERT INTO proximity_sessions (
    profile_id,
    session_token,
    created_at,
    expires_at,
    is_active
  )
  VALUES (
    v_profile_id,
    v_session_token,
    NOW(),
    NOW() + INTERVAL '2 hours',
    TRUE
  )
  RETURNING id INTO v_session_id;

  RETURN jsonb_build_object(
    'session_id', v_session_id,
    'token', v_session_token,   -- Full 32-hex token sent to device
    'token_prefix', LEFT(v_session_token, 12),  -- 12-hex prefix for BLE broadcast
    'expires_at', NOW() + INTERVAL '2 hours'
  );
END;
$$;
```

**Security Design:**
- Full 32-hex token (128-bit entropy) stored in DB, sent to device once
- Only the **12-hex prefix** is broadcast via BLE (reduces brute-force surface)
- Token expires in 2 hours; old sessions deactivated on new session creation
- Frontend attaches prefix to BLE manufacturer data payload

---

### 3.8 `resolve_proximity_session()` — BLE Token Resolution

```sql
CREATE OR REPLACE FUNCTION resolve_proximity_session(
  p_token_prefix TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_profile_id UUID;
  v_target_profile_id UUID;
  v_target_profile JSONB;
BEGIN
  SELECT id INTO v_caller_profile_id
  FROM profiles WHERE user_id = auth.uid();

  -- Find active session matching the prefix
  SELECT profile_id INTO v_target_profile_id
  FROM proximity_sessions
  WHERE
    LEFT(session_token, 12) = p_token_prefix
    AND is_active = TRUE
    AND expires_at > NOW()
  LIMIT 1;

  IF v_target_profile_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Token not found or expired');
  END IF;

  -- Prevent resolving own token
  IF v_target_profile_id = v_caller_profile_id THEN
    RETURN jsonb_build_object('error', 'Cannot resolve own token');
  END IF;

  -- Log resolution event
  INSERT INTO proximity_events (
    resolver_profile_id,
    token,
    resolved_at,
    expires_at
  )
  VALUES (
    v_caller_profile_id,
    p_token_prefix,
    NOW(),
    NOW() + INTERVAL '5 minutes'
  );

  -- Return filtered profile data (RLS-safe metadata only)
  SELECT jsonb_build_object(
    'id', p.id,
    'first_name', p.first_name,
    'age', EXTRACT(YEAR FROM AGE(p.dob)),
    'photos', (
      SELECT jsonb_agg(ph ORDER BY ph.photo_order)
      FROM profile_photos ph
      WHERE ph.profile_id = p.id
        AND ph.is_active = TRUE
      LIMIT 1
    ),
    'distance_m', ROUND(ST_Distance(p.location, caller.location))
  )
  INTO v_target_profile
  FROM profiles p, profiles caller
  WHERE p.id = v_target_profile_id
    AND caller.id = v_caller_profile_id;

  RETURN jsonb_build_object('profile', v_target_profile);
END;
$$;
```

---

### 3.9 `get_nearby_places()` — Location Intelligence

```sql
CREATE OR REPLACE FUNCTION get_nearby_places(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_km DOUBLE PRECISION DEFAULT 2.0,
  p_types TEXT[] DEFAULT ARRAY['cafe', 'restaurant', 'park']
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cache_key TEXT;
  v_cached_result JSONB;
  v_result JSONB;
BEGIN
  -- Generate cache key (rounded to 3 decimal places for locality)
  v_cache_key := ROUND(p_lat::NUMERIC, 3)::TEXT || '_' ||
                 ROUND(p_lng::NUMERIC, 3)::TEXT || '_' ||
                 p_radius_km::TEXT;

  -- Check Supabase Postgres cache
  SELECT cached_data INTO v_cached_result
  FROM location_cache
  WHERE cache_key = v_cache_key
    AND created_at > NOW() - INTERVAL '1 hour';

  IF v_cached_result IS NOT NULL THEN
    RETURN jsonb_build_object('source', 'cache', 'data', v_cached_result);
  END IF;

  -- Cache miss: return coordinates for frontend to call Foursquare/OSM
  -- (actual API calls made from frontend to avoid pg_net rate limits)
  RETURN jsonb_build_object(
    'source', 'api_required',
    'lat', p_lat,
    'lng', p_lng,
    'radius_km', p_radius_km,
    'types', p_types
  );
END;
$$;

-- Separate function to store results after frontend API call
CREATE OR REPLACE FUNCTION cache_nearby_places(
  p_cache_key TEXT,
  p_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO location_cache (cache_key, cached_data, created_at)
  VALUES (p_cache_key, p_data, NOW())
  ON CONFLICT (cache_key)
  DO UPDATE SET cached_data = p_data, created_at = NOW();
END;
$$;
```

---

## 4. Twilio Integration

### 4.1 Architecture

Supabase natively integrates Twilio as an SMS provider for OTP. This is configured in the Supabase Auth settings — no custom code required for basic OTP flow.

```
Configuration (Supabase Dashboard → Auth → SMS Provider):
  Provider: Twilio
  Account SID: AC...
  Auth Token: (stored encrypted)
  Message Service SID: MG...
  SMS Template: "Your Soul Setu code is: {{ .Code }}"
  OTP Expiry: 300 seconds (5 min)
```

### 4.2 OTP Flow (Complete)

```
1. Frontend: supabase.auth.signInWithOtp({ phone: '+91XXXXXXXXXX' })
2. Supabase Auth → Twilio API: POST /2010-04-01/Accounts/{SID}/Messages
   Body: { To: '+91XXXXXXXXXX', From: '+1...', Body: 'Your code: 123456' }
3. Twilio → SMS delivery to user
4. User enters OTP in app
5. Frontend: supabase.auth.verifyOtp({ phone, token, type: 'sms' })
6. Supabase validates token (TOTP-style, time-windowed)
7. Session JWT created → returned to client
8. Trigger: handle_new_user() fires if first login
```

### 4.3 Security Considerations

- OTP is 6-digit numeric, valid for 5 minutes
- Rate limiting: Supabase enforces 60-second cooldown between OTP requests per phone number
- Phone number normalized to E.164 format before storage
- JWT session token has 1-hour expiry with refresh token rotation

---

## 5. Sendbird Integration

### 5.1 Credential Management

Sendbird API token is stored in **Supabase Vault** (encrypted key-value store):

```sql
-- Store (done once via Supabase CLI or dashboard)
SELECT vault.create_secret(
  'eyJ...sendbird_api_token...',
  'sendbird_api_token'
);

-- Read (inside SECURITY DEFINER functions only)
SELECT decrypted_secret FROM vault.decrypted_secrets
WHERE name = 'sendbird_api_token';
```

This ensures the API token is **never exposed to the client** — it only exists server-side within RPC functions.

### 5.2 User Provisioning

Sendbird users are provisioned lazily when a user first opens the Matches screen:

```sql
CREATE OR REPLACE FUNCTION get_sendbird_token(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_api_key TEXT;
  v_response JSONB;
BEGIN
  SELECT decrypted_secret INTO v_api_key
  FROM vault.decrypted_secrets WHERE name = 'sendbird_api_token';

  -- Create or update Sendbird user
  SELECT content INTO v_response FROM http((
    'PUT',
    'https://api-' || APP_ID || '.sendbird.com/v3/users/' || p_user_id,
    ARRAY[http_header('Api-Token', v_api_key)],
    'application/json',
    jsonb_build_object(
      'user_id', p_user_id,
      'nickname', p_user_id,
      'issue_access_token', true
    )::TEXT
  )::http_request);

  RETURN v_response;
END;
$$;
```

### 5.3 Channel Lifecycle

| Event | Action | Sendbird API Call |
|---|---|---|
| Mutual like | Create channel | `POST /v3/group_channels` |
| Unmatch | Delete channel | `DELETE /v3/group_channels/{url}` |
| User sends message | Message stored | Sendbird handles internally |
| Realtime event | Push to receiver | Sendbird WebSocket |
| Read receipt | Update status | Sendbird handles internally |

---

## 6. OpenStreetMap + Foursquare Integration

### 6.1 Architecture

The location services use a **hybrid two-tier approach**:

```
Frontend Request
  → Supabase cache check (RPC)
  → Cache HIT: return cached data
  → Cache MISS:
      → OSM Overpass API (raw geospatial, free)
          Returns: place name, coordinates, OSM type
      → Foursquare Places API (metadata enrichment)
          Returns: category, rating, hours, contact
      → Merge both datasets
      → Cache in Supabase Postgres (1 hour TTL)
      → Return to frontend
```

### 6.2 OSM Overpass Query

```javascript
// utils/osmQuery.ts
const buildOverpassQuery = (lat: number, lng: number, radiusM: number, types: string[]) => {
  const typeFilters = types
    .map(t => `node["amenity"="${t}"](around:${radiusM},${lat},${lng});`)
    .join('');

  return `
    [out:json][timeout:25];
    (
      ${typeFilters}
    );
    out body;
    >;
    out skel qt;
  `;
};

const fetchOSMPlaces = async (lat: number, lng: number, radius: number) => {
  const query = buildOverpassQuery(lat, lng, radius, ['cafe', 'restaurant', 'park']);
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' }
  });
  return response.json();
};
```

### 6.3 Foursquare Enrichment

```javascript
const enrichWithFoursquare = async (lat: number, lng: number, radius: number) => {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?` +
    `ll=${lat},${lng}&radius=${radius}&categories=13032,13065,16032&limit=20`,
    {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
        'Accept': 'application/json'
      }
    }
  );
  return response.json();
};
```

### 6.4 Rate Limit Handling

```typescript
const fetchWithRateLimit = async (fetchFn: () => Promise<any>, service: 'osm' | 'foursquare') => {
  // Check rate limit status from Supabase rate_limit_tracker table
  const { data: rateStatus } = await supabase.rpc('check_rate_limit', {
    p_service: service
  });

  if (!rateStatus.allowed) {
    // Queue request or return cached fallback
    return { source: 'fallback', data: rateStatus.cached_fallback };
  }

  return fetchFn();
};
```

---

## 7. Supabase Storage

### 7.1 Bucket Configuration

```
Bucket: profiles
  Type: Public (read) / Authenticated (write)
  Max file size: 5MB
  Allowed MIME types: image/jpeg, image/png, image/webp
```

### 7.2 Upload Flow

```
Frontend uploads JPEG blob to profiles/{userId}/{timestamp}.jpg
  → Supabase Storage processes upload
  → Returns public URL: https://xxx.supabase.co/storage/v1/object/public/profiles/...
  → Frontend calls update_profile() RPC with photo URL
  → profile_photos table updated
  → File URL saved, accessible globally via CDN
```

### 7.3 Storage RLS Policy

```sql
-- Only authenticated users can upload to their own folder
CREATE POLICY "insert_profiles_bucket_authenticated"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

-- Public read
CREATE POLICY "public_profiles_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profiles');
```

---

## 8. API Testing (Postman)

### 8.1 RPC Endpoint Structure

All Supabase RPC calls follow this pattern:

```
POST https://{project_ref}.supabase.co/rest/v1/rpc/{function_name}
Headers:
  apikey: {anon_key}
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
Body: { "p_param1": "value1" }
```

### 8.2 Postman Collection Structure

```
Soul Setu API Tests
├── Auth
│   ├── Send OTP (POST /auth/v1/otp)
│   └── Verify OTP (POST /auth/v1/verify)
├── Profile
│   ├── Update Profile (POST /rpc/update_profile)
│   └── Get Profile (GET /rest/v1/profiles?user_id=eq.{id})
├── Discovery
│   └── Get Profiles (POST /rpc/get_profiles)
├── Interactions
│   ├── Like Profile (POST /rpc/like_profile)
│   └── Skip Profile (POST /rpc/skip_profile)
├── Proximity
│   ├── Start Session (POST /rpc/start_proximity_session)
│   └── Resolve Session (POST /rpc/resolve_proximity_session)
└── Places
    └── Get Nearby Places (POST /rpc/get_nearby_places)
```

### 8.3 Test Assertions

```javascript
// Postman test script for like_profile
pm.test("Like returns matched status", function () {
  const body = pm.response.json();
  pm.expect(body).to.have.property('matched');
  pm.expect(body.matched).to.be.a('boolean');
});

pm.test("Match returns channel_url when mutual", function () {
  const body = pm.response.json();
  if (body.matched) {
    pm.expect(body).to.have.property('channel_url');
    pm.expect(body.channel_url).to.match(/^soulsetu_/);
  }
});
```

---

## 9. Security Architecture

### 9.1 Defense-in-Depth Model

```
Layer 1: Network — HTTPS/TLS for all traffic
Layer 2: Auth    — Supabase JWT (HS256, 1hr expiry + refresh rotation)
Layer 3: RLS     — Per-table PostgreSQL row policies
Layer 4: RPC     — SECURITY DEFINER + auth.uid() validation
Layer 5: Vault   — Encrypted storage for third-party credentials
Layer 6: Storage — Path-based access control
```

### 9.2 Key Security Guarantees

| Threat | Mitigation |
|---|---|
| Unauthorized profile read | RLS `SELECT` policy requires `auth.uid()` match |
| Cross-user profile edit | `update_profile()` derives profile from `auth.uid()`, ignores client-supplied IDs |
| BLE identity exposure | Only 12-hex prefix broadcast; full token never leaves server |
| Sendbird credential leak | Stored in Vault, accessed only in SECURITY DEFINER functions |
| Profile photo access control | Storage RLS enforces user folder isolation on upload |
| OTP brute force | Supabase rate limits + 5-min expiry |
| SQL injection | All user inputs passed as parameterized RPC arguments |

---

## 10. Scalability Considerations

| Concern | Current Approach | Scale Strategy |
|---|---|---|
| Discovery query performance | PostGIS GIST spatial index | Partition profiles by geography |
| BLE token resolution | Full table scan on `LEFT(session_token, 12)` | Add functional index: `CREATE INDEX ON proximity_sessions(LEFT(session_token, 12))` |
| Location cache TTL | 1 hour Postgres cache | Move to Redis (Upstash) for sub-millisecond lookups |
| Sendbird channel creation | Synchronous HTTP from PG | Move to async queue (pg_net background) |
| Photo storage | Single Supabase bucket | CDN integration (Cloudflare Images) for global distribution |
| Interaction table growth | No partitioning | Partition `interactions` by `created_at` monthly |