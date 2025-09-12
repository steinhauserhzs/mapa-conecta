import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Processando material PROFISSIONAL para mapas de 60+ páginas...');

    const { content } = await req.json();
    console.log(`📄 Material recebido: ${content.length} caracteres`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    const prompt = `Você é um NUMERÓLOGO MASTER especialista em Numerologia Cabalística Pitagórica. Extraia TODO o conteúdo deste material profissional e crie textos RICOS de 1500-3000 caracteres cada, com análises psicológicas profundas, orientações práticas e exemplos concretos.

EXTRAIR TUDO PARA:
- Motivação, Impressão, Expressão, Destino, Missão, Psíquico (números 1-9, 11, 22, 33)  
- Ciclos de Vida, Desafios, Momentos Decisivos
- Lições Cármicas, Dívidas Cármicas, Tendências Ocultas
- 72 Anjos Cabalísticos completos
- Orientações profissionais detalhadas
- Saúde e bem-estar
- Correspondências (cores, pedras, metais)
- Compatibilidade amorosa completa

Retorne JSON estruturado com textos profissionais de qualidade premium.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: 'Você é um numerólogo master que gera conteúdo profissional rico.' },
          { role: 'user', content: `${prompt}\n\n${content}` }
        ],
        max_completion_tokens: 16000
      }),
    });

    const data = await response.json();
    const responseContent = data.choices[0].message.content;
    
    let structuredData;
    try {
      const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : responseContent;
      structuredData = JSON.parse(jsonContent);
    } catch (parseError) {
      throw new Error('Falha ao processar resposta da OpenAI');
    }

    // Limpar e inserir dados
    console.log('🗑️ Limpando base existente...');
    await supabase.from('numerology_texts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('cabalistic_angels').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    let totalInserted = 0;

    // Inserir textos numerológicos
    if (structuredData.numerology_texts?.length > 0) {
      console.log(`📝 Inserindo ${structuredData.numerology_texts.length} textos profissionais...`);
      
      const enrichedTexts = structuredData.numerology_texts.map(text => ({
        ...text,
        version: 'v3.0',
        lang: 'pt-BR',
        content_length: text.body?.length || 0
      }));
      
      const { error } = await supabase.from('numerology_texts').insert(enrichedTexts);
      if (error) throw error;
      totalInserted += structuredData.numerology_texts.length;
    }

    // Inserir anjos cabalísticos  
    if (structuredData.cabalistic_angels?.length > 0) {
      console.log(`👼 Inserindo ${structuredData.cabalistic_angels.length} anjos...`);
      const { error } = await supabase.from('cabalistic_angels').insert(structuredData.cabalistic_angels);
      if (error) throw error;
      totalInserted += structuredData.cabalistic_angels.length;
    }

    console.log(`✅ BASE PROFISSIONAL COMPLETA! ${totalInserted} registros inseridos`);

    return new Response(JSON.stringify({
      success: true,
      message: 'SISTEMA NUMEROLÓGICO PROFISSIONAL IMPLEMENTADO!',
      total_records: totalInserted,
      ready_for: '60+ page maps'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});