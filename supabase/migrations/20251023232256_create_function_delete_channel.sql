
create or replace function chat.delete_channel(
  channel uuid
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

  sendbird_api_url := 'https://api-' || sendbird_app_id || '.sendbird.com/v3/group_channels/' || channel;

  select status, content::jsonb into sendbird_status, sendbird_content
  from http((
    'DELETE',
    sendbird_api_url,
    array[http_header('Api-Token',sendbird_api_token)],
    'application/json',
    null
  )::http_request);

  if sendbird_status != 200 then
    raise exception 'sendbird error: %', sendbird_content;
  end if;
end;
$$;
