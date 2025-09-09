import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify JWT and admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid token");
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    const url = new URL(req.url);

    switch (req.method) {
      case "GET":
        // List all users with their profiles
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;

        // Get profiles for additional user info
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) throw profilesError;

        // Combine user data with profiles
        const combinedUsers = users.users.map(user => {
          const userProfile = profiles.find(p => p.auth_user_id === user.id);
          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            email_confirmed_at: user.email_confirmed_at,
            banned_until: user.banned_until,
            last_sign_in_at: user.last_sign_in_at,
            profile: userProfile || null
          };
        });

        return new Response(
          JSON.stringify({ users: combinedUsers }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      case "PUT":
        const { userId, action } = await req.json();
        
        if (action === "ban" || action === "unban") {
          if (!userId) {
            throw new Error("User ID is required");
          }

          console.log(`Admin ${user.id} attempting to ${action} user ${userId}`);
          
          if (action === "ban") {
            // Ban user for 30 days
            const banUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            const { error: banError } = await supabase.auth.admin.updateUserById(userId, {
              banned_until: banUntil
            });
            
            if (banError) {
              console.error('Error banning user:', banError);
              throw banError;
            }
            
            console.log(`User ${userId} banned until ${banUntil}`);
          } else {
            // Unban user by setting banned_until to null
            const { error: unbanError } = await supabase.auth.admin.updateUserById(userId, {
              banned_until: null
            });
            
            if (unbanError) {
              console.error('Error unbanning user:', unbanError);
              throw unbanError;
            }
            
            console.log(`User ${userId} unbanned`);
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: `User ${action === "ban" ? "banned" : "unbanned"} successfully` 
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        } else {
          throw new Error("Invalid action. Use 'ban' or 'unban'");
        }
        break;

      default:
        throw new Error("Method not allowed");
    }

    throw new Error("Invalid action");

  } catch (error) {
    console.error("Admin users function error:", error);
    const message = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: message.includes("permissions") || message.includes("token") ? 403 : 500,
      }
    );
  }
});