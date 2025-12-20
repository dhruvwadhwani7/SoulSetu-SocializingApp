-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.children (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT children_pkey PRIMARY KEY (id)
);
CREATE TABLE public.covid_vaccine (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT covid_vaccine_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ethnicities (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT ethnicities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.family_plans (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT family_plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.genders (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  plural_name text,
  CONSTRAINT genders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.interaction_status (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  status text NOT NULL,
  CONSTRAINT interaction_status_pkey PRIMARY KEY (id)
);
CREATE TABLE public.interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  actor_id uuid NOT NULL,
  target_id uuid NOT NULL,
  status_id integer NOT NULL,
  answer_id uuid,
  photo_id uuid,
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.profiles(id),
  CONSTRAINT interactions_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES public.profile_answers(id),
  CONSTRAINT interactions_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES public.profile_photos(id),
  CONSTRAINT interactions_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.interaction_status(id),
  CONSTRAINT interactions_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.profiles(id),
  CONSTRAINT interactions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.pets (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT pets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profile_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL,
  prompt_id integer NOT NULL,
  answer_text text NOT NULL,
  answer_order integer NOT NULL,
  is_active boolean NOT NULL,
  CONSTRAINT profile_answers_pkey PRIMARY KEY (id),
  CONSTRAINT profile_answers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT profile_answers_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.prompts(id)
);
CREATE TABLE public.profile_ethnicities (
  profile_id uuid NOT NULL,
  ethnicity_id integer NOT NULL,
  CONSTRAINT profile_ethnicities_pkey PRIMARY KEY (profile_id, ethnicity_id),
  CONSTRAINT profile_ethnicities_ethnicity_id_fkey FOREIGN KEY (ethnicity_id) REFERENCES public.ethnicities(id),
  CONSTRAINT profile_ethnicities_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_ethnicity_preferences (
  profile_id uuid NOT NULL,
  ethnicity_id integer NOT NULL,
  CONSTRAINT profile_ethnicity_preferences_pkey PRIMARY KEY (profile_id, ethnicity_id),
  CONSTRAINT profile_ethnicity_preferences_ethnicity_id_fkey FOREIGN KEY (ethnicity_id) REFERENCES public.ethnicities(id),
  CONSTRAINT profile_ethnicity_preferences_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_gender_preferences (
  profile_id uuid NOT NULL,
  gender_id integer NOT NULL,
  CONSTRAINT profile_gender_preferences_pkey PRIMARY KEY (profile_id, gender_id),
  CONSTRAINT profile_gender_preferences_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(id),
  CONSTRAINT profile_gender_preferences_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_pets (
  profile_id uuid NOT NULL,
  pet_id integer NOT NULL,
  CONSTRAINT profile_pets_pkey PRIMARY KEY (profile_id, pet_id),
  CONSTRAINT profile_pets_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id),
  CONSTRAINT profile_pets_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL,
  photo_url text NOT NULL,
  photo_order integer NOT NULL,
  is_active boolean NOT NULL,
  CONSTRAINT profile_photos_pkey PRIMARY KEY (id),
  CONSTRAINT profile_photos_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_pronouns (
  profile_id uuid NOT NULL,
  pronoun_id integer NOT NULL,
  CONSTRAINT profile_pronouns_pkey PRIMARY KEY (profile_id, pronoun_id),
  CONSTRAINT profile_pronouns_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT profile_pronouns_pronoun_id_fkey FOREIGN KEY (pronoun_id) REFERENCES public.pronouns(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  dob date,
  height_cm integer,
  neighborhood text,
  latitude double precision,
  longitude double precision,
  children_id integer,
  family_plan_id integer,
  covid_vaccine_id integer,
  zodiac_sign_id integer,
  gender_id integer,
  sexuality_id integer,
  max_distance_km integer DEFAULT 160,
  min_age integer DEFAULT 18,
  max_age integer DEFAULT 100,
  phone text UNIQUE,
  email_id text UNIQUE,
  user_id uuid,
  location USER-DEFINED DEFAULT st_point(longitude, latitude),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_children_id_fkey FOREIGN KEY (children_id) REFERENCES public.children(id),
  CONSTRAINT profiles_covid_vaccine_id_fkey FOREIGN KEY (covid_vaccine_id) REFERENCES public.covid_vaccine(id),
  CONSTRAINT profiles_family_plan_id_fkey FOREIGN KEY (family_plan_id) REFERENCES public.family_plans(id),
  CONSTRAINT profiles_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(id),
  CONSTRAINT profiles_sexuality_id_fkey FOREIGN KEY (sexuality_id) REFERENCES public.sexualities(id),
  CONSTRAINT profiles_zodiac_sign_id_fkey FOREIGN KEY (zodiac_sign_id) REFERENCES public.zodiac_signs(id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.prompts (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  question text NOT NULL,
  CONSTRAINT prompts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pronouns (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT pronouns_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sexualities (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT sexualities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.spatial_ref_sys (
  srid integer NOT NULL CHECK (srid > 0 AND srid <= 998999),
  auth_name character varying,
  auth_srid integer,
  srtext character varying,
  proj4text character varying,
  CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid)
);
CREATE TABLE public.zodiac_signs (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT zodiac_signs_pkey PRIMARY KEY (id)
);