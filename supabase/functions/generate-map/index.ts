import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Base cabalistic conversion table (1-8)
const FALLBACK_BASE_MAP = {
  'A': 1, 'I': 1, 'Q': 1, 'Y': 1, 'J': 1,
  'B': 2, 'K': 2, 'R': 2,
  'C': 3, 'G': 3, 'L': 3, 'S': 3,
  'D': 4, 'M': 4, 'T': 4,
  'E': 5, 'H': 5, 'N': 5,
  'U': 6, 'V': 6, 'W': 6, 'X': 6,
  'O': 7, 'Z': 7,
  'F': 8, 'P': 8, 'Ç': 8
};

// Anjos cabalísticos por nome
const CABALISTIC_ANGELS = [
  "Vehuiah", "Jeliel", "Sitael", "Elemiah", "Mahasiah", "Lelahel", "Achaiah", "Cahetel",
  "Haziel", "Aladiah", "Lauviah", "Hahaiah", "Jezalel", "Mebahel", "Hariel", "Hekamiah",
  "Lauviah", "Caliel", "Leuviah", "Pahaliah", "Nelchael", "Yeiayel", "Melahel", "Haheuiah",
  "Nith-Haiah", "Haaiah", "Yerathel", "Seheiah", "Reiyel", "Omael", "Lecabel", "Vasariah",
  "Yehuiah", "Lehahiah", "Chavakiah", "Menadel", "Aniel", "Haamiah", "Rehael", "Ieiazel",
  "Hahahel", "Mikael", "Veualiah", "Yelahiah", "Sehaliah", "Ariel", "Asaliah", "Mihael",
  "Vehuel", "Daniel", "Hahasiah", "Imamiah", "Nanael", "Nithael", "Mebahiah", "Poiel",
  "Nemamiah", "Yeialel", "Harahel", "Mitzrael", "Umabel", "Iah-Hel", "Anauel", "Mehiel",
  "Damabiah", "Manakel", "Eyael", "Habuhiah", "Rochel", "Jabamiah", "Haiaiel", "Mumiah"
];

// Função para analisar caracteres
function analyzeChar(raw: string) {
  const base = raw.normalize('NFD').toLowerCase();
  const char = base[0];
  const marks = base.slice(1);
  
  return {
    base: char.toUpperCase(),
    marks: marks ? marks.split('').map(m => m.charCodeAt(0)) : [],
    original: raw
  };
}

function applyMods(v: number, m: any): number {
  if (!m || !Array.isArray(m)) return v;
  
  for (const mark of m) {
    if (mark === 769) v += 2; // apostrophe (´)
    else if (mark === 770) v += 7; // circumflex (^)
    else if (mark === 778) v += 7; // ring above (°)
    else if (mark === 771) v += 3; // tilde (~)
    else if (mark === 776) v *= 2; // diaeresis (¨)
    else if (mark === 768) v *= 2; // grave (`)
  }
  
  return v;
}

function letterValue(raw: string, baseMap: Record<string, number>): number {
  const { base, marks } = analyzeChar(raw);
  let val = baseMap[base];
  if (val === undefined) return 0;
  return applyMods(val, marks);
}

function sumLetters(str: string, baseMap: Record<string, number>, filter?: (ch: string) => boolean): number {
  let total = 0;
  for (const ch of str) {
    if (/[a-záàâãéèêíìîóòôõúùûç]/i.test(ch)) {
      if (!filter || filter(ch)) {
        total += letterValue(ch, baseMap);
      }
    }
  }
  return total;
}

function reduce(n: number): number {
  if (n === 11 || n === 22) return n;
  while (n > 9) {
    n = String(n).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    if (n === 11 || n === 22) return n;
  }
  return n;
}

function reduceSimple(n: number): number {
  while (n > 9) {
    n = Math.floor(n / 10) + (n % 10);
  }
  return n;
}

function parseBirth(b: string) {
  const parts = b.split(/[\/\-\.]/);
  if (parts.length !== 3) throw new Error("Formato de data inválido");
  
  let d: number, m: number, y: number;
  
  if (parts[0].length === 4) {
    y = parseInt(parts[0]);
    m = parseInt(parts[1]); 
    d = parseInt(parts[2]);
  } else {
    d = parseInt(parts[0]);
    m = parseInt(parts[1]);
    y = parseInt(parts[2]);
    if (y < 100) y += (y <= 30 ? 2000 : 1900);
  }
  
  return { d, m, y };
}

