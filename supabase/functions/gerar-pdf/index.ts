import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { map_id } = await req.json();
    if (!map_id) {
      return new Response("map_id required", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get map data
    const { data: map, error: mapError } = await supabase
      .from("maps")
      .select("*")
      .eq("id", map_id)
      .single();

    if (mapError || !map) {
      return new Response("map not found", { 
        status: 404,
        headers: corsHeaders 
      });
    }

    // Update status to processing
    await supabase
      .from("maps")
      .update({ status: "processing" })
      .eq("id", map_id);

    // TODO: Generate real PDF with official template
    // For now, create a simple placeholder PDF
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Mapa Numerológico - ${map.title}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000228 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
320
%%EOF`;

    const pdfBytes = new TextEncoder().encode(pdfContent);
    const fileName = `maps/${map_id}.pdf`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("maps")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      await supabase
        .from("maps")
        .update({ 
          status: "error",
          error_msg: `Upload failed: ${uploadError.message}`
        })
        .eq("id", map_id);
      
      throw uploadError;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("maps")
      .getPublicUrl(fileName);

    // Update map with PDF URL and ready status
    const { error: updateError } = await supabase
      .from("maps")
      .update({ 
        pdf_url: publicData.publicUrl,
        status: "ready",
        error_msg: null
      })
      .eq("id", map_id);

    if (updateError) {
      throw updateError;
    }

    console.log('PDF generated successfully:', publicData.publicUrl);

    return new Response(JSON.stringify({ 
      ok: true, 
      pdf_url: publicData.publicUrl 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in gerar-pdf function:', error);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    });
  }
});