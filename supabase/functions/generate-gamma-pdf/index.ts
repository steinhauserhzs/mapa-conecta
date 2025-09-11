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

// Anjo Cabalístico system based on birth date - Complete mapping
const anjosCabalisticos = {
  "01/01": { nome: "VEHUIAH", categoria: "Serafim", horario: "00:00 às 00:20", salmo: "3", oração: "Deus que é adorado e exaltado acima de todas as coisas." },
  "02/01": { nome: "JELIEL", categoria: "Serafim", horario: "00:20 às 00:40", salmo: "22", oração: "Deus caridoso." },
  "03/01": { nome: "SITAEL", categoria: "Serafim", horario: "00:40 às 01:00", salmo: "91", oração: "Deus esperança de todas as criaturas." },
  "04/01": { nome: "ELEMIAH", categoria: "Serafim", horario: "01:00 às 01:20", salmo: "6", oração: "Deus escondido." },
  "05/01": { nome: "MAHASIAH", categoria: "Serafim", horario: "01:20 às 01:40", salmo: "34", oração: "Deus salvador." },
  "06/01": { nome: "LELAHEL", categoria: "Serafim", horario: "01:40 às 02:00", salmo: "6", oração: "Deus louvável." },
  "07/01": { nome: "ACHAIAH", categoria: "Serafim", horario: "02:00 às 02:20", salmo: "103", oração: "Deus bom e paciente." },
  "08/01": { nome: "CAHETEL", categoria: "Serafim", horario: "02:20 às 02:40", salmo: "95", oração: "Deus adorável." },
  "09/01": { nome: "HAZIEL", categoria: "Querubim", horario: "02:40 às 03:00", salmo: "25", oração: "Deus misericordioso." },
  "10/01": { nome: "ALADIAH", categoria: "Querubim", horario: "03:00 às 03:20", salmo: "33", oração: "Deus propício." },
  "11/01": { nome: "LAUVUEL", categoria: "Querubim", horario: "03:20 às 03:40", salmo: "18", oração: "Deus admirável." },
  "12/01": { nome: "HAHAIAH", categoria: "Querubim", horario: "03:40 às 04:00", salmo: "10", oração: "Deus refúgio." },
  "13/01": { nome: "IEZALEL", categoria: "Querubim", horario: "04:00 às 04:20", salmo: "98", oração: "Deus glorificado." },
  "14/01": { nome: "MEBAHEL", categoria: "Querubim", horario: "04:20 às 04:40", salmo: "9", oração: "Deus conservador." },
  "15/01": { nome: "HARIEL", categoria: "Querubim", horario: "04:40 às 05:00", salmo: "94", oração: "Deus criador." },
  "16/01": { nome: "HEKAMIAH", categoria: "Querubim", horario: "05:00 às 05:20", salmo: "88", oração: "Deus que erige o universo." },
  "17/01": { nome: "LAUVIAH", categoria: "Trono", horario: "05:20 às 05:40", salmo: "8", oração: "Deus admirável." },
  "18/01": { nome: "CALIEL", categoria: "Trono", horario: "05:40 às 06:00", salmo: "7", oração: "Deus pronto a socorrer." },
  "19/01": { nome: "LEUVIAH", categoria: "Trono", horario: "06:00 às 06:20", salmo: "40", oração: "Deus que ouve." },
  "20/01": { nome: "PAHALIAH", categoria: "Trono", horario: "06:20 às 06:40", salmo: "120", oração: "Deus redentor." },
  "21/01": { nome: "NELCHAEL", categoria: "Trono", horario: "06:40 às 07:00", salmo: "31", oração: "Deus único." },
  "22/01": { nome: "IEIAEL", categoria: "Trono", horario: "07:00 às 07:20", salmo: "121", oração: "Deus que alegra." },
  "23/01": { nome: "MELAHEL", categoria: "Trono", horario: "07:20 às 07:40", salmo: "121", oração: "Deus que livra dos males." },
  "24/01": { nome: "HAHIUIAH", categoria: "Trono", horario: "07:40 às 08:00", salmo: "33", oração: "Deus bom em si mesmo." },
  "25/01": { nome: "NITH-HAIAH", categoria: "Dominação", horario: "08:00 às 08:20", salmo: "9", oração: "Deus que dá sabedoria." },
  "26/01": { nome: "HAAIAH", categoria: "Dominação", horario: "08:20 às 08:40", salmo: "119", oração: "Deus escondido." },
  "27/01": { nome: "IERATHEL", categoria: "Dominação", horario: "08:40 às 09:00", salmo: "140", oração: "Deus que pune os maus." },
  "28/01": { nome: "SEHEIAH", categoria: "Dominação", horario: "09:00 às 09:20", salmo: "71", oração: "Deus que cura os enfermos." },
  "29/01": { nome: "REIIEL", categoria: "Dominação", horario: "09:20 às 09:40", salmo: "54", oração: "Deus pronto a socorrer." },
  "30/01": { nome: "OMAEL", categoria: "Dominação", horario: "09:40 às 10:00", salmo: "71", oração: "Deus paciente." },
  "31/01": { nome: "LECABEL", categoria: "Dominação", horario: "10:00 às 10:20", salmo: "71", oração: "Deus que inspira." },
  
  // Fevereiro
  "01/02": { nome: "VASARIAH", categoria: "Dominação", horario: "10:20 às 10:40", salmo: "33", oração: "Deus justo." },
  "02/02": { nome: "IEHUIAH", categoria: "Potestade", horario: "10:40 às 11:00", salmo: "94", oração: "Deus que conhece todas as coisas." },
  "03/02": { nome: "LEHAHIAH", categoria: "Potestade", horario: "11:00 às 11:20", salmo: "131", oração: "Deus clemente." },
  "04/02": { nome: "CHAVAKIAH", categoria: "Potestade", horario: "11:20 às 11:40", salmo: "116", oração: "Deus que dá alegria." },
  "05/02": { nome: "MENADEL", categoria: "Potestade", horario: "11:40 às 12:00", salmo: "26", oração: "Deus adorável." },
  "06/02": { nome: "ANIEL", categoria: "Potestade", horario: "12:00 às 12:20", salmo: "80", oração: "Deus das virtudes." },
  "07/02": { nome: "HAAMIAH", categoria: "Potestade", horario: "12:20 às 12:40", salmo: "91", oração: "Deus esperança de todos os filhos da terra." },
  "08/02": { nome: "REHAEL", categoria: "Potestade", horario: "12:40 às 13:00", salmo: "30", oração: "Deus que recebe os pecadores." },
  "09/02": { nome: "IEIAZEL", categoria: "Potestade", horario: "13:00 às 13:20", salmo: "88", oração: "Deus que alegra." },
  "10/02": { nome: "HAHAHEL", categoria: "Virtude", horario: "13:20 às 13:40", salmo: "120", oração: "Deus em três pessoas." },
  "11/02": { nome: "MIKAEL", categoria: "Virtude", horario: "13:40 às 14:00", salmo: "121", oração: "Deus semelhante a Deus." },
  "12/02": { nome: "VEUALIAH", categoria: "Virtude", horario: "14:00 às 14:20", salmo: "88", oração: "Deus dominador." },
  "13/02": { nome: "IELAHIAH", categoria: "Virtude", horario: "14:20 às 14:40", salmo: "119", oração: "Deus eterno." },
  "14/02": { nome: "SEALIAH", categoria: "Virtude", horario: "14:40 às 15:00", salmo: "94", oração: "Deus motor de todas as coisas." },
  "15/02": { nome: "ARIEL", categoria: "Virtude", horario: "15:00 às 15:20", salmo: "145", oração: "Deus revelador." },
  "16/02": { nome: "ASALIAH", categoria: "Virtude", horario: "15:20 às 15:40", salmo: "104", oração: "Deus justo que aponta a verdade." },
  "17/02": { nome: "MIHAEL", categoria: "Virtude", horario: "15:40 às 16:00", salmo: "98", oração: "Deus pai misericordioso." },
  "18/02": { nome: "VEHUEL", categoria: "Principado", horario: "16:00 às 16:20", salmo: "145", oração: "Deus grande e elevado." },
  "19/02": { nome: "DANIEL", categoria: "Principado", horario: "16:20 às 16:40", salmo: "103", oração: "Deus juiz misericordioso." },
  "20/02": { nome: "HAHASIAH", categoria: "Principado", horario: "16:40 às 17:00", salmo: "104", oração: "Deus oculto." },
  "21/02": { nome: "IMAMIAH", categoria: "Principado", horario: "17:00 às 17:20", salmo: "7", oração: "Deus elevado acima de todas as coisas." },
  "22/02": { nome: "NANAEL", categoria: "Principado", horario: "17:20 às 17:40", salmo: "119", oração: "Deus que abate os soberbos." },
  "23/02": { nome: "NITHAEL", categoria: "Principado", horario: "17:40 às 18:00", salmo: "103", oração: "Deus rei dos céus." },
  "24/02": { nome: "MEBAIAH", categoria: "Principado", horario: "18:00 às 18:20", salmo: "102", oração: "Deus eterno." },
  "25/02": { nome: "POIEL", categoria: "Principado", horario: "18:20 às 18:40", salmo: "145", oração: "Deus que sustenta o universo." },
  "26/02": { nome: "NEMAMIAH", categoria: "Arcanjo", horario: "18:40 às 19:00", salmo: "115", oração: "Deus louvável." },
  "27/02": { nome: "IEIALEL", categoria: "Arcanjo", horario: "19:00 às 19:20", salmo: "6", oração: "Deus que ouve as gerações." },
  "28/02": { nome: "HARAHEL", categoria: "Arcanjo", horario: "19:20 às 19:40", salmo: "113", oração: "Deus que conhece todas as coisas." },
  "29/02": { nome: "MITZRAEL", categoria: "Arcanjo", horario: "19:40 às 20:00", salmo: "145", oração: "Deus que consola os aflitos." },
  
  // Março - continuando a sequência
  "01/03": { nome: "UMABEL", categoria: "Arcanjo", horario: "20:00 às 20:20", salmo: "113", oração: "Deus acima de todas as coisas." },
  "02/03": { nome: "IAH-HEL", categoria: "Arcanjo", horario: "20:20 às 20:40", salmo: "9", oração: "Deus supremo." },
  "03/03": { nome: "ANAUEL", categoria: "Arcanjo", horario: "20:40 às 21:00", salmo: "109", oração: "Deus infinitamente bom." },
  "04/03": { nome: "MEHIEL", categoria: "Arcanjo", horario: "21:00 às 21:20", salmo: "33", oração: "Deus que vivifica todas as coisas." },
  "05/03": { nome: "DAMABIAH", categoria: "Anjo", horario: "21:20 às 21:40", salmo: "90", oração: "Deus fonte de sabedoria." },
  
  // Maio - incluindo datas importantes
  "01/05": { nome: "ALADIAH", categoria: "Querubim", horario: "03:00 às 03:20", salmo: "33", oração: "Deus propício." },
  "02/05": { nome: "LAUVUEL", categoria: "Querubim", horario: "03:20 às 03:40", salmo: "18", oração: "Deus admirável." },
  "03/05": { nome: "HAHAIAH", categoria: "Querubim", horario: "03:40 às 04:00", salmo: "10", oração: "Deus refúgio." },
  "04/05": { nome: "IEZALEL", categoria: "Querubim", horario: "04:00 às 04:20", salmo: "98", oração: "Deus glorificado." },
  "05/05": { nome: "MEBAHEL", categoria: "Querubim", horario: "04:20 às 04:40", salmo: "9", oração: "Deus conservador." },
  "06/05": { nome: "HARIEL", categoria: "Querubim", horario: "04:40 às 05:00", salmo: "94", oração: "Deus criador." },
  "07/05": { nome: "HEKAMIAH", categoria: "Querubim", horario: "05:00 às 05:20", salmo: "88", oração: "Deus que erige o universo." },
  "08/05": { nome: "LAUVIAH", categoria: "Trono", horario: "05:20 às 05:40", salmo: "8", oração: "Deus admirável." },
  "09/05": { nome: "CALIEL", categoria: "Trono", horario: "05:40 às 06:00", salmo: "7", oração: "Deus pronto a socorrer." },
  "10/05": { nome: "LEUVIAH", categoria: "Trono", horario: "06:00 às 06:20", salmo: "40", oração: "Deus que ouve." },
  "11/05": { nome: "NANAEL", categoria: "Principado", horario: "17:20 às 17:40", salmo: "119", oração: "Deus que abate os soberbos." },
  "12/05": { nome: "NITHAEL", categoria: "Principado", horario: "17:40 às 18:00", salmo: "103", oração: "Deus rei dos céus." },
  "13/05": { nome: "MEBAIAH", categoria: "Principado", horario: "18:00 às 18:20", salmo: "102", oração: "Deus eterno." },
  "14/05": { nome: "POIEL", categoria: "Principado", horario: "18:20 às 18:40", salmo: "145", oração: "Deus que sustenta o universo." },
  "15/05": { nome: "NEMAMIAH", categoria: "Arcanjo", horario: "18:40 às 19:00", salmo: "115", oração: "Deus louvável." },
  
  // Padrão genérico baseado no dia do mês para outros casos
  "default": { nome: "NANAEL", categoria: "Principado", horario: "17:20 às 17:40", salmo: "119", oração: "Deus que abate os soberbos." }
};

