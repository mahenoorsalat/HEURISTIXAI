-- Create waitlist table
CREATE TABLE public.waitlist (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    referral_code text NOT NULL,
    referred_by text,
    status text NOT NULL DEFAULT 'pending',
    manual_bonus integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT waitlist_pkey PRIMARY KEY (id),
    CONSTRAINT waitlist_email_key UNIQUE (email),
    CONSTRAINT waitlist_referral_code_key UNIQUE (referral_code),
    CONSTRAINT waitlist_status_check CHECK (status IN ('pending', 'approved', 'removed'))
);

-- Self-referencing foreign key for referrals
ALTER TABLE public.waitlist
    ADD CONSTRAINT waitlist_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.waitlist(referral_code) ON DELETE SET NULL;

-- Create announcements table
CREATE TABLE public.announcements (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    message text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT announcements_pkey PRIMARY KEY (id)
);

-- Admin users table
CREATE TABLE public.admins (
    user_id uuid NOT NULL,
    CONSTRAINT admins_pkey PRIMARY KEY (user_id)
);

-- View to compute position and referral count dynamically
CREATE OR REPLACE VIEW public.waitlist_with_position WITH (security_invoker=true) AS
SELECT 
    w.id,
    w.name,
    w.email,
    w.referral_code,
    w.referred_by,
    w.status,
    w.created_at,
    w.manual_bonus,
    (SELECT count(*) FROM public.waitlist r WHERE r.referred_by = w.referral_code AND r.status != 'removed') as referral_count,
    row_number() OVER (
        ORDER BY 
            ((SELECT count(*) FROM public.waitlist r WHERE r.referred_by = w.referral_code AND r.status != 'removed') + w.manual_bonus) DESC, 
            w.created_at ASC
    ) AS position
FROM public.waitlist w
WHERE w.status != 'removed';

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Waitlist Policies
-- Anyone can insert a new waitlist entry
CREATE POLICY "Public can insert waitlist" 
    ON public.waitlist FOR INSERT 
    WITH CHECK (status = 'pending');

-- Public users can only read their own data via email match (though typically we use the RPC for this)
CREATE POLICY "Public can read own waitlist entry" 
    ON public.waitlist FOR SELECT 
    -- If using auth, it would be auth.email(), but for anon forms, we rely on the RPC to bypass this.
    -- However, we can allow reading basic info if needed. We'll leave it restricted and use RPC.
    USING (false);

-- Admins can do everything on waitlist
CREATE POLICY "Admins full access waitlist" 
    ON public.waitlist FOR ALL 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Announcements Policies
-- Anyone can read active announcements
CREATE POLICY "Public can read active announcements" 
    ON public.announcements FOR SELECT 
    USING (active = true);

-- Admins can do everything on announcements
CREATE POLICY "Admins full access announcements" 
    ON public.announcements FOR ALL 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Admins Policies
-- Admins can read the admins table
CREATE POLICY "Admins read admins" 
    ON public.admins FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

-- RPC function for public to check their status securely (Bypasses RLS to read the view)
CREATE OR REPLACE FUNCTION get_waitlist_status(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'name', name,
    'position', position,
    'referral_count', referral_count,
    'referral_code', referral_code,
    'status', status,
    'manual_bonus', manual_bonus,
    'created_at', created_at
  ) INTO result
  FROM public.waitlist_with_position
  WHERE email = user_email
  LIMIT 1;
  
  RETURN result;
END;
$$;
