-- Create GeoVau database schema
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.hits CASCADE;
DROP VIEW IF EXISTS public.pois_public CASCADE;
DROP TABLE IF EXISTS public.pois CASCADE;

-- Create pois table (author-managed content)
CREATE TABLE public.pois (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_m INTEGER NOT NULL DEFAULT 60,
  text TEXT,
  image_url TEXT,
  audio_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  owner UUID, -- nullable for now
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hits table (append-only, via Edge Function only)
CREATE TABLE public.hits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  poi_id TEXT REFERENCES public.pois(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('enter_radius','open_card','manual_click')),
  ua TEXT,
  tz TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  dist_m INTEGER,
  ip INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create public view with safe columns for anonymous read
CREATE VIEW public.pois_public AS
  SELECT id, slug, title, lat, lng, radius_m, text, image_url, audio_url, tags
  FROM public.pois
  WHERE published = true;

-- Enable Row Level Security
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pois table
-- Allow public read access to published POIs
CREATE POLICY "Public can view published POIs" 
  ON public.pois 
  FOR SELECT 
  USING (published = true);

-- Allow owners to manage their own POIs (when auth is implemented)
CREATE POLICY "Owners can manage their own POIs" 
  ON public.pois 
  FOR ALL 
  USING (auth.uid() = owner);

-- RLS Policies for hits table
-- No direct access for anonymous users - only via Edge Function
-- (Edge Function will use service role to bypass RLS)

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.count_hits_ip_minute(ip_in INET)
RETURNS TABLE(count BIGINT)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::BIGINT
  FROM public.hits
  WHERE ip = ip_in
    AND created_at > now() - INTERVAL '1 minute';
$$;

-- Seed sample data for testing
INSERT INTO public.pois (id, slug, title, lat, lng, radius_m, text, tags) VALUES
  ('covao-mezaranhos', 'covao-mezaranhos', 'Covão dos Mezaranhos • Avifauna', 39.4087, -9.2256, 60, 'Garças e limícolas. Evita ruído.', '{fauna}'),
  ('sapal-vau', 'sapal-vau', 'Sapal do Vau • Flora halófita', 39.4072, -9.2204, 50, 'Salicórnia e spartina. Não colher.', '{flora}'),
  ('vista-lagoa', 'vista-lagoa', 'Vista para a Lagoa • História', 39.4049, -9.2149, 50, 'Maior laguna costeira de PT. Aberturas ao mar moldam a pesca.', '{história}');

-- Create indexes for performance
CREATE INDEX idx_pois_published ON public.pois(published);
CREATE INDEX idx_pois_location ON public.pois(lat, lng);
CREATE INDEX idx_hits_poi_id ON public.hits(poi_id);
CREATE INDEX idx_hits_created_at ON public.hits(created_at);
CREATE INDEX idx_hits_kind ON public.hits(kind);