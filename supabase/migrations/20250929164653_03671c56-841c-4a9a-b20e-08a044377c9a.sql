-- Add color field to pois table
ALTER TABLE public.pois 
ADD COLUMN color TEXT DEFAULT '#FF6A00';