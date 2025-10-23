
create or replace function chat.create_channel(
  channel uuid,
  user1 uuid,
  user2 uuid
)
returns void
language plpgsql
as $$
declare
  sendbird_app_id text;
  sendbird_api_token text;
  sendbird_api_url text;
  sendbird_status int;
  sendbird_content jsonb;
begin
  select decrypted_secret into sendbird_app_id
  from vault.decrypted_secrets
  where name = 'sendbird_app_id';

  select decrypted_secret into sendbird_api_token
  from vault.decrypted_secrets
  where name = 'sendbird_api_token';

  sendbird_api_url := 'https://api-' || sendbird_app_id || '.sendbird.com/v3/group_channels/';

  select status, content::jsonb into sendbird_status, sendbird_content
  from http((
    'POST',
    sendbird_api_url,
    array[http_header('Api-Token',sendbird_api_token)],
    'application/json',
    json_build_object(
      'user_ids', array[user1::text, user2::text],
      'channel_url', channel
    )::text
  )::http_request);

  if sendbird_status != 200 then
      if (sendbird_content->>'code')::int != 400202 then
        raise exception 'sendbird error: %', sendbird_content;
      end if;
    end if;
end;
$$;
