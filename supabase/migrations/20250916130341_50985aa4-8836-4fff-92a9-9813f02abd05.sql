-- Comprehensive security fixes
-- 1. Fix any remaining SECURITY DEFINER issues
-- 2. Add proper RLS policies for pois_public view access

-- Check if there are any materialized views or other objects
-- Drop and recreate anything that might be SECURITY DEFINER
DROP VIEW IF EXISTS public.pois_public CASCADE;

-- Recreate as a simple view (definitely not SECURITY DEFINER)
CREATE VIEW public.pois_public AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Since views don't have RLS directly, ensure the underlying table has proper policies
-- Add comment to document the view's purpose
COMMENT ON VIEW public.pois_public IS 'Public read-only view of published POIs for anonymous access';

-- Ensure pois_public view is accessible (views inherit from underlying table RLS)
-- Grant explicit usage to public/anon roles
GRANT SELECT ON public.pois_public TO anon, authenticated;

-- Additional security: Add a policy specifically for the view owner access
-- This shouldn't be needed but ensures compatibility
DO $$
BEGIN
  -- Ensure service role can access for Edge Functions if needed
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pois' 
    AND policyname = 'Service role can access all POIs'
  ) THEN
    CREATE POLICY "Service role can access all POIs" 
      ON public.pois 
      FOR SELECT 
      TO service_role
      USING (true);
  END IF;
END $$;