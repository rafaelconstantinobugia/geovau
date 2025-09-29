-- Remove conflicting restrictive policies and add read access for analytics
DROP POLICY IF EXISTS "deny_anonymous_access_to_tracking_data" ON public.hits;
DROP POLICY IF EXISTS "deny_all_user_access_to_sensitive_tracking_data" ON public.hits;

-- Allow read access for analytics (anonymous users can read for reporting)
CREATE POLICY "allow_read_for_analytics" 
ON public.hits 
FOR SELECT 
USING (true);