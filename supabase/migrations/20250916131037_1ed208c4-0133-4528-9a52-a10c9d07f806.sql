-- Fix the SECURITY DEFINER view issue using the ALTER VIEW approach
-- Based on GitHub discussion #28464, this is the correct way

-- Alter the existing view to use security_invoker instead of security_definer
ALTER VIEW public.pois_public SET (security_invoker = true);

-- Verify the view exists and grant permissions
GRANT SELECT ON public.pois_public TO anon, authenticated;

-- Add documentation comment
COMMENT ON VIEW public.pois_public IS 'Public read-only view of published POIs. Uses security_invoker to respect RLS policies.';