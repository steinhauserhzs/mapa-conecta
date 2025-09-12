import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando atualização do conteúdo numerológico...');
    
    const { content } = await req.json();
    
    console.log('Iniciando processamento do conteúdo numerológico...');
    
    if (!content) {
      throw new Error('Conteúdo não fornecido');
    }

    console.log(`📄 Processando conteúdo com ${content.length} caracteres...`);

    // Primeira etapa: Extrair e estruturar o conteúdo usando OpenAI
    const structurePrompt = `
Você é um especialista em numerologia cabalística. Analise o seguinte conteúdo e extraia TODOS os textos numerológicos, organizando-os no formato JSON.

Para cada texto encontrado, identifique:
1. A seção (motivacao, expressao, impressao, destino, missao, etc.)
2. O número da chave (1-9, 11, 22)
3. O título
4. O corpo do texto completo

Retorne um JSON válido no formato:
{
  "texts": [
    {
      "section": "motivacao",
      "key_number": 1,
      "title": "Título do texto",
      "body": "Conteúdo completo..."
    }
  ]
}

IMPORTANTE: 
- Extraia TODOS os textos, não deixe nenhum de fora
- Mantenha o conteúdo original intacto
- Use nomes de seção em português e minúsculas
- Normalize os nomes das seções conforme padrão do banco

Conteúdo a processar:
${content}
`;

    console.log('🤖 Chamando OpenAI para estruturar o conteúdo...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em numerologia cabalística que extrai e estrutura conteúdo textual para banco de dados.'
          },
          {
            role: 'user',
            content: structurePrompt
          }
        ],
        max_tokens: 16000,
        temperature: 0.1
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const structuredContent = openAIData.choices[0].message.content;

    console.log('📋 Conteúdo estruturado recebido, processando JSON...');

    let parsedContent;
    try {
      // Tentar encontrar o JSON no conteúdo
      const jsonMatch = structuredContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        parsedContent = JSON.parse(structuredContent);
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      throw new Error('Falha ao processar resposta da OpenAI');
    }

    if (!parsedContent.texts || !Array.isArray(parsedContent.texts)) {
      throw new Error('Formato de resposta inválido da OpenAI');
    }

    console.log(`✅ ${parsedContent.texts.length} textos estruturados encontrados`);

    // Segunda etapa: Limpar a base atual e inserir novos dados
    console.log('🗑️ Limpando base de dados atual...');
    
    const { error: deleteError } = await supabase
      .from('numerology_texts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Erro ao limpar base:', deleteError);
    }

    console.log('💾 Inserindo novos textos na base...');

    // Processar em lotes para evitar timeouts
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < parsedContent.texts.length; i += batchSize) {
      const batch = parsedContent.texts.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('numerology_texts')
        .insert(batch.map((text: any) => ({
          section: text.section,
          key_number: parseInt(text.key_number),
          title: text.title,
          body: text.body,
          lang: 'pt-BR',
          version: 'v2.0'
        })));

      if (error) {
        console.error(`Erro no lote ${i / batchSize + 1}:`, error);
        throw error;
      }

      insertedCount += batch.length;
      console.log(`📥 Lote ${i / batchSize + 1}: ${batch.length} textos inseridos (Total: ${insertedCount})`);
    }

    // Terceira etapa: Verificar estatísticas finais
    const { data: stats, error: statsError } = await supabase
      .from('numerology_texts')
      .select('section, count(*)', { count: 'exact' })
      .group('section');

    if (statsError) {
      console.error('Erro ao obter estatísticas:', statsError);
    }

    console.log('📊 Estatísticas finais:', stats);

    return new Response(JSON.stringify({
      success: true,
      message: 'Conteúdo numerológico atualizado com sucesso!',
      stats: {
        totalTexts: insertedCount,
        sections: stats?.length || 0,
        sectionStats: stats
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro na atualização:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});