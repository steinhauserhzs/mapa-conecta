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
    console.log('🚀 Iniciando atualização completa do conteúdo numerológico...');
    
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
1. A seção (motivacao, impressao, expressao, destino, missao, psiquico, ciclo_vida, desafio, momento_decisivo, ano_pessoal, mes_pessoal, dia_pessoal, licao_carmica, divida_carmica, tendencia_oculta, resposta_subconsciente, harmonia_conjugal, etc.)
2. O número da chave (1-9, 11, 22)
3. O título
4. O corpo do texto completo
5. Metadados adicionais (cores, pedras, profissões, saúde, anjos)

Retorne um JSON válido no formato:
{
  "texts": [
    {
      "section": "motivacao",
      "key_number": 1,
      "title": "Título do texto",
      "body": "Conteúdo completo...",
      "category": "main",
      "subcategory": null,
      "color_associations": ["vermelho", "laranja"],
      "stone_associations": ["rubi", "granada"],
      "profession_associations": ["líder", "executivo"],
      "health_associations": ["cabeça", "estresse"],
      "keywords": ["individualidade", "pioneirismo"],
      "is_master_number": false,
      "priority": 1
    }
  ],
  "angels": [
    {
      "name": "Nanael",
      "category": "Coro dos Principados", 
      "domain_description": "Domina as ciências...",
      "invocation_time_1": "17h20 às 17h40",
      "psalm_reference": "Salmo 118, Versículo 75",
      "negative_influence": "ignorância e más qualidades"
    }
  ],
  "compatibility": [
    {
      "number_1": 1,
      "number_2": 2,
      "compatibility_text": "Relacionamento harmonioso...",
      "compatibility_score": 8
    }
  ]
}

IMPORTANTE: 
- Extraia TODOS os textos de TODAS as seções: motivação, impressão, expressão, destino, missão, lições cármicas, dívidas cármicas, tendências ocultas, resposta subconsciente, ciclos de vida, desafios, momentos decisivos, ano pessoal, mês pessoal, dia pessoal, anjos cabalísticos, harmonia conjugal, profissões, cores, pedras, saúde
- Mantenha o conteúdo original intacto e completo
- Use nomes de seção padronizados em português e minúsculas
- Capture informações de cores, pedras, profissões e anjos quando disponíveis
- Identifique números mestres (11, 22) corretamente

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
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em numerologia cabalística que extrai e estrutura conteúdo textual completo para banco de dados.'
          },
          {
            role: 'user',
            content: structurePrompt
          }
        ],
        max_completion_tokens: 16000
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

    // Segunda etapa: Limpar e inserir dados
    console.log('🗑️ Limpando base de dados atual...');
    
    // Limpar textos numerológicos
    const { error: deleteTextsError } = await supabase
      .from('numerology_texts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteTextsError) {
      console.error('Erro ao limpar textos:', deleteTextsError);
    }

    // Limpar anjos cabalísticos se existirem
    if (parsedContent.angels && parsedContent.angels.length > 0) {
      const { error: deleteAngelsError } = await supabase
        .from('cabalistic_angels')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
      if (deleteAngelsError) {
        console.error('Erro ao limpar anjos:', deleteAngelsError);
      }
    }

    console.log('💾 Inserindo novos textos na base...');

    // Processar textos em lotes
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
          version: 'v3.0',
          category: text.category || 'main',
          subcategory: text.subcategory || null,
          color_associations: text.color_associations || [],
          stone_associations: text.stone_associations || [],
          profession_associations: text.profession_associations || [],
          health_associations: text.health_associations || [],
          keywords: text.keywords || [],
          is_master_number: text.is_master_number || false,
          priority: text.priority || 0
        })));

      if (error) {
        console.error(`Erro no lote ${i / batchSize + 1}:`, error);
        throw error;
      }

      insertedCount += batch.length;
      console.log(`📥 Lote ${i / batchSize + 1}: ${batch.length} textos inseridos (Total: ${insertedCount})`);
    }

    // Inserir anjos cabalísticos se existirem
    let angelsInserted = 0;
    if (parsedContent.angels && parsedContent.angels.length > 0) {
      console.log('👼 Inserindo anjos cabalísticos...');
      
      const { data: angelsData, error: angelsError } = await supabase
        .from('cabalistic_angels')
        .insert(parsedContent.angels.map((angel: any) => ({
          name: angel.name,
          category: angel.category,
          domain_description: angel.domain_description,
          invocation_time_1: angel.invocation_time_1,
          invocation_time_2: angel.invocation_time_2,
          psalm_reference: angel.psalm_reference,
          negative_influence: angel.negative_influence
        })));

      if (angelsError) {
        console.error('Erro ao inserir anjos:', angelsError);
      } else {
        angelsInserted = parsedContent.angels.length;
        console.log(`👼 ${angelsInserted} anjos cabalísticos inseridos`);
      }
    }

    // Inserir compatibilidades se existirem
    let compatibilityInserted = 0;
    if (parsedContent.compatibility && parsedContent.compatibility.length > 0) {
      console.log('💕 Inserindo dados de compatibilidade...');
      
      const { data: compatibilityData, error: compatibilityError } = await supabase
        .from('love_compatibility')
        .insert(parsedContent.compatibility);

      if (compatibilityError) {
        console.error('Erro ao inserir compatibilidade:', compatibilityError);
      } else {
        compatibilityInserted = parsedContent.compatibility.length;
        console.log(`💕 ${compatibilityInserted} registros de compatibilidade inseridos`);
      }
    }

    // Terceira etapa: Verificar estatísticas finais
    const { data: stats, error: statsError } = await supabase
      .from('numerology_texts')
      .select('section, count(*)')
      .eq('version', 'v3.0');

    if (statsError) {
      console.error('Erro ao obter estatísticas:', statsError);
    }

    console.log('📊 Estatísticas finais:', stats);

    return new Response(JSON.stringify({
      success: true,
      message: 'Conteúdo numerológico atualizado completamente com sucesso!',
      stats: {
        totalTexts: insertedCount,
        totalAngels: angelsInserted,
        totalCompatibility: compatibilityInserted,
        sections: stats?.length || 0,
        sectionStats: stats,
        version: 'v3.0'
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