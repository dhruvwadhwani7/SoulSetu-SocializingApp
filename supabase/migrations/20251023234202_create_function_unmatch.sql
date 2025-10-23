
create or replace function unmatch(
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
  actor uuid;
  target uuid;
  match_status int := 4;
  unmatch_status int := 5;
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

if status != match_status then
  raise exception 'interaction % is not a match', interaction;
end if;

if v_profile_id not in (actor, target) then
  raise exception 'unauthorized access to interaction % by user %', interaction, auth.uid();
end if;

perform chat.delete_channel(interaction_id);

update interactions
set status_id = unmatch_status, updated_at = now(), updated_by = v_profile_id
where id = interaction;
end;
$$;