function sumBirth({ d, m, y }: { d: number, m: number, y: number }): number {
  const total = d + m + y;
  return reduce(total);
}

// Função para calcular lições cármicas (números ausentes no nome)
function calcularLicoesCarmicas(name: string, baseMap: Record<string, number>): number[] {
  const numbersInName = new Set<number>();
  
  for (const ch of name) {
    if (/[a-záàâãéèêíìîóòôõúùûç]/i.test(ch)) {
      const value = letterValue(ch, baseMap);
      if (value > 0 && value <= 9) {
        numbersInName.add(value);
      }
    }
  }
  
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return allNumbers.filter(num => !numbersInName.has(num));
}

// Função para calcular dívidas cármicas
function calcularDividasCarmicas(name: string, birth: string, baseMap: Record<string, number>): number[] {
  const karmaNumbers = [13, 14, 16, 19];
  const foundKarma: number[] = [];
  
  // Verificar no nome
  const nameTotal = sumLetters(name, baseMap);
  if (karmaNumbers.includes(nameTotal)) {
    foundKarma.push(nameTotal);
  }
  
  // Verificar na data de nascimento
  const { d, m, y } = parseBirth(birth);
  const birthTotal = d + m + y;
  if (karmaNumbers.includes(birthTotal)) {
    foundKarma.push(birthTotal);
  }
  
  return [...new Set(foundKarma)]; // Remove duplicatas
}

// Função para calcular tendências ocultas (números mais frequentes no nome)
function calcularTendenciasOcultas(name: string, baseMap: Record<string, number>): number[] {
  const frequency: Record<number, number> = {};
  
  for (const ch of name) {
    if (/[a-záàâãéèêíìîóòôõúùûç]/i.test(ch)) {
      const value = letterValue(ch, baseMap);
      if (value > 0 && value <= 9) {
        frequency[value] = (frequency[value] || 0) + 1;
      }
    }
  }
  
  const maxFreq = Math.max(...Object.values(frequency));
  return Object.keys(frequency)
    .filter(key => frequency[parseInt(key)] === maxFreq && maxFreq > 1)
    .map(key => parseInt(key));
}

// Função para calcular resposta subconsciente
function calcularRespostaSubconsciente(licoesCarmicas: number[]): number {
  const totalNumbers = 9;
  const presentNumbers = totalNumbers - licoesCarmicas.length;
  return reduce(presentNumbers);
}

// Função para calcular ciclos de vida
function calcularCiclosVida(birth: string): [number, number, number] {
  const { d, m, y } = parseBirth(birth);
  
  const primeiro = reduce(m);
  const segundo = reduce(d);
  const terceiro = reduce(y);
  
  return [primeiro, segundo, terceiro];
}

// Função para calcular desafios
function calcularDesafios(birth: string): [number, number, number] {
  const { d, m, y } = parseBirth(birth);
  
  // Reduce components to 1-9 for challenge calculations
  const dRed = reduceSimple(d);
  const mRed = reduceSimple(m);
  const yRed = reduceSimple(y);
  
  const d1 = Math.abs(mRed - dRed);
  const d2 = Math.abs(yRed - dRed);
  const principal = Math.abs(d1 - d2);
  
  return [d1, d2, principal];
}

// Função para calcular momentos decisivos
function calcularMomentos(birth: string, destino: number): [number, number, number, number] {
  const { d, m, y } = parseBirth(birth);
  
  const primeiro = reduce(m + d);
  const segundo = reduce(d + y);
  const terceiro = reduce(primeiro + segundo);
  const quarto = reduce(m + y);
  
  return [primeiro, segundo, terceiro, quarto];
}

// Função para calcular mês e dia pessoal
function calcularMesDiaPersonal(anoPessoal: number, mesAtual?: number, diaAtual?: number): { mes: number; dia: number } {
  const mes = mesAtual ? reduce(anoPessoal + mesAtual) : anoPessoal;
  const dia = diaAtual ? reduce(mes + diaAtual) : mes;
  
  return { mes, dia };
}

