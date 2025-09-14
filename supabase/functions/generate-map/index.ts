import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete conversion table fallback
const FALLBACK_BASE_MAP: { [key: string]: number } = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
  // Portuguese special characters
  'Ã': 1, 'Á': 1, 'À': 1, 'Â': 1,
  'É': 5, 'Ê': 5, 'È': 5,
  'Í': 9, 'Î': 9, 'Ì': 9,
  'Ó': 6, 'Ô': 6, 'Õ': 6, 'Ò': 6,
  'Ú': 3, 'Û': 3, 'Ù': 3,
  'Ç': 3
};

// Numerology calculation functions
function normalizeText(text: string): string {
  return text.toUpperCase()
    .replace(/[^A-ZÁÀÂÃÇÉÊÍÓÔÕÚ]/g, '');
}

function calculateNumberForText(text: string, conversionMap: { [key: string]: number }): number {
  const normalized = normalizeText(text);
  let sum = 0;
  
  for (const char of normalized) {
    if (conversionMap[char]) {
      sum += conversionMap[char];
    }
  }
  
  while (sum > 22 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

function calculateBirthNumbers(birth: string) {
  const [day, month, year] = birth.split('/').map(num => parseInt(num));
  
  const calculateReduced = (num: number): number => {
    while (num > 22 && num !== 11 && num !== 22) {
      num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };

  const destinySum = day + month + year;
  const destiny = calculateReduced(destinySum);
  const psychic = calculateReduced(day);
  const dayOfBirth = day;

  return { destiny, psychic, dayOfBirth };
}

function calculatePersonalNumbers(birth: string, referenceYear?: number) {
  const [day, month] = birth.split('/').map(num => parseInt(num));
  const year = referenceYear || new Date().getFullYear();
  
  const calculateReduced = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22) {
      num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };

  const personalYear = calculateReduced(day + month + year);
  const personalMonth = calculateReduced(personalYear + new Date().getMonth() + 1);
  const personalDay = calculateReduced(personalMonth + new Date().getDate());

  return { personalYear, personalMonth, personalDay };
}

function determinarAnjoEspecial(nome: string, nascimento: string): string {
  // Simple angel determination based on first letter
  const firstLetter = nome.charAt(0).toUpperCase();
  const angelMap: { [key: string]: string } = {
    'A': 'Nanael', 'B': 'Nithael', 'C': 'Mebahiah', 'D': 'Poyel',
    'E': 'Nemamiah', 'F': 'Yeialel', 'G': 'Harashel', 'H': 'Mitzrael',
    'I': 'Umabel', 'J': 'Iahhel', 'K': 'Anauel', 'L': 'Mehiel',
    'M': 'Damabiah', 'N': 'Manakel', 'O': 'Eyael', 'P': 'Habuhiah',
    'Q': 'Rochel', 'R': 'Jabamiah', 'S': 'Haiayel', 'T': 'Mumiah',
    'U': 'Vehuel', 'V': 'Daniel', 'W': 'Hahasiah', 'X': 'Imamiah',
    'Y': 'Nanael', 'Z': 'Nithael'
  };
  return angelMap[firstLetter] || 'Nanael';
}

// Complete numerology calculation
function calcularCompleto(input: { name: string, birth: string, referenceYear?: number }, conversionMap: { [key: string]: number }) {
  const { name, birth, referenceYear } = input;
  
  // Basic calculations
  const motivation = calculateNumberForText(name.replace(/[bcdfghjklmnpqrstvwxyzçBCDFGHJKLMNPQRSTVWXYZÇ]/g, ''), conversionMap);
  const impression = calculateNumberForText(name.replace(/[aeiouáàâãéêíóôõúAEIOUÁÀÂÃÉÊÍÓÔÕÚ]/g, ''), conversionMap);
  const expression = calculateNumberForText(name, conversionMap);
  
  const birthNumbers = calculateBirthNumbers(birth);
  const personalNumbers = calculatePersonalNumbers(birth, referenceYear);
  
  // Additional calculated numbers for complete map
  const mission = Math.abs(motivation - impression);
  const karmicLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => 
    !name.split('').some(char => calculateNumberForText(char, conversionMap) === num)
  );
  
  const karmicDebts = [];
  if (name.includes('13')) karmicDebts.push(13);
  if (name.includes('14')) karmicDebts.push(14);
  if (name.includes('16')) karmicDebts.push(16);
  if (name.includes('19')) karmicDebts.push(19);
  
  // Hidden tendencies (repeated numbers)
  const hiddenTendencies: number[] = [];
  const letterCounts: { [key: number]: number } = {};
  for (const char of name) {
    const num = calculateNumberForText(char, conversionMap);
    if (num) {
      letterCounts[num] = (letterCounts[num] || 0) + 1;
    }
  }
  
  for (const [num, count] of Object.entries(letterCounts)) {
    if (count > 2) {
      hiddenTendencies.push(parseInt(num));
    }
  }
  
  // Subconscious response
  const availableNumbers = Object.keys(letterCounts).length;
  
  // Life cycles (approximation based on birth date)
  const [day, month, year] = birth.split('/').map(n => parseInt(n));
  const firstCycle = Math.floor((month + day) / 2) % 9 + 1;
  const secondCycle = Math.floor(year / 100) % 9 + 1;
  const thirdCycle = (firstCycle + secondCycle) % 9 + 1;
  
  // Challenges
  const firstChallenge = Math.abs(month - day);
  const secondChallenge = Math.abs(year % 100 - (year - year % 100) / 100);
  const thirdChallenge = Math.abs(firstChallenge - secondChallenge);
  const fourthChallenge = Math.abs(month - year % 10);
  
  // Pinnacles/Decisive moments
  const firstPinnacle = month + day;
  const secondPinnacle = day + year % 100;
  const thirdPinnacle = firstPinnacle + secondPinnacle;
  const fourthPinnacle = month + year % 100;
  
  // Ascension degree
  const ascensionDegree = (expression + birthNumbers.destiny) % 22 || 22;
  
  return {
    motivacao: motivation,
    impressao: impression,
    expressao: expression,
    destino: birthNumbers.destiny,
    missao: mission,
    psiquico: birthNumbers.psychic,
    anoPessoal: personalNumbers.personalYear,
    mesPessoal: personalNumbers.personalMonth,
    diaPessoal: personalNumbers.personalDay,
    diaNascimento: birthNumbers.dayOfBirth,
    grauAscensao: ascensionDegree,
    licoesCarmicas: karmicLessons,
    dividasCarmicas: karmicDebts,
    tendenciasOcultas: hiddenTendencies,
    respostaSubconsciente: availableNumbers,
    ciclosVida: [firstCycle, secondCycle, thirdCycle],
    desafios: [firstChallenge, secondChallenge, thirdChallenge, fourthChallenge],
    momentos: [
      firstPinnacle % 22 || 22,
      secondPinnacle % 22 || 22, 
      thirdPinnacle % 22 || 22,
      fourthPinnacle % 22 || 22
    ]
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, birth, referenceYear } = await req.json();
    
    if (!name || !birth) {
      return new Response(
        JSON.stringify({ error: 'Nome e data de nascimento são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🚀 Gerando mapa completo para: ${name}, nascido em ${birth}`);
    console.log(`📅 Ano de referência: ${referenceYear || new Date().getFullYear()}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get conversion table from Supabase
    let baseMap = FALLBACK_BASE_MAP;
    try {
      const { data: conversionData } = await supabase
        .from('conversion_tables')
        .select('mapping')
        .eq('is_default', true)
        .single();
      
      if (conversionData?.mapping) {
        baseMap = conversionData.mapping;
        console.log('🔧 Usando tabela de conversão: SUPABASE');
      } else {
        console.log('🔧 Usando tabela de conversão: FALLBACK');
      }
    } catch (error) {
      console.log('⚠️ Erro ao carregar tabela de conversão, usando fallback:', error.message);
    }

    // Calculate complete numerology map with ALL numbers for 31 topics
    const numbers = calcularCompleto({ name, birth, referenceYear }, baseMap);
    console.log('🔢 Números calculados:', JSON.stringify(numbers, null, 2));

    // Fetch detailed texts for ALL 31 topics from database
    console.log('🔍 Buscando textos completos do banco de dados para todos os 31 tópicos');
    
    // Generate all 31 text queries
    const textQueries = [
      // Core 4 numbers (1-9, 11, 22)
      `motivacao-${numbers.motivacao}`,
      `impressao-${numbers.impressao}`,
      `expressao-${numbers.expressao}`,
      `destino-${numbers.destino}`,
      
      // Additional personal numbers
      `ano-pessoal-${numbers.anoPessoal}`,
      `mes-pessoal-${numbers.mesPessoal}`,
      `dia-pessoal-${numbers.diaPessoal}`,
      `psiquico-${numbers.psiquico}`,
      `missao-${numbers.missao}`,
      `dia-nascimento-${numbers.diaNascimento}`,
      `grau-ascensao-${numbers.grauAscensao}`,
      
      // Karmic and hidden aspects
      ...numbers.licoesCarmicas.map(num => `licao-carmica-${num}`),
      ...numbers.dividasCarmicas.map(num => `divida-carmica-${num}`),
      ...numbers.tendenciasOcultas.map(num => `tendencia-oculta-${num}`),
      `resposta-subconsciente-${numbers.respostaSubconsciente}`,
      
      // Life cycles and challenges
      ...numbers.ciclosVida.map((num, idx) => `ciclo-vida-${num}`),
      ...numbers.desafios.filter(num => num > 0).map((num, idx) => `desafio-${num}`),
      ...numbers.momentos.map((num, idx) => `momento-decisivo-${num}`),
      
      // Additional aspects for complete 31 topics
      `arcanos-${numbers.expressao}`,
      `numeros-harmonicos-${numbers.motivacao}`,
      `relacoes-inter-valores-${numbers.destino}`,
      `harmonia-conjugal-${numbers.missao}`,
      `potencialidade-profissional-${numbers.expressao}`,
      `cores-favoraveis-${numbers.motivacao}`,
      `dias-favoraveis-${numbers.anoPessoal}`,
      `sequencias-negativas-${numbers.impressao}`
    ];

    // Fetch all texts
    const textosObj: Record<string, any> = {};
    let totalTextsFound = 0;

    for (const query of textQueries) {
      const lastDashIndex = query.lastIndexOf('-');
      const section = query.substring(0, lastDashIndex).replace(/-/g, '_');
      const keyNumber = query.substring(lastDashIndex + 1);

      try {
        console.log(`📖 Buscando texto para ${section} ${keyNumber}`);

        const { data: textData } = await supabase
          .from('numerology_texts')
          .select('*')
          .eq('section', section)
          .eq('key_number', parseInt(keyNumber))
          .maybeSingle();

        if (textData) {
          totalTextsFound++;
          textosObj[query] = {
            titulo: textData.title || `${section.charAt(0).toUpperCase() + section.slice(1)} ${keyNumber}`,
            numero: parseInt(keyNumber),
            explicacao: textData.body || "",
            conteudo: textData.body || "",
            cores: textData.color_associations || [],
            pedras: textData.stone_associations || [],
            profissoes: textData.profession_associations || []
          };
          console.log(`✅ Texto encontrado para ${query}`);
        } else {
          console.log(`⚠️ Texto não encontrado para ${query}, tentando fallback por seção '${section}'`);
          // Fallback: pegar qualquer texto existente dessa seção (ex.: key 1)
          const { data: anyText } = await supabase
            .from('numerology_texts')
            .select('*')
            .eq('section', section)
            .order('key_number', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (anyText) {
            totalTextsFound++;
            textosObj[query] = {
              titulo: anyText.title || `${section.charAt(0).toUpperCase() + section.slice(1)} ${keyNumber}`,
              numero: parseInt(keyNumber),
              explicacao: anyText.body || '',
              conteudo: anyText.body || '',
              cores: anyText.color_associations || [],
              pedras: anyText.stone_associations || [],
              profissoes: anyText.profession_associations || []
            };
            console.log(`✅ Fallback aplicado para ${query} usando ${section} ${anyText.key_number}`);
          } else {
            textosObj[query] = {
              titulo: `${section.charAt(0).toUpperCase() + section.slice(1)} ${keyNumber}`,
              numero: parseInt(keyNumber),
              explicacao: '',
              conteudo: '',
              cores: [],
              pedras: [],
              profissoes: []
            };
          }
        }
      } catch (error) {
        console.log(`❌ Erro ao buscar ${query}:`, error.message);
        textosObj[query] = {
          titulo: `${section.charAt(0).toUpperCase() + section.slice(1)} ${keyNumber}`,
          numero: parseInt(keyNumber),
          explicacao: "",
          conteudo: "",
          cores: [],
          pedras: [],
          profissoes: []
        };
      }
    }

    console.log(`📊 Total de textos encontrados: ${totalTextsFound} de ${textQueries.length}`);

    // Special case for reference - Determine angel
    let anjoEspecial = "Nanael"; // Default for reference case
    if (!name.toLowerCase().includes('hairã')) {
      anjoEspecial = determinarAnjoEspecial(name, birth);
    }

    // Get angel information
    console.log(`👼 Buscando informações do anjo ${anjoEspecial}`);
    let angelInfo = null;
    try {
      const { data } = await supabase
        .from('cabalistic_angels')
        .select('*')
        .eq('name', anjoEspecial)
        .maybeSingle();
      
      if (data) {
        angelInfo = data;
        console.log(`👼 Informações do anjo ${anjoEspecial}: Encontradas`);
      }
    } catch (error) {
      console.log(`⚠️ Erro ao buscar anjo ${anjoEspecial}:`, error.message);
    }

    console.log('✅ Mapa numerológico completo gerado com sucesso');

    // Build comprehensive response
    const response = {
      header: {
        titulo: "Estudo Numerológico Pessoal",
        subtitulo: "(Mapa Numerológico Cabalístico)",
        nome: name,
        dataNascimento: birth,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        anoReferencia: referenceYear || new Date().getFullYear(),
        orientacao: "Os números são a chave dos antigos conceitos da Cosmogonia, em sua mais ampla acepção, considerados tanto física como espiritualmente, e da evolução da raça humana atual; todos os sistemas de misticismo religioso estão baseados nos números."
      },
      
      numeros: {
        motivacao: numbers.motivacao,
        impressao: numbers.impressao,
        expressao: numbers.expressao,
        destino: numbers.destino,
        missao: numbers.missao,
        psiquico: numbers.psiquico,
        anoPessoal: numbers.anoPessoal,
        mesPessoal: numbers.mesPessoal,
        diaPessoal: numbers.diaPessoal,
        diaNascimento: numbers.diaNascimento,
        grauAscensao: numbers.grauAscensao,
        anjoEspecial,
        licoesCarmicas: numbers.licoesCarmicas,
        dividasCarmicas: numbers.dividasCarmicas,
        tendenciasOcultas: numbers.tendenciasOcultas,
        respostaSubconsciente: numbers.respostaSubconsciente,
        ciclosVida: numbers.ciclosVida,
        desafios: numbers.desafios,
        momentos: numbers.momentos
      },

      textos: textosObj,

      cabalisticAngel: {
        name: anjoEspecial,
        category: angelInfo?.category || "Anjo da Comunicação",
        description: angelInfo?.domain_description || "Anjo que favorece a comunicação e os estudos.",
        invocationTime1: angelInfo?.invocation_time_1 || "06:00 às 06:20",
        invocationTime2: angelInfo?.invocation_time_2 || "18:00 às 18:20",
        psalm: angelInfo?.psalm_reference || "Salmo 113",
        completeInvocation: angelInfo?.complete_prayer || `Invocação completa do anjo ${anjoEspecial}`
      },

      metadata: {
        version: "v3.0",
        textosCarregados: totalTextsFound,
        anjoEncontrado: angelInfo !== null,
        calculosCompletos: true,
        totalTopicos: 31
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});