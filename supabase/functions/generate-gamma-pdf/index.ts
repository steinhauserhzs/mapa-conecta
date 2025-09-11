import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GammaGenerateRequest {
  title: string;
  content: string;
  format?: 'presentation' | 'document';
  style?: 'professional' | 'creative' | 'minimal';
}

interface GammaGenerateResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

async function callGammaGenerate(apiKey: string, request: GammaGenerateRequest): Promise<GammaGenerateResponse> {
  const response = await fetch('https://api.gamma.app/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function checkGammaStatus(apiKey: string, jobId: string): Promise<GammaGenerateResponse> {
  const response = await fetch(`https://api.gamma.app/v1/generate/${jobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gamma API status check error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function downloadPDF(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

function formatMapDataForGamma(map: any): string {
  const { title, result, input } = map;
  const { nome, data } = input;
  
  // Create structured content for Gamma
  let content = `# Mapa Numerológico - ${nome}\n\n`;
  content += `**Data de Nascimento:** ${data}\n\n`;
  
  // Add main sections
  if (result.expressao) {
    content += `## Número de Expressão: ${result.expressao}\n`;
    content += `O Número de Expressão revela seus talentos naturais e o caminho que deve seguir na vida.\n\n`;
  }
  
  if (result.motivacao) {
    content += `## Número de Motivação: ${result.motivacao}\n`;
    content += `O Número de Motivação representa seus desejos mais profundos e o que realmente te motiva.\n\n`;
  }
  
  if (result.impressao) {
    content += `## Número de Impressão: ${result.impressao}\n`;
    content += `O Número de Impressão mostra como as outras pessoas te veem e a primeira impressão que você causa.\n\n`;
  }
  
  if (result.destino) {
    content += `## Número do Destino: ${result.destino}\n`;
    content += `O Número do Destino indica as lições de vida que você precisa aprender e o propósito de sua existência.\n\n`;
  }
  
  if (result.psiquico) {
    content += `## Número Psíquico: ${result.psiquico}\n`;
    content += `O Número Psíquico revela sua personalidade interna e como você se vê.\n\n`;
  }
  
  if (result.anoPersonal) {
    content += `## Ano Personal: ${result.anoPersonal}\n`;
    content += `O Ano Personal indica as tendências e oportunidades para este período de sua vida.\n\n`;
  }

  // Add summary section
  content += `## Resumo da Análise\n\n`;
  content += `Este mapa numerológico oferece insights profundos sobre sua personalidade, `;
  content += `talentos naturais e o caminho de vida idealizado para ${nome}. `;
  content += `Cada número carrega significados específicos que, quando compreendidos, `;
  content += `podem orientar decisões importantes e auxiliar no autoconhecimento.\n\n`;
  
  content += `**Data da Análise:** ${new Date().toLocaleDateString('pt-BR')}\n`;
  content += `**Numerologia Cabalística Tradicional**`;

  return content;
}

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

    const gammaApiKey = Deno.env.get("GAMMA_API_KEY");
    if (!gammaApiKey) {
      throw new Error("GAMMA_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching map data for ID:', map_id);

    // Get map data
    const { data: map, error: mapError } = await supabase
      .from("maps")
      .select("*")
      .eq("id", map_id)
      .single();

    if (mapError || !map) {
      return new Response("Map not found", { 
        status: 404,
        headers: corsHeaders 
      });
    }

    // Update status to processing
    await supabase
      .from("maps")
      .update({ status: "processing" })
      .eq("id", map_id);

    console.log('Starting Gamma PDF generation for map:', map.title);

    // Format map data for Gamma
    const gammaContent = formatMapDataForGamma(map);
    
    // Create Gamma generation request
    const gammaRequest: GammaGenerateRequest = {
      title: `Mapa Numerológico - ${map.input?.nome || 'Análise'}`,
      content: gammaContent,
      format: 'document',
      style: 'professional'
    };

    // Start Gamma generation
    console.log('Calling Gamma Generate API...');
    const generateResponse = await callGammaGenerate(gammaApiKey, gammaRequest);
    console.log('Gamma Generate Response:', generateResponse);

    if (generateResponse.status === 'failed') {
      throw new Error(`Gamma generation failed: ${generateResponse.error}`);
    }

    // Poll for completion
    let statusResponse = generateResponse;
    const maxAttempts = 30; // 5 minutes max wait time
    let attempts = 0;

    console.log('Polling for completion...');
    while (statusResponse.status !== 'completed' && statusResponse.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      statusResponse = await checkGammaStatus(gammaApiKey, generateResponse.job_id);
      console.log(`Status check ${attempts + 1}:`, statusResponse);
      attempts++;
    }

    if (statusResponse.status === 'failed') {
      throw new Error(`Gamma generation failed: ${statusResponse.error}`);
    }

    if (statusResponse.status !== 'completed' || !statusResponse.url) {
      throw new Error('Gamma generation timed out or completed without URL');
    }

    console.log('PDF generation completed, downloading from:', statusResponse.url);

    // Download the generated PDF
    const pdfBytes = await downloadPDF(statusResponse.url);
    const fileName = `maps/${map_id}.pdf`;

    console.log('Uploading PDF to Supabase Storage...');

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

    console.log('PDF generated successfully via Gamma:', publicData.publicUrl);

    return new Response(JSON.stringify({ 
      ok: true, 
      pdf_url: publicData.publicUrl,
      gamma_job_id: generateResponse.job_id
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in generate-gamma-pdf function:', error);
    
    // Try to update map status on error
    try {
      const { map_id } = await req.json();
      if (map_id) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from("maps")
          .update({ 
            status: "error",
            error_msg: error.message
          })
          .eq("id", map_id);
      }
    } catch (updateError) {
      console.error('Failed to update map status on error:', updateError);
    }

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