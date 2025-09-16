-- Fix Security Definer function issue
-- The count_hits_ip_minute function was flagged as SECURITY DEFINER
-- Since this function is only used for rate limiting by the Edge Function,
-- and the Edge Function runs with service_role privileges,
-- we can modify it to be SECURITY INVOKER and ensure proper access via RLS policies

-- First, let's recreate the function as SECURITY INVOKER
DROP FUNCTION IF EXISTS public.count_hits_ip_minute(inet);

-- Create the function as SECURITY INVOKER (default, more secure)
CREATE OR REPLACE FUNCTION public.count_hits_ip_minute(ip_in inet)
RETURNS TABLE(count bigint)
LANGUAGE sql
STABLE SECURITY INVOKER  -- Explicitly set as SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT count(*)::BIGINT
  FROM public.hits
  WHERE ip = ip_in
    AND created_at > now() - INTERVAL '1 minute';
$function$;

-- Grant execute permission to service_role so the Edge Function can use it
GRANT EXECUTE ON FUNCTION public.count_hits_ip_minute(inet) TO service_role;

-- Also grant to authenticated users in case we need admin functionality
GRANT EXECUTE ON FUNCTION public.count_hits_ip_minute(inet) TO authenticated;