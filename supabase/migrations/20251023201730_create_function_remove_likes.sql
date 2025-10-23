
create or replace function remove_like(
  interaction uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  interaction_id uuid;
  status int;
  target uuid;
  like_status int := 2;
  remove_status int := 3;
begin

select profiles.id into v_profile_id
from profiles where profiles.user_id = auth.uid();

if v_profile_id is null then
  raise exception 'profile not found for user %', auth.uid();
end if;

select id, status_id, target_id into interaction_id, status, target
from interactions
where id = interaction;

if not found then
  raise exception 'interaction % not found', interaction;
end if;

if status != like_status then
  raise exception 'interaction % is not a like', interaction;
end if;

if target != v_profile_id then
  raise exception 'unauthorized access to interaction % by user %', interaction, auth.uid();
end if;

update interactions
set status_id = remove_status, updated_at = now()
where id = interaction;
end;
$$;
