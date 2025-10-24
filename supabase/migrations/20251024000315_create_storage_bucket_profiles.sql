insert into storage.buckets (id, name, public) values ('profiles', 'profiles', true);

create policy "insert_profiles_bucket_authenticated"
on storage.objects for insert to authenticated with check (
    bucket_id = 'profiles'
);