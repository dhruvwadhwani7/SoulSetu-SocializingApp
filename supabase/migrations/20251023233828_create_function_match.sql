
create or replace function match(
  interaction uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  actor uuid;
  target uuid;
  interaction_id uuid;
  status int;
  like_status int := 2;
  remove_status int := 3;
  match_status int := 4;
begin

select profiles.id into v_profile_id
from profiles where profiles.user_id = auth.uid();

if v_profile_id is null then
  raise exception 'profile not found for user %', auth.uid() ;
end if;

select id, status_id, actor_id, target_id into interaction_id, status, actor, target
from interactions
where id = interaction;

if not found then
  raise exception 'interaction % not found', interaction;
end if;

if status not in (like_status, remove_status) then
  raise exception 'interaction % is not a like or remove', interaction;
end if;

if target != v_profile_id then
  raise exception 'unauthorized access to interaction % by user %', interaction, auth.uid();
end if;

perform chat.create_channel(interaction_id, actor, target);

update interactions
set status_id = match_status, updated_at = now(), updated_by = v_profile_id
where id = interaction;
end;
$$;
