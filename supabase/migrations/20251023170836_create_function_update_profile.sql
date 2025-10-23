
create or replace function update_profile(
  first_name text default null,
  last_name text default null,
  dob date default null,
  height_cm integer default null,
  neighborhood text default null,
  latitude float8 default null,
  longitude float8 default null,
  children integer default null,
  family_plan integer default null,
  covid_vaccine integer default null,
  zodiac_sign integer default null,
  sexuality integer default null,
  gender integer default null,
  ethnicities integer[] default null,
  pets integer[] default null,
  pronouns integer[] default null,
  gender_preferences integer[] default null,
  answers jsonb default null,
  photos jsonb default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  declare answer jsonb;
  declare existing_answer record;
  declare new_answer_id uuid;
  declare active_answer_ids uuid[] := '{}';
  declare photo jsonb;
  declare existing_photo record;
  declare new_photo_id uuid;
  declare active_photo_ids uuid[] := '{}';
begin

select profiles.id into v_profile_id
from profiles where user_id = auth.uid();

if v_profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

update profiles
set
first_name = coalesce(update_profile.first_name, profiles.first_name),
last_name = update_profile.last_name,
dob = coalesce(update_profile.dob, profiles.dob),
height_cm = coalesce(update_profile.height_cm, profiles.height_cm),
neighborhood = coalesce(update_profile.neighborhood, profiles.neighborhood),
latitude = coalesce(update_profile.latitude, profiles.latitude),
longitude = coalesce(update_profile.longitude, profiles.longitude),
children_id = coalesce(update_profile.children, profiles.children_id),
family_plan_id = coalesce(update_profile.family_plan, profiles.family_plan_id),
covid_vaccine_id = coalesce(update_profile.covid_vaccine, profiles.covid_vaccine_id),
zodiac_sign_id = coalesce(update_profile.zodiac_sign, profiles.zodiac_sign_id),
sexuality_id = coalesce(update_profile.sexuality, profiles.sexuality_id),
gender_id = coalesce(update_profile.gender, profiles.gender_id),
updated_at = now()
where id = v_profile_id;

if ethnicities is not null then
  delete from profile_ethnicities
  where profile_ethnicities.profile_id = v_profile_id;

  insert into profile_ethnicities (profile_id, ethnicity_id)
  select v_profile_id, unnest(ethnicities);
end if;

if pets is not null then
  delete from profile_pets
  where profile_pets.profile_id = v_profile_id;

  insert into profile_pets (profile_id, pet_id)
  select v_profile_id, unnest(pets);
end if;

if pronouns is not null then
  delete from profile_pronouns
  where profile_pronouns.profile_id = v_profile_id;

  insert into profile_pronouns (profile_id, pronoun_id)
  select v_profile_id, unnest(pronouns);
end if;

if gender_preferences is not null then
  delete from profile_gender_preferences
  where profile_id = v_profile_id;

  insert into profile_gender_preferences (profile_id, gender_id)
  select v_profile_id, unnest(gender_preferences);
end if;


if answers is not null then
  for answer in (select * from jsonb_array_elements(update_profile.answers))
  loop
    if answer->>'id' is not null then
      select id, answer_text, prompt_id, is_active into existing_answer
      from profile_answers
      where id = (answer->>'id')::uuid and profile_answers.profile_id = v_profile_id;

      if found then
        if existing_answer.answer_text is distinct from (answer->>'answer_text') or existing_answer.prompt_id is distinct from (answer->>'prompt_id')::integer then
          update profile_answers
          set is_active = false
          where id = existing_answer.id;

          new_answer_id := gen_random_uuid();
          insert into profile_answers (id, profile_id, answer_text, prompt_id, answer_order, is_active)
          values (
            new_answer_id,
            v_profile_id,
            (answer->>'answer_text'),
            (answer->>'prompt_id')::integer,
            (answer->>'answer_order')::integer,
            true
          );
          active_answer_ids := array_append(active_answer_ids, new_answer_id);
        else
          update profile_answers
          set
            is_active = true,
            answer_order = (answer->>'answer_order')::integer
          where id = existing_answer.id;
          active_answer_ids := array_append(active_answer_ids, existing_answer.id);
        end if;
      end if;
    else
      new_answer_id := gen_random_uuid();
      insert into profile_answers (id, profile_id, answer_text, prompt_id, answer_order, is_active)
      values (
        new_answer_id,
        v_profile_id,
        (answer->>'answer_text'),
        (answer->>'prompt_id')::integer,
        (answer->>'answer_order')::integer,
        true
      );
      active_answer_ids := array_append(active_answer_ids, new_answer_id);

    end if;
  end loop;
  if jsonb_array_length(update_profile.answers) = 0 then
    update profile_answers
    set is_active = false
    where profile_answers.profile_id = v_profile_id and is_active = true;
  else
    update profile_answers
    set is_active = false
    where profile_answers.profile_id = v_profile_id
    and is_active = true
    and id <> all (active_answer_ids);
  end if;
end if;

if photos is not null then
  for photo in (select * from jsonb_array_elements(update_profile.photos))
  loop
    if photo->>'id' is not null then
      select id, photo_url, is_active into existing_photo
      from profile_photos
      where id = (photo->>'id')::uuid and profile_photos.profile_id = v_profile_id;

      if found then
        if existing_photo.photo_url is distinct from (photo->>'photo_url') then
          update profile_photos
          set is_active = false
          where id = existing_photo.id;

          new_photo_id := gen_random_uuid();
          insert into profile_photos (id, profile_id, photo_url, photo_order, is_active)
          values (
            new_photo_id,
            v_profile_id,
            (photo->>'photo_url'),
            (photo->>'photo_order')::integer,
            true
          );
          active_photo_ids := array_append(active_photo_ids, new_photo_id);
        else
          update profile_photos
          set
            is_active = true,
            photo_order = (photo->>'photo_order')::integer
          where id = existing_photo.id;
          active_photo_ids := array_append(active_photo_ids, existing_photo.id);
        end if;
      end if;
    else
      new_photo_id := gen_random_uuid();
      insert into profile_photos (id, profile_id, photo_url, photo_order, is_active)
      values (
        new_photo_id,
        v_profile_id,
        (photo->>'photo_url'),
        (photo->>'photo_order')::integer,
        true
      );
      active_photo_ids := array_append(active_photo_ids, new_photo_id);

    end if;
  end loop;
  if jsonb_array_length(update_profile.photos) = 0 then
    update profile_photos
    set is_active = false
    where profile_photos.profile_id = v_profile_id and is_active = true;
  else
    update profile_photos
    set is_active = false
    where profile_photos.profile_id = v_profile_id
    and is_active = true
    and id <> all (active_photo_ids);
  end if;
end if;
end;
$$;