// Função principal de cálculo
function calcularCompleto({ name, birth }: { name: string, birth: string }, baseMap: Record<string, number>) {
  // Cálculos básicos
  const motivacao = reduce(sumLetters(name, baseMap, ch => /[aeiouáàâãéèêíìîóòôõúùû]/i.test(ch)));
  const impressao = reduce(sumLetters(name, baseMap, ch => !/[aeiouáàâãéèêíìîóòôõúùû]/i.test(ch)));
  const expressao = reduce(sumLetters(name, baseMap));
  
  const { d, m, y } = parseBirth(birth);
  const destino = sumBirth({ d, m, y });
  const missao = reduceSimple(expressao + destino);
  const psiquico = reduce(d);
  
  // Cálculos avançados
  const licoesCarmicas = calcularLicoesCarmicas(name, baseMap);
  const dividasCarmicas = calcularDividasCarmicas(name, birth, baseMap);
  const tendenciasOcultas = calcularTendenciasOcultas(name, baseMap);
  const respostaSubconsciente = calcularRespostaSubconsciente(licoesCarmicas);
  
  const ciclosVida = calcularCiclosVida(birth);
  const desafios = calcularDesafios(birth);
  const momentos = calcularMomentos(birth, destino);
  
  return {
    motivacao,
    impressao, 
    expressao,
    destino,
    missao,
    psiquico,
    licoesCarmicas,
    dividasCarmicas,
    tendenciasOcultas,
    respostaSubconsciente,
    ciclosVida,
    desafios,
    momentos
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, birth, anoReferencia = new Date().getFullYear() } = await req.json();
    
    if (!name || !birth) {
      throw new Error('Nome e data de nascimento são obrigatórios');
    }

    console.log(`🚀 Gerando mapa completo para: ${name}, nascido em ${birth}`);
    console.log(`📅 Ano de referência: ${anoReferencia}`);
    console.log(`🔧 Usando tabela de conversão: ${convError ? 'FALLBACK' : 'SUPABASE'}`);

    // Buscar tabela de conversão
    const { data: conversionData, error: convError } = await supabase
      .from('conversion_tables')
      .select('mapping')
      .eq('is_default', true)
      .limit(1);

    const baseMap = convError || !conversionData || conversionData.length === 0 
      ? FALLBACK_BASE_MAP 
      : conversionData[0].mapping;

    // Realizar cálculos numerológicos
    const result = calcularCompleto({ name, birth }, baseMap);
    
    console.log(`🔢 Números calculados:`, {
      motivacao: result.motivacao,
      impressao: result.impressao,
      expressao: result.expressao,
      destino: result.destino,
      missao: result.missao,
      psiquico: result.psiquico,
      licoesCarmicas: result.licoesCarmicas,
      dividasCarmicas: result.dividasCarmicas,
      tendenciasOcultas: result.tendenciasOcultas,
      respostaSubconsciente: result.respostaSubconsciente,
      ciclosVida: result.ciclosVida,
      desafios: result.desafios,
      momentos: result.momentos
    });
    
    // Calcular ano, mês e dia pessoal
    const { d, m, y } = parseBirth(birth);
    const anoPessoal = reduce(d + m + anoReferencia);
    const { mes: mesPessoal, dia: diaPessoal } = calcularMesDiaPersonal(anoPessoal, new Date().getMonth() + 1, new Date().getDate());

    // Determinar anjo cabalístico
    const angelIndex = (result.expressao + result.destino - 1) % CABALISTIC_ANGELS.length;
    const anjoEspecial = CABALISTIC_ANGELS[angelIndex];

    // Buscar textos numerológicos com nova estrutura v3.0
    const { data: textsData, error: textsError } = await supabase
      .from('numerology_texts')
      .select('*')
      .eq('version', 'v3.0')
      .order('priority', { ascending: false });

    const texts = textsError ? [] : textsData;
    
    // Buscar dados do anjo cabalístico
    const { data: angelData } = await supabase
      .from('cabalistic_angels')
      .select('*')
      .eq('name', anjoEspecial)
      .limit(1);

    const angelInfo = angelData && angelData.length > 0 ? angelData[0] : null;

    console.log(`📊 Encontrados ${texts.length} textos numerológicos v3.0`);

    // Função para buscar texto por seção e número
    const getTextForNumber = (section: string, number: number) => {
      return texts.find(t => 
        t.section === section && 
        t.key_number === number
      );
    };

    // Construir conteúdo do mapa completo
    const mapaContent = {
      header: {
        titulo: "Estudo Numerológico Pessoal",
        subtitulo: "(Mapa Numerológico Cabalístico)",
        nome: name,
        dataNascimento: birth,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        orientacao: "Os números são a chave dos antigos conceitos da Cosmogonia, em sua mais ampla acepção, considerados tanto física como espiritualmente, e da evolução da raça humana atual; todos os sistemas de misticismo religioso estão baseados nos números. A santidade dos números começa com a Grande Causa Primeira e Única, e acaba com o nada, o zero, símbolo do Universo infinito. - (Helena P. Blavatsky, em Isis Sem Véu, Vol. II, pág. 407)."
      },
      
      numeros: {
        motivacao: result.motivacao,
        impressao: result.impressao,
        expressao: result.expressao,
        destino: result.destino,
        missao: result.missao,
        psiquico: result.psiquico,
        anoPessoal,
        mesPessoal,
        diaPessoal,
        anjoEspecial,
        licoesCarmicas: result.licoesCarmicas,
        dividasCarmicas: result.dividasCarmicas,
        tendenciasOcultas: result.tendenciasOcultas,
        respostaSubconsciente: result.respostaSubconsciente,
        ciclosVida: result.ciclosVida,
        desafios: result.desafios,
        momentos: result.momentos
      },

      textos: {
        motivacao: {
          titulo: "Motivação",
          numero: result.motivacao,
          explicacao: "O número de Motivação descreve os motivos e as razões que movem as atitudes do ser humano e o seu modo de proceder. Esse número revela o aspecto interior da personalidade, da alma, que se reflete em suas atitudes e comportamentos, principalmente na intimidade e no lar, influenciando ainda nas escolhas pessoais.",
          conteudo: getTextForNumber('motivacao', result.motivacao)?.body || `Motivação ${result.motivacao} - Este número revela seus desejos mais profundos e o que verdadeiramente o motiva na vida.`,
          cores: getTextForNumber('motivacao', result.motivacao)?.color_associations || [],
          pedras: getTextForNumber('motivacao', result.motivacao)?.stone_associations || [],
          profissoes: getTextForNumber('motivacao', result.motivacao)?.profession_associations || []
        },

        impressao: {
          titulo: "Impressão",
          numero: result.impressao,
          explicacao: "O número de Impressão descreve a personalidade em seu aspecto externo, o ego, ou seja, a aparência da personalidade atual. É o número que descreve aquela primeira impressão que a pessoa causa quando é vista por outro.",
          conteudo: getTextForNumber('impressao', result.impressao)?.body || `Impressão ${result.impressao} - Este número revela como os outros o percebem inicialmente.`
        },

        expressao: {
          titulo: "Expressão", 
          numero: result.expressao,
          explicacao: "O número de Expressão enuncia a maneira como a pessoa age e interage com os outros, com o mundo, revelando quais são os seus verdadeiros talentos e as aptidões que desenvolverá ao longo da vida e a melhor forma de expressá-los.",
          conteudo: getTextForNumber('expressao', result.expressao)?.body || `Expressão ${result.expressao} - Este número revela seus talentos naturais e como você se expressa no mundo.`
        },

        destino: {
          titulo: "Destino",
          numero: result.destino,
          explicacao: "O número de destino é determinado pela data de nascimento - dia, mês e ano. O destino rege a vida do ser humano e indica o seu caminho evolutivo. Ele orienta as decisões mais importantes na vida.",
          conteudo: getTextForNumber('destino', result.destino)?.body || `Destino ${result.destino} - Este número revela sua missão de vida e caminho evolutivo.`
        },

        missao: {
          titulo: "Missão",
          numero: result.missao,
          explicacao: "Cada ser humano traz ao nascer uma Missão, que nada mais é que a sua vocação. Essa Missão será desenvolvida ao longo da vida independentemente de qual profissão exercerá.",
          conteudo: getTextForNumber('missao', result.missao)?.body || `Missão ${result.missao} - Este número revela como você deve realizar sua vocação na vida.`
        },

        psiquico: {
          titulo: "Número Psíquico",
          numero: result.psiquico,
          explicacao: "O número psíquico é baseado no dia de nascimento e revela a essência da personalidade, influenciando diretamente o comportamento e as características básicas da pessoa.",
          conteudo: getTextForNumber('psiquico', result.psiquico)?.body || `Psíquico ${result.psiquico} - Este número revela sua essência interior e padrões comportamentais naturais.`
        },

        anjoEspecial: {
          titulo: "Seu Anjo Cabalístico",
          nome: anjoEspecial,
          categoria: angelInfo?.category || "Anjo Protetor",
          explicacao: angelInfo?.domain_description || `Seu anjo protetor é ${anjoEspecial}, que oferece proteção e orientação espiritual específica para seu caminho de vida.`,
          invocacao1: angelInfo?.invocation_time_1 || "Consulte horários específicos",
          invocacao2: angelInfo?.invocation_time_2 || null,
          salmo: angelInfo?.psalm_reference || "Consulte referências cabalísticas",
          influenciaNegativa: angelInfo?.negative_influence || "Afasta energias contrárias ao desenvolvimento espiritual"
        },

        licoesCarmicas: {
          titulo: "Lições Cármicas",
          numeros: result.licoesCarmicas,
          explicacao: "As Lições Cármicas são números ausentes no nome completo e representam qualidades que devem ser desenvolvidas nesta vida.",
          licoes: result.licoesCarmicas.map(num => ({
            numero: num,
            licao: getTextForNumber('licao_carmica', num)?.body || `Lição Cármica ${num} - Desenvolver as qualidades relacionadas a este número.`
          }))
        },

        dividasCarmicas: {
          titulo: "Dívidas Cármicas",
          numeros: result.dividasCarmicas,
          explicacao: "As Dívidas Cármicas (13, 14, 16, 19) representam desafios específicos que devem ser superados nesta vida.",
          dividas: result.dividasCarmicas.map(num => ({
            numero: num,
            desafio: getTextForNumber('divida_carmica', num)?.body || `Dívida Cármica ${num} - Desafios específicos relacionados a vidas passadas.`
          }))
        },

        tendenciasOcultas: {
          titulo: "Tendências Ocultas",
          numeros: result.tendenciasOcultas,
          explicacao: "As Tendências Ocultas são talentos naturais inconscientes que se manifestam espontaneamente.",
          tendencias: result.tendenciasOcultas.map(num => ({
            numero: num,
            talento: getTextForNumber('tendencia_oculta', num)?.body || `Tendência Oculta ${num} - Talentos naturais que se manifestam automaticamente.`
          }))
        },

        respostaSubconsciente: {
          titulo: "Resposta Subconsciente",
          numero: result.respostaSubconsciente,
          explicacao: "A Resposta Subconsciente indica como você reage instintivamente em situações de crise.",
          conteudo: getTextForNumber('resposta_subconsciente', result.respostaSubconsciente)?.body || `Resposta Subconsciente ${result.respostaSubconsciente} - Sua reação automática em situações desafiadoras.`
        },

        ciclosVida: {
          titulo: "Ciclos de Vida",
          explicacao: "Os Ciclos de Vida dividem a existência em três fases principais, cada uma com suas características específicas.",
          primeiro: {
            numero: result.ciclosVida[0],
            periodo: "0-28 anos (aproximadamente)",
            fase: "Formação e Desenvolvimento",
            conteudo: getTextForNumber('ciclo_vida', result.ciclosVida[0])?.body || `Primeiro Ciclo ${result.ciclosVida[0]} - Fase de formação da personalidade e aprendizado básico.`
          },
          segundo: {
            numero: result.ciclosVida[1],
            periodo: "28-56 anos (aproximadamente)",
            fase: "Produtividade e Realização",
            conteudo: getTextForNumber('ciclo_vida', result.ciclosVida[1])?.body || `Segundo Ciclo ${result.ciclosVida[1]} - Fase de maior produtividade e construção do lugar no mundo.`
          },
          terceiro: {
            numero: result.ciclosVida[2],
            periodo: "56+ anos",
            fase: "Sabedoria e Transmissão",
            conteudo: getTextForNumber('ciclo_vida', result.ciclosVida[2])?.body || `Terceiro Ciclo ${result.ciclosVida[2]} - Fase de colheita e transmissão de conhecimento.`
          }
        },

        desafios: {
          titulo: "Desafios",
          explicacao: "Os Desafios representam os obstáculos principais que devem ser superados em diferentes fases da vida.",
          primeiro: {
            numero: result.desafios[0],
            conteudo: getTextForNumber('desafio', result.desafios[0])?.body || `Primeiro Desafio ${result.desafios[0]} - Obstáculos da juventude.`
          },
          segundo: {
            numero: result.desafios[1],
            conteudo: getTextForNumber('desafio', result.desafios[1])?.body || `Segundo Desafio ${result.desafios[1]} - Obstáculos da vida adulta.`
          },
          principal: {
            numero: result.desafios[2],
            conteudo: getTextForNumber('desafio', result.desafios[2])?.body || `Desafio Principal ${result.desafios[2]} - Obstáculo constante da vida.`
          }
        },

        momentosDecisivos: {
          titulo: "Momentos Decisivos",
          explicacao: "Os Momentos Decisivos indicam períodos importantes de mudança e oportunidade na vida.",
          momentos: result.momentos.map((momento, index) => ({
            numero: momento,
            ordem: index + 1,
            conteudo: getTextForNumber('momento_decisivo', momento)?.body || `Momento Decisivo ${momento} - Período de mudanças importantes.`
          }))
        },

        anoPessoal: {
          titulo: `Ano Pessoal ${anoPessoal} - ${anoReferencia}`,
          numero: anoPessoal,
          explicacao: "O Ano Pessoal indica as energias e oportunidades disponíveis durante este ano específico.",
          conteudo: getTextForNumber('ano_pessoal', anoPessoal)?.body || `Ano Pessoal ${anoPessoal} - Energias e oportunidades específicas deste ano.`
        },

        mesPessoal: {
          titulo: `Mês Pessoal ${mesPessoal}`,
          numero: mesPessoal,
          explicacao: "O Mês Pessoal indica as energias específicas do mês atual dentro do ano pessoal.",
          conteudo: getTextForNumber('mes_pessoal', mesPessoal)?.body || `Mês Pessoal ${mesPessoal} - Influências do mês atual.`
        }
      },

      // Informações complementares expandidas
      complementares: {
        cores: {
          titulo: "Cores Harmônicas",
          explicacao: "As cores que vibram em harmonia com seus números principais e trazem equilíbrio energético.",
          coresMotivacao: getTextForNumber('motivacao', result.motivacao)?.color_associations || [],
          coresExpressao: getTextForNumber('expressao', result.expressao)?.color_associations || [],
          coresDestino: getTextForNumber('destino', result.destino)?.color_associations || []
        },
        
        pedras: {
          titulo: "Pedras e Cristais",
          explicacao: "Pedras e cristais que amplificam e equilibram suas energias numerológicas.",
          pedrasMotivacao: getTextForNumber('motivacao', result.motivacao)?.stone_associations || [],
          pedrasExpressao: getTextForNumber('expressao', result.expressao)?.stone_associations || [],
          pedrasDestino: getTextForNumber('destino', result.destino)?.stone_associations || []
        },

        profissoes: {
          titulo: "Profissões Ideais",
          explicacao: "Atividades profissionais que estão em harmonia com seus talentos numerológicos.",
          profissoesExpressao: getTextForNumber('expressao', result.expressao)?.profession_associations || [],
          profissoesDestino: getTextForNumber('destino', result.destino)?.profession_associations || [],
          profissoesMissao: getTextForNumber('missao', result.missao)?.profession_associations || []
        },

        saude: {
          titulo: "Orientações de Saúde",
          explicacao: "Cuidados específicos com a saúde baseados em suas características numerológicas.",
          cuidadosExpressao: getTextForNumber('expressao', result.expressao)?.health_associations || [],
          cuidadosDestino: getTextForNumber('destino', result.destino)?.health_associations || []
        }
      },

      // Metadados para processamento
      metadados: {
        versaoConteudo: 'v3.0',
        totalTextos: texts.length,
        angeloEncontrado: !!angelInfo,
        calculosCompletos: true,
        dataProcessamento: new Date().toISOString()
      }
    };

    console.log('✅ Mapa numerológico completo gerado com sucesso');

    return new Response(JSON.stringify(mapaContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro na geração do mapa:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});