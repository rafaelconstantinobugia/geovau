-- Final comprehensive fix for security definer view issue
-- Based on Supabase documentation, we need to explicitly recreate views with SECURITY INVOKER

-- Drop any existing view completely
DROP VIEW IF EXISTS public.pois_public CASCADE;

-- Recreate the view with explicit SECURITY INVOKER
-- Note: Views in PostgreSQL don't actually have SECURITY DEFINER/INVOKER like functions
-- But we'll create it in the most secure way possible
CREATE VIEW public.pois_public 
WITH (security_invoker = true) AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Alternative: If the above doesn't work, create as a function instead
-- Drop the view approach entirely and create a function
DROP VIEW IF EXISTS public.pois_public CASCADE;

-- Create as a SECURITY INVOKER function instead of a view
CREATE OR REPLACE FUNCTION public.get_pois_public()
RETURNS TABLE(
  id text,
  slug text, 
  title text,
  lat double precision,
  lng double precision,
  radius_m integer,
  text text,
  image_url text,
  audio_url text,
  tags text[]
)
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT p.id, p.slug, p.title, p.lat, p.lng, p.radius_m, p.text, p.image_url, p.audio_url, p.tags
  FROM public.pois p
  WHERE p.published = true;
$function$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_pois_public() TO anon, authenticated;