// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOW_ORIGIN = "*"; // Allow all origins for development
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
};

function checkBasicAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Basic ")) return false;
  const [, b64] = auth.split(" ");
  try {
    const [user, pass] = atob(b64).split(":");
    return user === "admin" && pass === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

type Poi = {
  id?: string; 
  title: string; 
  lat: number; 
  lng: number;
  radius_m?: number; 
  text?: string; 
  image_url?: string; 
  audio_url?: string;
  tags?: string[]; 
  published?: boolean;
  title_en?: string;
  title_es?: string;
  title_fr?: string;
  text_en?: string;
  text_es?: string;
  text_fr?: string;
  tags_en?: string[];
  tags_es?: string[];
  tags_fr?: string[];
};

serve(async (req) => {
  console.log(`${req.method} ${req.url}`);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const headers = { ...corsHeaders, "content-type": "application/json" };

  if (!checkBasicAuth(req)) {
    console.log("Unauthorized access attempt");
    return new Response(JSON.stringify({ error: "unauthorized" }), { 
      status: 401, 
      headers 
    });
  }

  try {
    if (req.method === "GET") {
      console.log("Fetching POIs...");
      const { data, error } = await supabase.from("pois")
        .select(`
          id, title, lat, lng, radius_m, text, image_url, audio_url, 
          tags, published, updated_at,
          title_en, title_es, title_fr,
          text_en, text_es, text_fr,
          tags_en, tags_es, tags_fr
        `)
        .order("updated_at", { ascending: false })
        .limit(200);
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} POIs`);
      return new Response(JSON.stringify({ data }), { headers });
    }

    const body = (await req.json()) as Partial<Poi>;
    
    const clean = (p: any) => {
      if (typeof p.title !== "string" || p.title.trim().length < 2) {
        throw new Error("title inválido");
      }
      if (typeof p.lat !== "number" || p.lat < -90 || p.lat > 90) {
        throw new Error("lat inválida");
      }
      if (typeof p.lng !== "number" || p.lng < -180 || p.lng > 180) {
        throw new Error("lng inválida");
      }
      if (p.radius_m != null) {
        p.radius_m = Math.min(Math.max(p.radius_m, 10), 500);
      }
      if (p.tags && !Array.isArray(p.tags)) {
        throw new Error("tags inválidas");
      }
      return p;
    };

    if (req.method === "POST") {
      console.log("Creating new POI...");
      const payload = clean({
        id: body.id, 
        title: body.title, 
        lat: body.lat, 
        lng: body.lng,
        radius_m: body.radius_m ?? 60, 
        text: body.text ?? null,
        image_url: body.image_url ?? null, 
        audio_url: body.audio_url ?? null,
        tags: body.tags ?? [], 
        published: body.published ?? true,
        title_en: body.title_en ?? null,
        title_es: body.title_es ?? null,
        title_fr: body.title_fr ?? null,
        text_en: body.text_en ?? null,
        text_es: body.text_es ?? null,
        text_fr: body.text_fr ?? null,
        tags_en: body.tags_en ?? null,
        tags_es: body.tags_es ?? null,
        tags_fr: body.tags_fr ?? null,
      });
      
      // Generate id if not provided
      if (!payload.id) {
        payload.id = (payload.title as string)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 60);
      }
      
      const { error } = await supabase.from("pois").insert(payload);
      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
      
      console.log(`Created POI: ${payload.id}`);
      return new Response(JSON.stringify({ ok: true, id: payload.id }), { headers });
    }

    if (req.method === "PATCH") {
      if (!body.id) throw new Error("id obrigatório");
      
      console.log(`Updating POI: ${body.id}`);
      const { id, ...rest } = body;
      const payload = clean(rest);
      
      const { error } = await supabase.from("pois").update(payload).eq("id", id);
      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      
      console.log(`Updated POI: ${id}`);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (req.method === "DELETE") {
      if (!body.id) throw new Error("id obrigatório");
      
      console.log(`Deleting POI: ${body.id}`);
      const { error } = await supabase.from("pois").delete().eq("id", body.id);
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      console.log(`Deleted POI: ${body.id}`);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ error: "method not allowed" }), { 
      status: 405, 
      headers 
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { 
      status: 400, 
      headers 
    });
  }
});