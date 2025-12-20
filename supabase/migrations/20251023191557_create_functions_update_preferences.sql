
create or replace function update_gender_preferences(
  gender_preferences integer[]
)
returns void
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
begin

select id into v_profile_id
from profiles where user_id = auth.uid();

if v_profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

delete from profile_gender_preferences
where profile_id = v_profile_id;

insert into profile_gender_preferences (profile_id, gender_id)
select v_profile_id, unnest(gender_preferences);

end;
$$;

create or replace function update_location(
  latitude float8,
  longitude float8,
  neighborhood text
)
returns void
language plpgsql
security definer
as $$
declare
  profile_id uuid;
begin

select id into profile_id
from profiles where user_id = auth.uid();

if profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

update profiles
set
  latitude = update_location.latitude,
  longitude = update_location.longitude,
  neighborhood = update_location.neighborhood,
  updated_at = now()
where id = profile_id;

end;
$$;

create or replace function update_distance(
  distance integer
)
returns void
language plpgsql
security definer
as $$
declare
  profile_id uuid;
begin

select id into profile_id
from profiles where user_id = auth.uid();

if profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

update profiles
set
  max_distance_km = distance,
  updated_at = now()
where id = profile_id;

end;
$$;

create or replace function update_age_range(
  min_age integer,
  max_age integer
)
returns void
language plpgsql
security definer
as $$
declare
  profile_id uuid;
begin

select id into profile_id
from profiles where user_id = auth.uid();

if profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

update profiles
set
  min_age = update_age_range.min_age,
  max_age = update_age_range.max_age,
  updated_at = now()
where id = profile_id;

end;
$$;

create or replace function update_ethnicity_preferences(
  ethnicity_preferences integer[]
)
returns void
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
begin

select id into v_profile_id
from profiles where user_id = auth.uid();

if v_profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

delete from profile_ethnicity_preferences
where profile_id = v_profile_id;

insert into profile_ethnicity_preferences (profile_id, ethnicity_id)
select v_profile_id, unnest(ethnicity_preferences);
end;
$$;
