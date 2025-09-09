// Ensure a profile exists for the authenticated user
// Creates a profile row if missing using the service role key

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    // Client for user authentication
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false }
    });

    const { data: userData, error: getUserError } = await supabaseAuth.auth.getUser(token);
    if (getUserError || !userData.user) {
      return new Response(JSON.stringify({ error: "not_authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;

    // Service role client for privileged writes
    const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

    // Check if profile exists
    const { data: existing, error: selectErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (selectErr) {
      console.error("ensure-profile: select error", selectErr);
      return new Response(JSON.stringify({ error: selectErr.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (existing) {
      return new Response(JSON.stringify({ ensured: true, id: existing.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create a new profile
    const nameFromMeta = (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "Usuário";

    const { data: inserted, error: insertErr } = await supabase
      .from("profiles")
      .insert({
        auth_user_id: user.id,
        email: user.email,
        name: nameFromMeta,
        role: "user",
      })
      .select("id")
      .maybeSingle();

    if (insertErr) {
      console.error("ensure-profile: insert error", insertErr);
      return new Response(JSON.stringify({ error: insertErr.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ensured: true, id: inserted?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("ensure-profile: unexpected error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});