-- Fix security linter warnings

-- Remove the security definer view and recreate as regular view
DROP VIEW IF EXISTS public.pois_public;

-- Recreate as regular view (not security definer)
CREATE VIEW public.pois_public AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Enable RLS on the view
ALTER VIEW public.pois_public ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for the view
CREATE POLICY "Public can view pois_public" 
  ON public.pois_public 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- For hits table, add a policy that denies all access except via service role
-- This satisfies the linter while maintaining security
CREATE POLICY "Deny all direct access to hits" 
  ON public.hits 
  FOR ALL 
  TO anon, authenticated
  USING (false);