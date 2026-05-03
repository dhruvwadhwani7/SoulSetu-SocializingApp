# Soul Setu — Database Documentation

## 1. Overview

Soul Setu's database is a **PostgreSQL 15** instance hosted on Supabase, extended with **PostGIS** for geospatial operations. The schema is designed around a normalized relational model with strategic JSONB denormalization for performance-critical paths (photos, answers). Security is enforced at the row level via **Row Level Security (RLS)** policies, ensuring data isolation by authenticated user identity.

**Key Design Principles:**
- All lookup/reference tables are normalized (gender, ethnicity, sexuality, etc.)
- User-specific junction tables handle many-to-many relations (profile_ethnicities, etc.)
- PostGIS `GEOGRAPHY` type for location — enables accurate spherical distance calculations
- Proximity session data uses short TTL with `expires_at` column to auto-expire tokens
- Chat state is minimal (channel_id reference only) — full message history lives in Sendbird

---

## 2. Entity Relationship Overview

```
auth.users (Supabase managed)
    │ 1:1
    ▼
profiles ─────────────────────────────────────────────────────────────┐
    │ 1:many                                                           │
    ├── profile_photos          (photos linked to profile)            │
    ├── profile_answers         (prompt responses)                     │
    ├── profile_pronouns        (junction to pronouns)                 │
    ├── profile_ethnicities     (junction to ethnicities)              │
    ├── profile_gender_preferences (gender preferences for discovery)  │
    ├── profile_ethnicity_preferences (ethnicity prefs for discovery)  │
    ├── profile_pets            (junction to pets)                     │
    ├── proximity_sessions      (BLE session tokens)                   │
    │       │ 1:many                                                   │
    │       └── proximity_events (token resolution logs)               │
    │                                                                  │
    └── interactions (actor_id / target_id both FK to profiles) ───────┘
            │
            └── When mutual like → chat_channels
                    │ 1:many
                    └── chat_participants (FK to profiles)

Reference Tables (lookup, read-only):
    genders | ethnicities | sexualities | pronouns | pets
    children | family_plans | covid_vaccine | zodiac_signs
    prompts | interaction_status
```

---

## 3. Complete Table Definitions

### 3.1 `profiles` — Core User Table

```sql
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    gender_id       INTEGER REFERENCES genders(id),
    sexuality_id    INTEGER REFERENCES sexualities(id),
    children_id     INTEGER REFERENCES children(id),
    family_plan_id  INTEGER REFERENCES family_plans(id),
    covid_vaccine_id INTEGER REFERENCES covid_vaccine(id),
    zodiac_sign_id  INTEGER REFERENCES zodiac_signs(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_name      TEXT,
    last_name       TEXT,
    dob             DATE,
    height_cm       INTEGER CHECK (height_cm BETWEEN 100 AND 250),
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    location        GEOGRAPHY(POINT, 4326),  -- PostGIS spatial column
    min_age         INTEGER DEFAULT 18 CHECK (min_age >= 18),
    max_age         INTEGER DEFAULT 35 CHECK (max_age <= 80),
    max_distance_km INTEGER DEFAULT 50 CHECK (max_distance_km > 0),
    CONSTRAINT age_range_valid CHECK (min_age <= max_age)
);

-- Spatial index for proximity queries
CREATE INDEX profiles_location_gist
ON profiles USING GIST (location);

-- Standard index for user_id lookups
CREATE INDEX profiles_user_id_idx ON profiles (user_id);
CREATE INDEX profiles_gender_idx ON profiles (gender_id);
CREATE INDEX profiles_dob_idx ON profiles (dob);
```

**Column Notes:**
- `location` stores a PostGIS `GEOGRAPHY(POINT, 4326)` for WGS84 coordinates
- `latitude` / `longitude` stored separately for direct client access without PostGIS deserialization
- `min_age` / `max_age` define the user's **discovery preference** (not their own age)
- `max_distance_km` controls the `ST_DWithin` radius in `get_profiles()` RPC

---

### 3.2 `profile_photos`

```sql
CREATE TABLE public.profile_photos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    photo_url   TEXT NOT NULL,
    photo_order INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (profile_id, photo_order)
);

CREATE INDEX profile_photos_profile_id_idx ON profile_photos (profile_id);
CREATE INDEX profile_photos_active_idx ON profile_photos (profile_id, is_active)
WHERE is_active = TRUE;
```

**Notes:**
- `photo_order` determines display sequence (0 = primary photo)
- `is_active = FALSE` soft-deletes without losing history
- The partial index on `(profile_id, is_active) WHERE is_active = TRUE` dramatically speeds up photo retrieval in `get_profiles()` since most queries only need active photos

