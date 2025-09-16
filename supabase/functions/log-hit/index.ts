import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HitRequest {
  poi_id: string;
  kind: 'enter_radius' | 'open_card' | 'manual_click';
  lat?: number;
  lng?: number;
  dist_m?: number;
  tz?: string;
  ua?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get request body
    const body: HitRequest = await req.json();
    console.log('Received hit request:', body);

    // Validate required fields
    if (!body.poi_id || !body.kind) {
      return new Response(JSON.stringify({ error: 'Missing required fields: poi_id, kind' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate kind enum
    const validKinds = ['enter_radius', 'open_card', 'manual_click'];
    if (!validKinds.includes(body.kind)) {
      return new Response(JSON.stringify({ error: 'Invalid kind. Must be one of: ' + validKinds.join(', ') }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1';

    // Rate limiting: check hits from this IP in the last minute
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('count_hits_ip_minute', { ip_in: clientIP });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // Continue anyway, don't block on rate limit check failure
    } else if (rateLimitData && rateLimitData[0]?.count > 60) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Insert hit record
    const { data, error } = await supabase
      .from('hits')
      .insert({
        poi_id: body.poi_id,
        kind: body.kind,
        lat: body.lat || null,
        lng: body.lng || null,
        dist_m: body.dist_m || null,
        ip: clientIP,
        ua: body.ua || req.headers.get('user-agent') || null,
        tz: body.tz || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to log hit' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Successfully logged hit:', data.id);

    return new Response(JSON.stringify({ 
      success: true, 
      hit_id: data.id,
      message: 'Hit logged successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in log-hit function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});