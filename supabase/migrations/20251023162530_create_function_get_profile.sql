
create or replace function get_profile()
returns table (
    id uuid,
    first_name text,
    last_name text,
    dob date,
    height_cm int,
    neighborhood text,
    latitude float8,
    longitude float8,
    max_distance_km int,
    min_age int,
    max_age int,
    phone text,
    children jsonb,
    family_plan jsonb,
    covid_vaccine jsonb,
    zodiac_sign jsonb,
    sexuality jsonb,
    gender jsonb,
    ethnicities jsonb,
    pets jsonb,
    pronouns jsonb,
    ethnicity_preferences jsonb,
    gender_preferences jsonb,
    answers jsonb,
    photos jsonb,
    avatar_url text
)
language plpgsql
security definer
as $$
declare profile_id uuid;
begin
  select profiles.id into profile_id
  from profiles where user_id = auth.uid();

  if profile_id is null then
    raise exception 'profile not found for user %', auth.uid();
  end if;

  return query
  select
    profiles.id,
    profiles.first_name,
    profiles.last_name,
    profiles.dob,
    profiles.height_cm,
    profiles.neighborhood,
    profiles.latitude,
    profiles.longitude,
    profiles.max_distance_km,
    profiles.min_age,
    profiles.max_age,
    profiles.phone,
    row_to_json(children.*)::jsonb as children,
    row_to_json(family_plans.*)::jsonb as family_plan,
    row_to_json(covid_vaccine.*)::jsonb as covid_vaccine,
    row_to_json(zodiac_signs.*)::jsonb as zodiac_sign,
    row_to_json(sexualities.*)::jsonb as sexuality,
    json_build_object('id', genders.id, 'name', genders.name)::jsonb as gender,
    (
      select coalesce(jsonb_agg(ethnicities.*), '[]'::jsonb)
      from profile_ethnicities
      left join ethnicities on ethnicities.id = profile_ethnicities.ethnicity_id
      where profile_ethnicities.profile_id = profiles.id
    ) as ethnicities,
    (
      select coalesce(jsonb_agg(pets.*), '[]'::jsonb)
      from profile_pets
      left join pets on pets.id = profile_pets.pet_id
      where profile_pets.profile_id = profiles.id
    ) as pets,
    (
      select coalesce(jsonb_agg(pronouns.*), '[]'::jsonb)
      from profile_pronouns
      left join pronouns on pronouns.id = profile_pronouns.pronoun_id
      where profile_pronouns.profile_id = profiles.id
    ) as pronouns,
    (
      select coalesce(jsonb_agg(ethnicities.*), '[]'::jsonb)
      from profile_ethnicity_preferences
      left join ethnicities on ethnicities.id = profile_ethnicity_preferences.ethnicity_id
      where profile_ethnicity_preferences.profile_id = profiles.id
    ) as ethnicity_preferences,
    (
      select coalesce(jsonb_agg(json_build_object('id', genders.id, 'name', genders.plural_name)), '[]'::jsonb)
      from profile_gender_preferences
      left join genders on genders.id = profile_gender_preferences.gender_id
      where profile_gender_preferences.profile_id = profiles.id
    ) as gender_preferences,
    (
      select coalesce(jsonb_agg(json_build_object(
        'id', profile_answers.id,
        'answer_text', profile_answers.answer_text,
        'answer_order', profile_answers.answer_order,
        'prompt_id', profile_answers.prompt_id,
        'question', prompts.question
      ) order by profile_answers.answer_order), '[]'::jsonb)
      from profile_answers
      left join prompts on prompts.id = profile_answers.prompt_id
      where profile_answers.profile_id = profiles.id and profile_answers.is_active = true
    ) as answers,
    (
      select coalesce(jsonb_agg(json_build_object(
        'id', profile_photos.id,
        'photo_url', profile_photos.photo_url,
        'photo_order', profile_photos.photo_order
      ) order by profile_photos.photo_order), '[]'::jsonb)
      from profile_photos
      where profile_photos.profile_id = profiles.id and profile_photos.is_active = true
    ) as photos,
    (
      select photo_url
      from profile_photos
      where profile_photos.profile_id = profiles.id and profile_photos.is_active = true
      order by profile_photos.photo_order
      limit 1
    ) as avatar_url
    from profiles
    left join children on children.id = profiles.children_id
    left join family_plans on family_plans.id = profiles.family_plan_id
    left join covid_vaccine on covid_vaccine.id = profiles.covid_vaccine_id
    left join zodiac_signs on zodiac_signs.id = profiles.zodiac_sign_id
    left join sexualities on sexualities.id = profiles.sexuality_id
    left join genders on genders.id = profiles.gender_id
    where profiles.id = profile_id;
end;
$$;
