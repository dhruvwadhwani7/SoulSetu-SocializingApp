alter table "public"."profiles" add column "email_id" text;

alter table "public"."profiles" add column "user_id" uuid;

CREATE UNIQUE INDEX profiles_email_id_key ON public.profiles USING btree (email_id);

alter table "public"."profiles" add constraint "profiles_email_id_key" UNIQUE using index "profiles_email_id_key";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles(user_id, phone)
  values (new.id, new.phone)
  on conflict (phone)
  do update set user_id = new.id;
  return new;
end;
$function$
;


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


