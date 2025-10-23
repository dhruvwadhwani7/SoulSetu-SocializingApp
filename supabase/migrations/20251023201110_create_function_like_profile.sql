
create or replace function like_profile(
  profile uuid,
  photo uuid default null,
  answer uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  actor uuid;
  interaction_id uuid;
  skip_status int := 1;
  review_status int := 6;
  like_status int := 2;
begin

select profiles.id into actor
from profiles where profiles.user_id = auth.uid();

if actor is null then
  raise exception 'profile not found for user %', auth.uid() ;
end if;

select interactions.id into interaction_id
from interactions
where interactions.actor_id = actor
  and interactions.target_id = profile
  and interactions.status_id in (skip_status, review_status, like_status);

if found then
  update interactions
  set status_id = like_status,
      updated_at = now(),
      photo_id = photo,
      answer_id = answer
  where interactions.id = interaction_id;

  return interaction_id;
end if;

insert into interactions (actor_id, target_id, updated_by, status_id, photo_id, answer_id)
values (actor, profile, actor, like_status, photo, answer)
returning interactions.id into interaction_id;

return interaction_id;
end;
$$;
