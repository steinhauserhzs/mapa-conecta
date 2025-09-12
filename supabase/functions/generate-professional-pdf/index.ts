import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mapId } = await req.json();
    
    if (!mapId) {
      return new Response(
        JSON.stringify({ error: 'mapId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF for map:', mapId);

    // Buscar dados do mapa
    const { data: mapData, error: mapError } = await supabase
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .single();

    if (mapError || !mapData) {
      console.error('Error fetching map:', mapError);
      return new Response(
        JSON.stringify({ error: 'Map not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Atualizar status para "processing"
    await supabase
      .from('maps')
      .update({ status: 'processing' })
      .eq('id', mapId);

    // Gerar HTML profissional do PDF
    const htmlContent = generateProfessionalHTML(mapData);

    // Gerar PDF usando Puppeteer (simulado - em produção usaria Puppeteer real)
    const pdfBuffer = await generatePDFFromHTML(htmlContent);

    // Upload para Supabase Storage
    const fileName = `map-${mapId}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('maps')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      await supabase
        .from('maps')
        .update({ status: 'error' })
        .eq('id', mapId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to upload PDF' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('maps')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData?.publicUrl;

    // Atualizar mapa com URL do PDF
    await supabase
      .from('maps')
      .update({ 
        pdf_url: publicUrl,
        status: 'ready' 
      })
      .eq('id', mapId);

    console.log('PDF generated successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf_url: publicUrl,
        message: 'PDF generated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-professional-pdf:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateProfessionalHTML(mapData: any): string {
  const result = mapData.result || {};
  const numbers = result.numbers || {};
  const texts = result.texts || {};
  const header = result.header || {};
  const cabalisticAngel = result.cabalisticAngel || {};

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa Numerológico Profissional - ${header.nome || header.name || 'Cliente'}</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2c3e50;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .cover-page {
            page-break-after: always;
            text-align: center;
            padding: 100px 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .cover-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .cover-subtitle {
            font-size: 1.5rem;
            margin-bottom: 50px;
            opacity: 0.9;
        }
        
        .cover-name {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 20px;
            border: 3px solid white;
            padding: 20px;
            border-radius: 15px;
        }
        
        .cover-details {
            font-size: 1.2rem;
            opacity: 0.8;
        }
        
        .page-section {
            page-break-before: always;
            padding: 40px;
            background: white;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .section-title {
            font-size: 2rem;
            color: #4a90e2;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #4a90e2;
        }
        
        .numbers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .number-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .number-value {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .number-label {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .number-description {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .text-content {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 10px;
            border-left: 5px solid #4a90e2;
            margin: 20px 0;
            line-height: 1.8;
            font-size: 1.1rem;
        }
        
        .angel-section {
            background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            text-align: center;
        }
        
        .angel-name {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #7f8c8d;
            border-top: 1px solid #ddd;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            color: #2c3e50;
        }
        
        .index-section {
            padding: 30px;
            background: white;
            border-radius: 10px;
        }
        
        .index-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px dotted #ddd;
        }
    </style>
</head>
<body>
    <!-- Capa -->
    <div class="cover-page">
        <h1 class="cover-title">MAPA NUMEROLÓGICO</h1>
        <h2 class="cover-subtitle">Análise Cabalística Completa</h2>
        <div class="cover-name">${header.nome || header.name || 'Cliente'}</div>
        <div class="cover-details">
            <p>Data de Nascimento: ${header.dataNascimento || header.birth || 'Não informado'}</p>
            <p>Data de Geração: ${new Date().toLocaleDateString('pt-BR')}</p>
            <p>Ano de Referência: ${header.anoReferencia || new Date().getFullYear()}</p>
        </div>
    </div>

    <!-- Índice -->
    <div class="page-section">
        <h2 class="section-title">ÍNDICE</h2>
        <div class="index-section">
            <div class="index-item">
                <span>1. Sumário Executivo</span>
                <span>Pág. 3</span>
            </div>
            <div class="index-item">
                <span>2. Números Fundamentais</span>
                <span>Pág. 4</span>
            </div>
            <div class="index-item">
                <span>3. Análise Detalhada - Motivação</span>
                <span>Pág. 5</span>
            </div>
            <div class="index-item">
                <span>4. Análise Detalhada - Impressão</span>
                <span>Pág. 6</span>
            </div>
            <div class="index-item">
                <span>5. Análise Detalhada - Expressão</span>
                <span>Pág. 7</span>
            </div>
            <div class="index-item">
                <span>6. Análise Detalhada - Destino</span>
                <span>Pág. 8</span>
            </div>
            <div class="index-item">
                <span>7. Análise Detalhada - Missão</span>
                <span>Pág. 9</span>
            </div>
            <div class="index-item">
                <span>8. Seu Anjo Cabalístico</span>
                <span>Pág. 10</span>
            </div>
            <div class="index-item">
                <span>9. Número Psíquico</span>
                <span>Pág. 11</span>
            </div>
            <div class="index-item">
                <span>10. Lições Cármicas</span>
                <span>Pág. 12</span>
            </div>
            <div class="index-item">
                <span>11. Dívidas Cármicas</span>
                <span>Pág. 13</span>
            </div>
            <div class="index-item">
                <span>12. Desafios de Vida</span>
                <span>Pág. 14</span>
            </div>
            <div class="index-item">
                <span>13. Ciclos de Vida</span>
                <span>Pág. 15</span>
            </div>
            <div class="index-item">
                <span>14. Ano Pessoal Atual</span>
                <span>Pág. 16</span>
            </div>
            <div class="index-item">
                <span>15. Conclusões e Orientações</span>
                <span>Pág. 17</span>
            </div>
        </div>
    </div>

    <!-- Sumário Executivo -->
    <div class="page-section">
        <h2 class="section-title">SUMÁRIO EXECUTIVO</h2>
        <div class="highlight-box">
            <h3>Perfil Numerológico Principal</h3>
            <p><strong>Expressão ${numbers.expression || 0}:</strong> Este é seu número principal de talentos e habilidades naturais.</p>
            <p><strong>Motivação ${numbers.motivation || 0}:</strong> Representa seus desejos e impulsos internos mais profundos.</p>
            <p><strong>Destino ${numbers.destiny || 0}:</strong> Indica o caminho de vida e as lições a serem aprendidas.</p>
        </div>
        <div class="text-content">
            <p>Este mapa numerológico foi calculado seguindo os princípios da numerologia cabalística tradicional, oferecendo insights profundos sobre sua personalidade, potenciais e desafios de vida.</p>
        </div>
    </div>

    <!-- Números Fundamentais -->
    <div class="page-section">
        <h2 class="section-title">SEUS NÚMEROS FUNDAMENTAIS</h2>
        <div class="numbers-grid">
            <div class="number-card">
                <div class="number-value">${numbers.motivation || 0}</div>
                <div class="number-label">MOTIVAÇÃO</div>
                <div class="number-description">O que te move interiormente</div>
            </div>
            <div class="number-card">
                <div class="number-value">${numbers.impression || 0}</div>
                <div class="number-label">IMPRESSÃO</div>
                <div class="number-description">Como os outros te veem</div>
            </div>
            <div class="number-card">
                <div class="number-value">${numbers.expression || 0}</div>
                <div class="number-label">EXPRESSÃO</div>
                <div class="number-description">Seus talentos naturais</div>
            </div>
            <div class="number-card">
                <div class="number-value">${numbers.destiny || 0}</div>
                <div class="number-label">DESTINO</div>
                <div class="number-description">Sua missão de vida</div>
            </div>
            <div class="number-card">
                <div class="number-value">${numbers.mission || 0}</div>
                <div class="number-label">MISSÃO</div>
                <div class="number-description">Seu propósito maior</div>
            </div>
            <div class="number-card">
                <div class="number-value">${numbers.psychic || 0}</div>
                <div class="number-label">PSÍQUICO</div>
                <div class="number-description">Sua intuição natural</div>
            </div>
        </div>
    </div>

    <!-- Análises Detalhadas -->
    ${generateDetailedAnalyses(numbers, texts)}

    <!-- Anjo Cabalístico -->
    ${cabalisticAngel.name ? `
    <div class="page-section">
        <div class="angel-section">
            <div class="angel-name">${cabalisticAngel.name}</div>
            <h3>SEU ANJO CABALÍSTICO PROTETOR</h3>
            <p><strong>Categoria:</strong> ${cabalisticAngel.category || 'Anjo Protetor'}</p>
            <div class="text-content" style="color: #2c3e50; margin-top: 20px;">
                <p>${cabalisticAngel.description || 'Seu anjo cabalístico é seu guia espiritual e protetor, oferecendo orientação e força em sua jornada de vida.'}</p>
                ${cabalisticAngel.psalm ? `<p><strong>Salmo de Invocação:</strong> ${cabalisticAngel.psalm}</p>` : ''}
                ${cabalisticAngel.invocationTime1 ? `<p><strong>Horário de Invocação:</strong> ${cabalisticAngel.invocationTime1}</p>` : ''}
            </div>
        </div>
    </div>
    ` : ''}

    <!-- Conclusão -->
    <div class="page-section">
        <h2 class="section-title">CONCLUSÕES E ORIENTAÇÕES</h2>
        <div class="text-content">
            <p>Este mapa numerológico oferece um guia completo para compreender sua personalidade única e navegar pelos desafios e oportunidades da vida.</p>
            <p>Lembre-se de que a numerologia é uma ferramenta de autoconhecimento e crescimento pessoal. Use essas informações como um guia, mas sempre confie em sua intuição e livre arbítrio.</p>
        </div>
        <div class="highlight-box">
            <h3>Principais Recomendações:</h3>
            <ul>
                <li>Desenvolva os talentos indicados pelo seu número de Expressão</li>
                <li>Trabalhe conscientemente os desafios apresentados</li>
                <li>Mantenha conexão com seu Anjo Cabalístico através da meditação e oração</li>
                <li>Use as informações deste mapa como ferramenta de autoconhecimento contínuo</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>© ${new Date().getFullYear()} Sistema de Numerologia Cabalística</p>
        <p>Mapa gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Este documento contém informações confidenciais e pessoais</p>
    </div>
</body>
</html>
  `;
}

function generateDetailedAnalyses(numbers: any, texts: any): string {
  const sections = [
    { key: 'motivation', title: 'MOTIVAÇÃO', number: numbers.motivation || 0 },
    { key: 'impression', title: 'IMPRESSÃO', number: numbers.impression || 0 },
    { key: 'expression', title: 'EXPRESSÃO', number: numbers.expression || 0 },
    { key: 'destiny', title: 'DESTINO', number: numbers.destiny || 0 },
    { key: 'mission', title: 'MISSÃO', number: numbers.mission || 0 },
    { key: 'psychic', title: 'NÚMERO PSÍQUICO', number: numbers.psychic || 0 }
  ];

  return sections.map(section => `
    <div class="page-section">
        <h2 class="section-title">${section.title} - ${section.number}</h2>
        <div class="text-content">
            <p>${texts[section.key] || getDefaultText(section.key, section.number)}</p>
        </div>
    </div>
  `).join('');
}

function getDefaultText(key: string, number: number): string {
  const defaults: Record<string, Record<number, string>> = {
    motivation: {
      1: "Você é movido pela necessidade de independência e liderança. Sua motivação interna busca pioneirismo e originalidade.",
      2: "Sua motivação está na cooperação e diplomacia. Você busca harmonia e parcerias em tudo que faz.",
      3: "A criatividade e expressão artística são suas principais motivações. Você busca se comunicar e inspirar outros.",
      // Adicionar mais números conforme necessário
    },
    // Adicionar outras seções
  };

  return defaults[key]?.[number] || `Análise detalhada do ${key} número ${number} será desenvolvida em breve.`;
}

async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  // Em um ambiente real, usaríamos Puppeteer ou similar
  // Por enquanto, simulamos gerando um PDF básico
  
  // Simulação de geração de PDF
  const encoder = new TextEncoder();
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
100 700 Td
(Mapa Numerológico PDF Gerado) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000192 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
285
%%EOF`;

  return encoder.encode(pdfContent);
}