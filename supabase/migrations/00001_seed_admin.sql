-- Waitlist Admin Seeding Script
BEGIN;

DO $$ 
DECLARE 
  new_admin_id uuid := gen_random_uuid();
BEGIN
  -- 1. Create an auto-verified admin directly in Supabase Auth
  INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
      created_at, updated_at, confirmation_token, email_change, 
      email_change_token_new, recovery_token
  ) VALUES (
      '00000000-0000-0000-0000-000000000000', new_admin_id, 'authenticated', 'authenticated', 
      'admin@heuristixai.com', extensions.crypt('HeuristixTest2026!', extensions.gen_salt('bf')), 
      now(), '{"provider":"email","providers":["email"]}', '{}', 
      now(), now(), '', '', '', ''
  );

  -- 2. Link the identity records (Supabase requirement)
  INSERT INTO auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
      new_admin_id, new_admin_id, new_admin_id, 
      json_build_object('sub', new_admin_id, 'email', 'admin@heuristixai.com')::jsonb, 
      'email', now(), now(), now()
  );

  -- 3. Put their ID natively into your admins table so they can actually edit the waitlist!
  INSERT INTO public.admins (user_id) VALUES (new_admin_id);

END $$;

COMMIT;
