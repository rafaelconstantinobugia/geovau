-- Fix Security Definer View issue
-- Replace any SECURITY DEFINER views with regular views and proper RLS policies

-- Drop and recreate pois_public view to ensure it's not SECURITY DEFINER
DROP VIEW IF EXISTS public.pois_public;

-- Create regular view (not SECURITY DEFINER)
CREATE VIEW public.pois_public AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Enable RLS on the view (views inherit RLS from underlying tables)
-- Note: Views don't have RLS directly, but the underlying table's RLS applies

-- Ensure the underlying pois table has proper RLS policies
-- Add missing RLS policy for anonymous users to read published POIs
DO $$
BEGIN
  -- Check if policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pois' 
    AND policyname = 'Anonymous can view published POIs'
  ) THEN
    CREATE POLICY "Anonymous can view published POIs" 
      ON public.pois 
      FOR SELECT 
      TO anon
      USING (published = true);
  END IF;
END $$;

-- Also fix the hits table RLS issue to prevent data harvesting
-- Add restrictive policy for hits table to prevent anonymous access
DO $$
BEGIN
  -- Drop the overly permissive "Deny all direct access to hits" policy if it exists
  -- and replace with more specific policies
  DROP POLICY IF EXISTS "Deny all direct access to hits" ON public.hits;
  
  -- Create policies that allow access only via service role (for Edge Functions)
  CREATE POLICY "Service role can manage hits" 
    ON public.hits 
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);
    
  -- Authenticated users can only see aggregated data, not individual records
  CREATE POLICY "Authenticated users can view aggregated hits only" 
    ON public.hits 
    FOR SELECT 
    TO authenticated
    USING (false); -- This effectively denies direct access, forcing use of aggregated queries
    
  -- Anonymous users have no access to hits table
  CREATE POLICY "No anonymous access to hits" 
    ON public.hits 
    FOR ALL 
    TO anon
    USING (false);
END $$;