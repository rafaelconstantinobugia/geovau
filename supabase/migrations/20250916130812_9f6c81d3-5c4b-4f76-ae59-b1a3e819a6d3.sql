-- Restore simple view approach now that security issue is resolved
-- Drop the function and recreate as a simple view
DROP FUNCTION IF EXISTS public.get_pois_public();

-- Create simple view (this should not trigger SECURITY DEFINER warnings anymore)
CREATE VIEW public.pois_public AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Grant access
GRANT SELECT ON public.pois_public TO anon, authenticated;

-- Add comment for documentation
COMMENT ON VIEW public.pois_public IS 'Public read-only view of published POIs for anonymous access. Used by the frontend application.';