---

### 3.3 `profile_answers` (Prompts/Icebreakers)

```sql
CREATE TABLE public.profile_answers (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prompt_id    INTEGER NOT NULL REFERENCES prompts(id),
    answer_text  TEXT NOT NULL CHECK (length(answer_text) <= 500),
    answer_order INTEGER NOT NULL DEFAULT 0,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX profile_answers_profile_id_idx ON profile_answers (profile_id);
```

---

### 3.4 Junction Tables (Many-to-Many Relations)

```sql
-- Profile ↔ Ethnicity (user's own ethnicity)
CREATE TABLE public.profile_ethnicities (
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ethnicity_id INTEGER NOT NULL REFERENCES ethnicities(id),
    PRIMARY KEY (profile_id, ethnicity_id)
);

-- Profile ↔ Pronouns
CREATE TABLE public.profile_pronouns (
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pronoun_id  INTEGER NOT NULL REFERENCES pronouns(id),
    PRIMARY KEY (profile_id, pronoun_id)
);

-- Profile ↔ Pets
CREATE TABLE public.profile_pets (
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pet_id      INTEGER NOT NULL REFERENCES pets(id),
    PRIMARY KEY (profile_id, pet_id)
);

-- Discovery Preference: Profile → Gender(s) they want to see
CREATE TABLE public.profile_gender_preferences (
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    gender_id   INTEGER NOT NULL REFERENCES genders(id),
    PRIMARY KEY (profile_id, gender_id)
);

-- Discovery Preference: Profile → Ethnicity(ies) they want to see
CREATE TABLE public.profile_ethnicity_preferences (
    profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ethnicity_id  INTEGER NOT NULL REFERENCES ethnicities(id),
    PRIMARY KEY (profile_id, ethnicity_id)
);
```

---

### 3.5 `interactions` — Like / Skip / Match State

```sql
CREATE TABLE public.interactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status_id   INTEGER NOT NULL REFERENCES interaction_status(id),
    answer_id   UUID REFERENCES profile_answers(id),  -- Optional: liked a specific answer
    photo_id    UUID REFERENCES profile_photos(id),   -- Optional: liked a specific photo
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (actor_id, target_id)
);

CREATE INDEX interactions_actor_idx ON interactions (actor_id);
CREATE INDEX interactions_target_idx ON interactions (target_id);
CREATE INDEX interactions_status_idx ON interactions (status_id);

-- Composite index for mutual like detection
CREATE INDEX interactions_mutual_idx ON interactions (actor_id, target_id, status_id);
```

**Notes:**
- `UNIQUE (actor_id, target_id)` ensures one interaction record per pair direction
- `ON CONFLICT ... DO UPDATE` in the RPC allows changing from skip → like without duplicate rows
- The separate mutual-like detection query (`WHERE actor_id = B AND target_id = A`) uses the composite index

---

### 3.6 `interaction_status` — Reference Table

```sql
CREATE TABLE public.interaction_status (
    id      INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    status  TEXT NOT NULL UNIQUE
);

INSERT INTO interaction_status (status) VALUES
    ('like'),
    ('skip'),
    ('match'),
    ('unmatch'),
    ('block'),
    ('report');
```

---

### 3.7 `chat_channels` and `chat_participants`

```sql
CREATE TABLE public.chat_channels (
    channel_id  TEXT PRIMARY KEY,  -- Sendbird channel URL
    created_by  UUID NOT NULL REFERENCES profiles(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chat_participants (
    channel_id  TEXT NOT NULL REFERENCES chat_channels(channel_id) ON DELETE CASCADE,
    profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (channel_id, profile_id)
);

CREATE INDEX chat_participants_profile_idx ON chat_participants (profile_id);
```

**Design Rationale:**
- Chat channels store only the Sendbird `channel_url` as the foreign key — all message history, delivery status, and read receipts are managed by Sendbird
- `chat_participants` enables querying "which channels does user X participate in" without hitting Sendbird's API

---

### 3.8 `proximity_sessions` — BLE Token Store

```sql
CREATE TABLE public.proximity_sessions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_token  TEXT NOT NULL UNIQUE,  -- 32-hex chars (128-bit)
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at     TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '2 hours',
    is_active      BOOLEAN NOT NULL DEFAULT TRUE
);

-- Functional index on token prefix for O(log n) prefix lookups
CREATE INDEX proximity_sessions_prefix_idx
ON proximity_sessions (LEFT(session_token, 12))
WHERE is_active = TRUE AND expires_at > NOW();

CREATE INDEX proximity_sessions_profile_idx ON proximity_sessions (profile_id);
CREATE INDEX proximity_sessions_expiry_idx ON proximity_sessions (expires_at);
```