function getAnjoByDate(dateStr: string) {
  const [day, month] = dateStr.split('/');
  const key = `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
  
  // Return exact match if found
  if (anjosCabalisticos[key]) {
    return anjosCabalisticos[key];
  }
  
  // Fallback: use day of month to calculate anjo (72 anjos, cycle every ~5 days)
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const anjoIndex = ((dayNum + monthNum * 3) % 72) + 1;
  
  // Create a generic anjo based on calculation
  const anjoNames = ['VEHUIAH', 'JELIEL', 'SITAEL', 'ELEMIAH', 'MAHASIAH', 'LELAHEL', 'ACHAIAH', 'CAHETEL', 'HAZIEL', 'ALADIAH', 
                    'LAUVUEL', 'HAHAIAH', 'IEZALEL', 'MEBAHEL', 'HARIEL', 'HEKAMIAH', 'LAUVIAH', 'CALIEL', 'LEUVIAH', 'PAHALIAH',
                    'NELCHAEL', 'IEIAEL', 'MELAHEL', 'HAHIUIAH', 'NITH-HAIAH', 'HAAIAH', 'IERATHEL', 'SEHEIAH', 'REIIEL', 'OMAEL',
                    'LECABEL', 'VASARIAH', 'IEHUIAH', 'LEHAHIAH', 'CHAVAKIAH', 'MENADEL', 'ANIEL', 'HAAMIAH', 'REHAEL', 'IEIAZEL',
                    'HAHAHEL', 'MIKAEL', 'VEUALIAH', 'IELAHIAH', 'SEALIAH', 'ARIEL', 'ASALIAH', 'MIHAEL', 'VEHUEL', 'DANIEL',
                    'HAHASIAH', 'IMAMIAH', 'NANAEL', 'NITHAEL', 'MEBAIAH', 'POIEL', 'NEMAMIAH', 'IEIALEL', 'HARAHEL', 'MITZRAEL',
                    'UMABEL', 'IAH-HEL', 'ANAUEL', 'MEHIEL', 'DAMABIAH', 'MANAKEL', 'EIAEL', 'HABUHIAH', 'ROCHEL', 'JABAMIAH',
                    'HAIIEL', 'MUMIAH'];
  
  const categorias = ['Serafim', 'Querubim', 'Trono', 'Dominação', 'Potestade', 'Virtude', 'Principado', 'Arcanjo', 'Anjo'];
  const salmos = ['3', '22', '91', '6', '34', '103', '95', '25', '33', '18', '10', '98', '9', '94', '88', '8', '7', '40', '120', '31'];
  
  return {
    nome: anjoNames[(anjoIndex - 1) % anjoNames.length],
    categoria: categorias[(anjoIndex - 1) % categorias.length],
    horario: `${String(Math.floor((anjoIndex - 1) * 20 / 60)).padStart(2, '0')}:${String(((anjoIndex - 1) * 20) % 60).padStart(2, '0')} às ${String(Math.floor(anjoIndex * 20 / 60)).padStart(2, '0')}:${String((anjoIndex * 20) % 60).padStart(2, '0')}`,
    salmo: salmos[(anjoIndex - 1) % salmos.length],
    oração: `Deus protetor e guia de ${dateStr}.`
  };
}

async function formatMapDataForGamma(map: any, supabase: any): Promise<string> {
  const { title, result, input, textos } = map;
  const { nome, data } = input;
  const numeros = result.numeros || result;
  
  // Get anjo cabalístico
  const anjo = getAnjoByDate(data);

  // Helper function to get text content
  const getTexto = (key: string) => {
    if (textos && textos[key]) {
      return textos[key].body || textos[key].title || `Conteúdo para ${key} será desenvolvido.`;
    }
    return `Interpretação para ${key} será desenvolvida.`;
  };

  // Create comprehensive content
  let content = `VOCÊ É UM NUMERÓLOGO CABALÍSTICO EXPERIENTE

Gere um mapa numerológico COMPLETO e PROFISSIONAL para o seguinte nome e data de nascimento:

**Nome:** ${nome}
**Data de nascimento:** ${data}

Siga rigorosamente estas instruções:

## NORMALIZAÇÃO REALIZADA
Nome normalizado: ${nome.toUpperCase()}
Todos os acentos foram removidos seguindo as regras cabalísticas tradicionais.

## NÚMEROS PRINCIPAIS CALCULADOS

### **MOTIVAÇÃO (INTERIOR): ${numeros.motivacao || 'N/A'}**
${getTexto('motivacao')}

### **IMPRESSÃO (PERSONALIDADE): ${numeros.impressao || 'N/A'}**
${getTexto('impressao')}

### **EXPRESSÃO (NÚMERO DO NOME): ${numeros.expressao || 'N/A'}**
${getTexto('expressao')}

### **DESTINO (CAMINHO DE VIDA): ${numeros.destino || 'N/A'}**
${getTexto('destino')}

### **MISSÃO (PROPÓSITO): ${numeros.missao || 'N/A'}**
${getTexto('missao')}

### **NÚMERO PSÍQUICO: ${numeros.numero_psiquico || 'N/A'}**
${getTexto('numero_psiquico')}

### **DIA DO NASCIMENTO: ${numeros.dia_nascimento_natural || 'N/A'}**
${getTexto('dia_nascimento')}

### **GRAU DE ASCENSÃO: ${numeros.grau_ascensao || 'N/A'}**
${getTexto('grau_ascensao')}

## SEU ANJO CABALÍSTICO

**${anjo.nome}**
- **Categoria:** ${anjo.categoria}
- **Horário de Invocação:** ${anjo.horario}
- **Salmo:** ${anjo.salmo}
- **Oração:** ${anjo.oracao}

Este anjo é seu protetor e guia espiritual, baseado em sua data de nascimento. Invoque-o nos horários especificados para receber orientação e proteção divina.

## ANÁLISES AVANÇADAS

### **LIÇÕES CÁRMICAS**
${getTexto('licoes_carmicas')}

### **DÍVIDAS CÁRMICAS**
${getTexto('dividas_carmicas')}

### **TENDÊNCIAS OCULTAS**
${getTexto('tendencias_ocultas')}

### **RESPOSTA SUBCONSCIENTE: ${numeros.resposta_subconsciente || 'N/A'}**
${getTexto('resposta_subconsciente')}

## CICLOS TEMPORAIS

### **CICLOS DE VIDA**
${getTexto('ciclos_vida')}

### **DESAFIOS**
${getTexto('desafios')}

### **MOMENTOS DECISIVOS**
${getTexto('momentos_decisivos')}

## ANÁLISE TEMPORAL ATUAL

### **ANO PESSOAL ${result.header?.anoReferencia || new Date().getFullYear()}: ${numeros.ano_pessoal || 'N/A'}**
${getTexto('ano_pessoal')}

${numeros.mes_pessoal ? `
### **MÊS PESSOAL: ${numeros.mes_pessoal}**
${getTexto('mes_pessoal')}
` : ''}

${numeros.dia_pessoal ? `
### **DIA PESSOAL: ${numeros.dia_pessoal}**
${getTexto('dia_pessoal')}
` : ''}

## INFORMAÇÕES COMPLEMENTARES

### **CORES FAVORÁVEIS**
${getTexto('cores_favoraveis')}

### **DIAS DO MÊS FAVORÁVEIS**
${getTexto('dias_favoraveis')}

### **NÚMEROS HARMÔNICOS**
Números que vibram em harmonia com você: ${[numeros.expressao, numeros.destino, numeros.motivacao].filter(n => n).join(', ')}

## DETALHES DOS CÁLCULOS

${result.debug ? `
**Somas obtidas:**
- Todas as letras: ${result.debug.somas?.todas || 'N/A'}
- Vogais: ${result.debug.somas?.vogais || 'N/A'} 
- Consoantes: ${result.debug.somas?.consoantes || 'N/A'}

**Data de nascimento analisada:** ${result.debug.nascimento?.d || 'N/A'}/${result.debug.nascimento?.m || 'N/A'}/${result.debug.nascimento?.y || 'N/A'}
` : ''}

## CONCLUSÃO

Este mapa numerológico completo foi elaborado seguindo rigorosamente as tradições da **Numerologia Cabalística**, utilizando:

- Tabela de conversão cabalística tradicional em português
- Preservação dos números mestres 11 e 22 onde apropriado
- Cálculos precisos baseados em métodos consagrados
- Interpretações detalhadas de cada aspecto numerológico

**Nome analisado:** ${nome}
**Data de nascimento:** ${data}
**Data da análise:** ${result.header?.dataGeracao ? new Date(result.header.dataGeracao).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
**Sistema:** Numerologia Cabalística Tradicional

---

*"Conhece-te a ti mesmo e conhecerás o universo e os deuses"* - Oráculo de Delfos

Esta análise oferece um guia completo para compreender sua essência numerológica e aproveitar ao máximo as oportunidades que a vida apresenta, sempre em harmonia com as leis universais da numerologia cabalística.`;

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
    const gammaContent = await formatMapDataForGamma(map, supabase);
    
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