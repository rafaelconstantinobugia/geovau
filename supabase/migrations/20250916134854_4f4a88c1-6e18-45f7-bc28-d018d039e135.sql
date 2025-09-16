-- Security Fix: Improve RLS policies for hits table to prevent data harvesting
-- The hits table contains sensitive tracking data that must be protected

-- Drop existing unclear policies
DROP POLICY IF EXISTS "Authenticated users can view aggregated hits only" ON public.hits;
DROP POLICY IF EXISTS "No anonymous access to hits" ON public.hits; 
DROP POLICY IF EXISTS "Service role can manage hits" ON public.hits;

-- Create explicit, secure policies

-- 1. Completely deny all access to regular users (authenticated or not)
-- This prevents any potential data harvesting of sensitive tracking information
CREATE POLICY "deny_all_user_access_to_sensitive_tracking_data" 
ON public.hits 
FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);

-- 2. Deny access to authenticated users specifically (belt and suspenders approach)
CREATE POLICY "deny_authenticated_access_to_tracking_data" 
ON public.hits 
FOR ALL 
TO authenticated 
USING (false) 
WITH CHECK (false);

-- 3. Deny access to anonymous users specifically  
CREATE POLICY "deny_anonymous_access_to_tracking_data" 
ON public.hits 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 4. Allow service role access ONLY (needed for edge functions to log hits)
-- This is the only legitimate access pattern for this sensitive data
CREATE POLICY "allow_service_role_for_logging_only" 
ON public.hits 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Add comment explaining the security model
COMMENT ON TABLE public.hits IS 
'SECURITY CRITICAL: Contains sensitive tracking data (IP addresses, GPS coordinates, user agents, timezones). 
Access is restricted to service_role ONLY for logging purposes. 
Regular users must NEVER have access to this data to prevent profiling and tracking.';

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE public.hits ENABLE ROW LEVEL SECURITY;