**Index Design Note:**
The functional index `LEFT(session_token, 12)` is critical — when a BLE scanner provides only the 12-hex prefix, PostgreSQL can use this index directly instead of full table scan, yielding O(log n) lookup time.

---

### 3.9 `proximity_events` — Token Resolution Audit Log

```sql
CREATE TABLE public.proximity_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolver_profile_id UUID NOT NULL REFERENCES profiles(id),
    token               TEXT NOT NULL,  -- 12-hex prefix that was resolved
    resolved_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL  -- TTL for this event record
);

CREATE INDEX proximity_events_resolver_idx ON proximity_events (resolver_profile_id);
CREATE INDEX proximity_events_token_idx ON proximity_events (token);
```

**Purpose:**
- Audit trail for who resolved which BLE token
- `expires_at` enables periodic cleanup via `pg_cron`
- Can detect if same resolver repeatedly scans same token (potential stalking prevention)

---

### 3.10 Reference / Lookup Tables

```sql
CREATE TABLE public.genders (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO genders (name) VALUES
    ('Man'), ('Woman'), ('Non-binary'), ('Transgender'),
    ('Genderfluid'), ('Other'), ('Prefer not to say');

CREATE TABLE public.ethnicities (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);

CREATE TABLE public.sexualities (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO sexualities (name) VALUES
    ('Straight'), ('Gay'), ('Lesbian'), ('Bisexual'),
    ('Pansexual'), ('Asexual'), ('Queer'), ('Prefer not to say');

CREATE TABLE public.pronouns (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO pronouns (name) VALUES
    ('He/Him'), ('She/Her'), ('They/Them'), ('Ze/Zir'), ('Other');

CREATE TABLE public.pets (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO pets (name) VALUES
    ('Dog'), ('Cat'), ('Fish'), ('Bird'), ('Reptile'), ('None');

CREATE TABLE public.children (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO children (name) VALUES
    ('Have children'), ('No children'), ("Don't want children"),
    ('Want someday'), ('Not sure');

CREATE TABLE public.family_plans (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);

CREATE TABLE public.covid_vaccine (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO covid_vaccine (name) VALUES
    ('Vaccinated'), ('Not vaccinated'), ('Prefer not to say');

CREATE TABLE public.zodiac_signs (
    id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name  TEXT NOT NULL UNIQUE
);
INSERT INTO zodiac_signs (name) VALUES
    ('Aries'), ('Taurus'), ('Gemini'), ('Cancer'), ('Leo'), ('Virgo'),
    ('Libra'), ('Scorpio'), ('Sagittarius'), ('Capricorn'), ('Aquarius'), ('Pisces');

CREATE TABLE public.prompts (
    id        INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    question  TEXT NOT NULL
);
INSERT INTO prompts (question) VALUES
    ('I speak out on'),
    ('What I order for the table'),
    ('I know the best spot in town for'),
    ('My love language is'),
    ('The way to my heart is');
```

---

### 3.11 `location_cache` — Place Data Cache

```sql
CREATE TABLE public.location_cache (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key   TEXT NOT NULL UNIQUE,  -- "lat_lng_radius"
    cached_data JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX location_cache_key_idx ON location_cache (cache_key);
CREATE INDEX location_cache_created_idx ON location_cache (created_at);
```

---

## 4. Migration Strategy

### 4.1 Migration File Structure

```
supabase/migrations/
├── 20240101000001_initial_schema.sql          # Core tables
├── 20240101000002_reference_tables.sql        # Lookup tables + seeds
├── 20240101000003_auth_trigger.sql            # handle_new_user trigger
├── 20240101000004_rls_policies.sql            # All RLS policies
├── 20240101000005_rpc_profile.sql             # update_profile, get_profiles
├── 20240101000006_rpc_interactions.sql        # like, skip, match, unmatch
├── 20240101000007_proximity_tables.sql        # BLE session/event tables
├── 20240101000008_rpc_proximity.sql           # start/resolve proximity
├── 20240101000009_location_cache.sql          # Cache table
├── 20240101000010_rpc_places.sql              # get_nearby_places
├── 20240101000011_storage_policies.sql        # Storage RLS
└── 20240101000012_vault_setup.sql             # Sendbird token vault
```

### 4.2 Running Migrations

```bash
# Apply all pending migrations
supabase db push

# Reset and reapply (development only)
supabase db reset

# Generate diff from local schema
supabase db diff --schema public
```

---

## 5. Row Level Security (RLS) Policies

