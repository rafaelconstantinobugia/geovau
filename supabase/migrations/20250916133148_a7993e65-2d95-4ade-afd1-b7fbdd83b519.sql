-- Fix search path for the get_pois_localized function
DROP FUNCTION IF EXISTS public.get_pois_localized(TEXT);

CREATE OR REPLACE FUNCTION public.get_pois_localized(lang TEXT DEFAULT 'pt')
RETURNS TABLE (
  id TEXT,
  slug TEXT,
  title TEXT,
  text TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_m INTEGER,
  image_url TEXT,
  audio_url TEXT,
  tags TEXT[]
) 
LANGUAGE SQL STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.slug,
    CASE 
      WHEN lang = 'en' AND p.title_en IS NOT NULL THEN p.title_en
      WHEN lang = 'es' AND p.title_es IS NOT NULL THEN p.title_es
      WHEN lang = 'fr' AND p.title_fr IS NOT NULL THEN p.title_fr
      ELSE p.title
    END as title,
    CASE 
      WHEN lang = 'en' AND p.text_en IS NOT NULL THEN p.text_en
      WHEN lang = 'es' AND p.text_es IS NOT NULL THEN p.text_es
      WHEN lang = 'fr' AND p.text_fr IS NOT NULL THEN p.text_fr
      ELSE p.text
    END as text,
    p.lat,
    p.lng,
    p.radius_m,
    p.image_url,
    p.audio_url,
    CASE 
      WHEN lang = 'en' AND p.tags_en IS NOT NULL THEN p.tags_en
      WHEN lang = 'es' AND p.tags_es IS NOT NULL THEN p.tags_es
      WHEN lang = 'fr' AND p.tags_fr IS NOT NULL THEN p.tags_fr
      ELSE p.tags
    END as tags
  FROM public.pois p
  WHERE p.published = true;
$$;