### 5.1 `profiles` Table

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile (direct) + others via RPC
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only the owning user can update
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Insert blocked (handled via handle_new_user trigger)
CREATE POLICY "profiles_insert_trigger_only"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (FALSE);  -- No direct inserts; trigger handles creation
```

**Important:** The `get_profiles()` RPC runs with `SECURITY DEFINER`, which bypasses RLS for the function body. This is intentional — the function itself enforces business rules (filtering, exclusions) rather than relying on per-row policies, which would be too restrictive for discovery.

### 5.2 `profile_photos` Table

```sql
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select_authenticated"
ON profile_photos FOR SELECT
TO authenticated
USING (TRUE);  -- Any authenticated user can view photos (needed for discovery)

CREATE POLICY "photos_insert_own"
ON profile_photos FOR INSERT
TO authenticated
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "photos_update_own"
ON profile_photos FOR UPDATE
TO authenticated
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);
```

### 5.3 `interactions` Table

```sql
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Users see only their own sent/received interactions
CREATE POLICY "interactions_select_own"
ON interactions FOR SELECT
TO authenticated
USING (
  actor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR
  target_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Inserts only via RPC (like_profile/skip_profile)
CREATE POLICY "interactions_insert_rpc_only"
ON interactions FOR INSERT
TO authenticated
WITH CHECK (FALSE);
```

### 5.4 `proximity_sessions` Table

```sql
ALTER TABLE proximity_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own active sessions
CREATE POLICY "proximity_sessions_own"
ON proximity_sessions FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- All writes via RPC
CREATE POLICY "proximity_sessions_no_direct_write"
ON proximity_sessions FOR INSERT
TO authenticated
WITH CHECK (FALSE);
```

### 5.5 `proximity_events` Table

```sql
ALTER TABLE proximity_events ENABLE ROW LEVEL SECURITY;

-- INSERT only via resolve_proximity_session() RPC (SECURITY DEFINER bypasses)
CREATE POLICY "proximity_events_rpc_only"
ON proximity_events FOR INSERT
TO authenticated
WITH CHECK (FALSE);

-- Resolver can read their own events
CREATE POLICY "proximity_events_read_own"
ON proximity_events FOR SELECT
TO authenticated
USING (
  resolver_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
```

### 5.6 Reference Tables (Public Read)

```sql
-- All lookup tables are public read, no write for authenticated users
CREATE POLICY "select_genders_public" ON genders
FOR SELECT USING (TRUE);

CREATE POLICY "select_ethnicities_public" ON ethnicities
FOR SELECT USING (TRUE);

CREATE POLICY "select_sexualities_public" ON sexualities
FOR SELECT USING (TRUE);

-- ... (same pattern for pronouns, pets, children, family_plans, etc.)
```

### 5.7 Storage Policies

```sql
-- Profile image upload: only to own folder
CREATE POLICY "insert_profiles_bucket_authenticated"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

-- Profile image read: public
CREATE POLICY "select_profiles_bucket_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

-- Profile image delete: only own files
CREATE POLICY "delete_profiles_bucket_own"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);
```

---

## 6. Table Relational Connection Summary

| Parent Table | Child Table | Relationship Key | Purpose |
|---|---|---|---|
| `auth.users` | `profiles` | `profiles.user_id = auth.users.id` | Link auth identity to profile |
| `profiles` | `profile_photos` | `profile_id` | Profile images |
| `profiles` | `profile_answers` | `profile_id` | Prompt responses |
| `profiles` | `profile_pronouns` | `profile_id` | Pronoun associations |
| `profiles` | `profile_ethnicities` | `profile_id` | Ethnicity associations |
| `profiles` | `profile_gender_preferences` | `profile_id` | Discovery gender filter |
| `profiles` | `profile_ethnicity_preferences` | `profile_id` | Discovery ethnicity filter |
| `profiles` | `profile_pets` | `profile_id` | Pet associations |
| `profiles` | `interactions` | `actor_id`, `target_id` | Like/skip/match tracking |
| `profiles` | `proximity_sessions` | `profile_id` | BLE session tokens |
| `proximity_sessions` | `proximity_events` | `session_token` / `token` | Token resolution audit |
| `chat_channels` | `chat_participants` | `channel_id` | Chat membership |
| `profiles` | `chat_participants` | `profile_id` | Which chats user is in |
| `genders` | `profiles` | `gender_id` | User gender |
| `genders` | `profile_gender_preferences` | `gender_id` | Preferred genders |
| `ethnicities` | `profile_ethnicities` | `ethnicity_id` | User ethnicity |
| `prompts` | `profile_answers` | `prompt_id` | Prompt questions |
| `interaction_status` | `interactions` | `status_id` | Interaction type |

---

## 7. PostGIS Spatial Operations

### 7.1 Location Storage

```sql
-- Storing location when user sets it
UPDATE profiles
SET
  latitude = 23.0225,
  longitude = 72.5714,
  location = ST_SetSRID(ST_MakePoint(72.5714, 23.0225), 4326)::GEOGRAPHY
WHERE user_id = auth.uid();
```

**Note:** `ST_MakePoint(longitude, latitude)` — longitude first, then latitude (GeoJSON convention).

### 7.2 Distance Filtering

```sql
-- Find profiles within 50km of a given point
SELECT
  id,
  first_name,
  ST_Distance(location, reference_point) / 1000 AS distance_km
FROM profiles
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(72.5714, 23.0225), 4326)::GEOGRAPHY,
  50000  -- 50km in meters (GEOGRAPHY uses meters)
)
ORDER BY location <-> reference_point;  -- KNN operator for sorted results
```

### 7.3 Index Usage

```sql
-- Verify spatial index is being used (EXPLAIN ANALYZE)
EXPLAIN ANALYZE
SELECT id FROM profiles
WHERE ST_DWithin(location, ST_MakePoint(72.57, 23.02)::GEOGRAPHY, 10000);

-- Expected output: "Index Scan using profiles_location_gist on profiles"
```

---

## 8. Database Performance Indexes Summary

| Table | Index | Type | Purpose |
|---|---|---|---|
| `profiles` | `profiles_location_gist` | GIST | PostGIS proximity queries |
| `profiles` | `profiles_user_id_idx` | BTREE | Auth lookup |
| `profiles` | `profiles_dob_idx` | BTREE | Age range filtering |
| `profiles` | `profiles_gender_idx` | BTREE | Gender filtering |
| `profile_photos` | `photos_active_idx` | PARTIAL BTREE | Active photos only |
| `interactions` | `interactions_actor_idx` | BTREE | Actor's sent interactions |
| `interactions` | `interactions_mutual_idx` | BTREE | Mutual like detection |
| `proximity_sessions` | `sessions_prefix_idx` | FUNCTIONAL BTREE | BLE prefix lookup |
| `proximity_sessions` | `sessions_expiry_idx` | BTREE | TTL cleanup |
| `location_cache` | `cache_key_idx` | BTREE | Cache hit lookup |

---

## 9. Data Retention and Cleanup

### 9.1 Expired Proximity Sessions

```sql
-- pg_cron job: cleanup expired sessions every hour
SELECT cron.schedule(
  'cleanup-proximity-sessions',
  '0 * * * *',  -- Every hour
  $$
    UPDATE proximity_sessions
    SET is_active = FALSE
    WHERE expires_at < NOW() AND is_active = TRUE;

    DELETE FROM proximity_events
    WHERE expires_at < NOW();
  $$
);
```

### 9.2 Location Cache TTL

```sql
-- Cleanup stale location cache entries (older than 24h)
SELECT cron.schedule(
  'cleanup-location-cache',
  '0 2 * * *',  -- 2 AM daily
  $$
    DELETE FROM location_cache
    WHERE created_at < NOW() - INTERVAL '24 hours';
  $$
);
```

---

## 10. Supabase Vault — Secrets Management

```sql
-- Storing Sendbird API token
SELECT vault.create_secret(
  'sb_api_key_value_here',
  'sendbird_api_token',
  'Sendbird API token for channel management'
);

-- Reading (only inside SECURITY DEFINER functions)
SELECT decrypted_secret
FROM vault.decrypted_secrets
WHERE name = 'sendbird_api_token';
```

The `vault.decrypted_secrets` view provides AES-256 decryption at read time. Raw encrypted values in `vault.secrets` are never directly accessible to application roles.

---

## 11. Full Schema Dependency Graph

```
auth.users
    └──[1:1]── profiles
                  ├──[1:N]── profile_photos
                  ├──[1:N]── profile_answers ────────── prompts
                  ├──[M:N]── profile_pronouns ─────────  pronouns
                  ├──[M:N]── profile_ethnicities ──────  ethnicities
                  ├──[M:N]── profile_pets ─────────────  pets
                  ├──[M:N]── profile_gender_preferences  genders
                  ├──[M:N]── profile_ethnicity_prefs ──  ethnicities
                  ├──[1:N]── proximity_sessions
                  │               └──[1:N]── proximity_events
                  └──[M:N via interactions]── interactions
                                                  ├── interaction_status
                                                  └──[triggers]── chat_channels
                                                                       └──[1:N]── chat_participants
```