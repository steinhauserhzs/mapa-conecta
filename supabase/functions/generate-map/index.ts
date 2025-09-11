import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---- Engine de cálculo numerológico (Jé Fêrraz) ----
// Fallback BASE_MAP - will be replaced by database conversion table
const FALLBACK_BASE_MAP = {
  A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
  J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
  S:3, T:4, U:6, V:6, W:6, X:6, Y:1, Z:7, 'Ç':8
};
const VOWELS = new Set(['A','E','I','O','U','Y']);
const MASTER = new Set([11,22]);

function analyzeChar(raw: string) {
  if (!raw) return null;
  const nfd = raw.normalize('NFD');
  const m = nfd.toUpperCase().match(/[A-Z]|Ç/);
  if (!m) return null;
  const baseChar = m[0];
  return {
    baseChar,
    marks: {
      apostrophe: /['']/.test(raw),
      circumflex: /[\u0302]|\^/.test(nfd),
      ring: /[\u030A]|\u02DA/.test(nfd),
      tilde: /[\u0303]|~/.test(nfd),
      diaeresis: /[\u0308]|\u00A8/.test(nfd),
      grave: /[\u0300]|`/.test(nfd)
    }
  };
}

function applyMods(v: number, m: any) {
  let val = v;
  if (m.apostrophe) val += 2;
  if (m.circumflex) val += 7;
  if (m.ring) val += 7;
  if (m.tilde) val += 3;
  if (m.diaeresis) val *= 2;
  if (m.grave) val *= 2;
  return val;
}

function letterValue(raw: string, baseMap: Record<string, number>) {
  const analyzed = analyzeChar(raw);
  if (!analyzed) return null;
  const base = baseMap[analyzed.baseChar];
  if (base === undefined) return null;
  const value = applyMods(base, analyzed.marks);
  return { baseChar: analyzed.baseChar, marks: analyzed.marks, base, value, raw };
}

function sumLetters(str: string, baseMap: Record<string, number>, filter = () => true) {
  let total = 0;
  const list: any[] = [];
  for (const ch of [...str]) {
    const lv = letterValue(ch, baseMap);
    if (!lv) continue;
    if (typeof filter === 'function' ? filter(lv.baseChar) : true) {
      total += lv.value;
      list.push(lv);
    }
  }
  return { total, list };
}

function reduce(n: number): number {
  if (n <= 0) return 0;
  if (MASTER.has(n)) return n;
  while (n > 9 && !MASTER.has(n)) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
    if (MASTER.has(n)) return n;
  }
  return n;
}

function parseBirth(b: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(b)) { 
    const [y, m, d] = b.split('-').map(Number); 
    return { d, m, y }; 
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(b)) { 
    const [d, m, y] = b.split('/').map(Number); 
    return { d, m, y }; 
  }
  return null;
}

function sumBirth({ d, m, y }: { d: number, m: number, y: number }) { 
  return (String(d) + String(m) + String(y)).split('').reduce((a, c) => a + Number(c), 0); 
}

// Função para calcular Lições Cármicas (números 1-9 ausentes no nome)
function calcularLicoesCarmicas(name: string, baseMap: Record<string, number>): number[] {
  const numerosPresentes = new Set<number>();
  
  for (const ch of [...name.toUpperCase()]) {
    const lv = letterValue(ch, baseMap);
    if (lv && lv.base >= 1 && lv.base <= 9) {
      numerosPresentes.add(lv.base);
    }
  }
  
  const licoesCarmicas: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!numerosPresentes.has(i)) {
      licoesCarmicas.push(i);
    }
  }
  
  return licoesCarmicas;
}

// Função para calcular Dívidas Cármicas (13,14,16,19 antes da redução)
function calcularDividasCarmicas(name: string, birth: string, baseMap: Record<string, number>): number[] {
  const nm = String(name || '').trim();
  const b = parseBirth(String(birth || '').trim());
  if (!b) return [];

  const all = sumLetters(nm, baseMap);
  const vow = sumLetters(nm, baseMap, (ch: string) => VOWELS.has(ch));
  const cons = sumLetters(nm, baseMap, (ch: string) => !VOWELS.has(ch));
  const nascimento = sumBirth(b);

  const numerosDivida = [13, 14, 16, 19];
  const dividasCarmicas: number[] = [];

  // Verificar se algum dos totais antes da redução é uma dívida cármica
  [all.total, vow.total, cons.total, nascimento].forEach(total => {
    if (numerosDivida.includes(total)) {
      dividasCarmicas.push(total);
    }
  });

  return [...new Set(dividasCarmicas)]; // Remove duplicatas
}

// Função para calcular Tendências Ocultas (frequência de cada dígito)
function calcularTendenciasOcultas(name: string, baseMap: Record<string, number>): Record<number, number> {
  const frequencias: Record<number, number> = {};
  
  for (const ch of [...name.toUpperCase()]) {
    const lv = letterValue(ch, baseMap);
    if (lv && lv.base >= 1 && lv.base <= 9) {
      frequencias[lv.base] = (frequencias[lv.base] || 0) + 1;
    }
  }
  
  return frequencias;
}

// Função para calcular Resposta Subconsciente (9 menos números ausentes)
function calcularRespostaSubconsciente(licoesCarmicas: number[]): number {
  return 9 - licoesCarmicas.length;
}

// Função para calcular Ciclos de Vida (3 ciclos baseados em mês, dia, ano)
function calcularCiclosVida(birth: string): { primeiro: number, segundo: number, terceiro: number } {
  const b = parseBirth(birth);
  if (!b) return { primeiro: 0, segundo: 0, terceiro: 0 };

  return {
    primeiro: reduce(b.m),    // Mês de nascimento
    segundo: reduce(b.d),     // Dia de nascimento  
    terceiro: reduce(b.y)     // Ano de nascimento
  };
}

// Função para calcular Desafios (4 tipos de desafios)
function calcularDesafios(birth: string): { primeiro: number, segundo: number, terceiro: number, quarto: number } {
  const b = parseBirth(birth);
  if (!b) return { primeiro: 0, segundo: 0, terceiro: 0, quarto: 0 };

  const mes = reduce(b.m);
  const dia = reduce(b.d);
  const ano = reduce(b.y);

  return {
    primeiro: Math.abs(dia - mes),
    segundo: Math.abs(ano - dia),
    terceiro: Math.abs(mes - ano),
    quarto: Math.abs(Math.abs(dia - mes) - Math.abs(ano - dia))
  };
}

// Função para calcular Momentos Decisivos (4 momentos)
function calcularMomentos(birth: string, destino: number): { primeiro: number, segundo: number, terceiro: number, quarto: number } {
  const b = parseBirth(birth);
  if (!b) return { primeiro: 0, segundo: 0, terceiro: 0, quarto: 0 };

  const mes = reduce(b.m);
  const dia = reduce(b.d);
  const ano = reduce(b.y);

  return {
    primeiro: reduce(mes + dia),
    segundo: reduce(dia + ano),
    terceiro: reduce(mes + ano),
    quarto: reduce(mes + dia + ano + destino)
  };
}

// Função para calcular Mês e Dia Pessoal
function calcularMesDiaPersonal(anoPessoal: number, mesAtual?: number, diaAtual?: number): { mes_pessoal?: number, dia_pessoal?: number } {
  const resultado: { mes_pessoal?: number, dia_pessoal?: number } = {};
  
  if (mesAtual) {
    resultado.mes_pessoal = reduce(anoPessoal + mesAtual);
    
    if (diaAtual) {
      resultado.dia_pessoal = reduce(resultado.mes_pessoal + diaAtual);
    }
  }
  
  return resultado;
}

function calcularCompleto({ name, birth }: { name: string, birth: string }, baseMap: Record<string, number>) {
  const nm = String(name || '').trim();
  const b = parseBirth(String(birth || '').trim());

  if (!b) {
    throw new Error("Data de nascimento inválida");
  }

  const all = sumLetters(nm, baseMap);
  const vow = sumLetters(nm, baseMap, (ch: string) => VOWELS.has(ch));
  const cons = sumLetters(nm, baseMap, (ch: string) => !VOWELS.has(ch));

  // Números básicos
  const expressao = reduce(all.total);
  const motivacao = reduce(vow.total);
  const impressao = reduce(cons.total);
  const destino = reduce(sumBirth(b));
  
  // Número Psíquico (dia do nascimento reduzido)
  const numero_psiquico = reduce(b.d);
  
  // Dia do Nascimento (natural)
  const dia_nascimento_natural = b.d;
  const dia_nascimento_reduzido = reduce(b.d);
  
  // Grau de Ascensão (soma de expressão + destino)
  const grau_ascensao = reduce(expressao + destino);

  // Cálculos avançados
  const licoes_carmicas = calcularLicoesCarmicas(nm, baseMap);
  const dividas_carmicas = calcularDividasCarmicas(nm, birth, baseMap);
  const tendencias_ocultas = calcularTendenciasOcultas(nm, baseMap);
  const resposta_subconsciente = calcularRespostaSubconsciente(licoes_carmicas);
  const ciclos_vida = calcularCiclosVida(birth);
  const desafios = calcularDesafios(birth);
  const momentos = calcularMomentos(birth, destino);

  // Missão (soma de expressão + destino, alguns sistemas usam diferentes fórmulas)
  const missao = reduce(expressao + destino);

  return {
    expressao, motivacao, impressao, destino, missao,
    numero_psiquico, dia_nascimento_natural, dia_nascimento_reduzido, grau_ascensao,
    licoes_carmicas, dividas_carmicas, tendencias_ocultas, resposta_subconsciente,
    ciclos_vida, desafios, momentos,
    debug: { 
      somas: { todas: all.total, vogais: vow.total, consoantes: cons.total }, 
      letras: all.list,
      nascimento: b
    }
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando geração do mapa...');
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { name, birth, yearRef } = await req.json();
    console.log('📊 Dados recebidos:', { name, birth, yearRef });

    if (!name || !birth) {
      throw new Error("Nome e data de nascimento são obrigatórios");
    }

    // Buscar tabela de conversão do banco
    console.log('🔍 Buscando tabela de conversão...');
    const { data: conversionTables, error: convError } = await supabase
      .from('conversion_tables')
      .select('mapping')
      .eq('is_default', true)
      .eq('locale', 'pt-BR')
      .limit(1);

    let baseMap = FALLBACK_BASE_MAP;
    if (conversionTables && conversionTables.length > 0) {
      baseMap = conversionTables[0].mapping as Record<string, number>;
      console.log('✅ Tabela de conversão carregada do banco');
    } else {
      console.log('⚠️ Usando tabela de conversão padrão (fallback)');
    }

    // Cálculos completos
    const numeros = calcularCompleto({ name, birth }, baseMap);
    console.log('🧮 Números calculados:', numeros);

    // Cálculo do Ano Pessoal (Jé Fêrraz: ano_pessoal = reduce(soma_dígitos(ano_ref) + destino))
    const ano = yearRef ?? new Date().getFullYear();
    const birthObj = parseBirth(birth);
    if (!birthObj) {
      throw new Error("Data de nascimento inválida");
    }
    
    // Soma dos dígitos do ano de referência
    const anoDigitos = String(ano).split('').reduce((a, d) => a + Number(d), 0);
    const anoPessoal = reduce(anoDigitos + numeros.destino);
    
    // Calcular Mês e Dia Pessoal para o momento atual
    const agora = new Date();
    const mesDiaPersonal = calcularMesDiaPersonal(anoPessoal, agora.getMonth() + 1, agora.getDate());
    
    console.log('📅 Ano pessoal calculado:', anoPessoal, 'para ano', ano, '(dígitos ano:', anoDigitos, '+ destino:', numeros.destino, ')');
    console.log('📅 Mês/Dia pessoal:', mesDiaPersonal);

    // Definir seções e números para buscar
    const secoes = [
      'motivacao', 'expressao', 'impressao', 'destino', 'missao', 'ano_pessoal', 'mes_pessoal', 'dia_pessoal',
      'Número Psíquico', 'Dia do Nascimento', 'Grau de Ascensão',
      'Lições Cármicas', 'Dívidas Cármicas', 'Tendências Ocultas', 'Resposta Subconsciente',
      'Ciclos de Vida', 'Desafios', 'Momentos Decisivos',
      'Cores Favoráveis', 'Dias do Mês Favoráveis'
    ];

    const numerosCompletos = {
      ...numeros,
      ano_pessoal: anoPessoal,
      ...mesDiaPersonal
    };

    console.log('🔍 Buscando textos para todas as seções...');
    const { data: todosTextos, error: textError } = await supabase
      .from('numerology_texts')
      .select('section, key_number, title, body')
      .eq('lang', 'pt-BR');

    console.log('📚 Total de textos encontrados:', todosTextos?.length || 0);
    if (textError) {
      console.error('❌ Erro ao buscar textos:', textError);
    }

    // Organizar textos por seção e número
    const textosMap = (todosTextos || []).reduce((acc: any, texto: any) => {
      const key = `${texto.section}_${texto.key_number}`;
      acc[key] = texto;
      return acc;
    }, {});

    // Criar textos dinâmicos baseados nos números calculados
    const textosDinamicos: any = {};
    
    // Seções básicas numerológicas
    textosDinamicos.motivacao = textosMap[`motivacao_${numeros.motivacao}`] || 
      { title: `Motivação ${numeros.motivacao}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.expressao = textosMap[`expressao_${numeros.expressao}`] || 
      { title: `Expressão ${numeros.expressao}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.impressao = textosMap[`impressao_${numeros.impressao}`] || 
      { title: `Impressão ${numeros.impressao}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.destino = textosMap[`destino_${numeros.destino}`] || 
      { title: `Destino ${numeros.destino}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.missao = textosMap[`missao_${numeros.missao}`] || 
      { title: `Missão ${numeros.missao}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.ano_pessoal = textosMap[`ano_pessoal_${anoPessoal}`] || 
      { title: `Ano Pessoal ${anoPessoal}`, body: 'Conteúdo em desenvolvimento.' };

    // Mês e Dia Pessoal (se calculados)
    if (mesDiaPersonal.mes_pessoal) {
      textosDinamicos.mes_pessoal = textosMap[`mes_pessoal_${mesDiaPersonal.mes_pessoal}`] || 
        { title: `Mês Pessoal ${mesDiaPersonal.mes_pessoal}`, body: 'Conteúdo em desenvolvimento.' };
    }
    
    if (mesDiaPersonal.dia_pessoal) {
      textosDinamicos.dia_pessoal = textosMap[`dia_pessoal_${mesDiaPersonal.dia_pessoal}`] || 
        { title: `Dia Pessoal ${mesDiaPersonal.dia_pessoal}`, body: 'Conteúdo em desenvolvimento.' };
    }

    // Seções adicionais
    textosDinamicos.numero_psiquico = textosMap[`Número Psíquico_${numeros.numero_psiquico}`] || 
      { title: `Número Psíquico ${numeros.numero_psiquico}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.dia_nascimento = textosMap[`Dia do Nascimento_${numeros.dia_nascimento_natural}`] || 
      { title: `Dia do Nascimento ${numeros.dia_nascimento_natural}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.grau_ascensao = textosMap[`Grau de Ascensão_${numeros.grau_ascensao}`] || 
      { title: `Grau de Ascensão ${numeros.grau_ascensao}`, body: 'Conteúdo em desenvolvimento.' };

    // Lições Cármicas (array de números ausentes)
    if (numeros.licoes_carmicas && numeros.licoes_carmicas.length > 0) {
      textosDinamicos.licoes_carmicas = {
        title: `Lições Cármicas: ${numeros.licoes_carmicas.join(', ')}`,
        body: numeros.licoes_carmicas.map(num => 
          textosMap[`Lições Cármicas_${num}`]?.body || `Lição Cármica ${num}: Conteúdo em desenvolvimento.`
        ).join('\n\n')
      };
    } else {
      textosDinamicos.licoes_carmicas = {
        title: 'Lições Cármicas: Nenhuma',
        body: 'Você não possui Lições Cármicas pendentes nesta vida.'
      };
    }

    // Dívidas Cármicas (array de números de dívida)
    if (numeros.dividas_carmicas && numeros.dividas_carmicas.length > 0) {
      textosDinamicos.dividas_carmicas = {
        title: `Dívidas Cármicas: ${numeros.dividas_carmicas.join(', ')}`,
        body: numeros.dividas_carmicas.map(num => 
          textosMap[`Dívidas Cármicas_${num}`]?.body || `Dívida Cármica ${num}: Conteúdo em desenvolvimento.`
        ).join('\n\n')
      };
    } else {
      textosDinamicos.dividas_carmicas = {
        title: 'Dívidas Cármicas: Nenhuma',
        body: 'Você não possui Dívidas Cármicas a serem resgatadas nesta vida.'
      };
    }

    // Tendências Ocultas (frequência de números)
    const tendenciasTexto = Object.entries(numeros.tendencias_ocultas || {})
      .map(([num, freq]) => `${num}: ${freq}x`)
      .join(', ');
    textosDinamicos.tendencias_ocultas = {
      title: 'Tendências Ocultas',
      body: `Frequência dos números no seu nome: ${tendenciasTexto || 'Nenhuma tendência significativa detectada.'}`
    };

    // Resposta Subconsciente
    textosDinamicos.resposta_subconsciente = textosMap[`Resposta Subconsciente_${numeros.resposta_subconsciente}`] || 
      { title: `Resposta Subconsciente ${numeros.resposta_subconsciente}`, body: 'Conteúdo em desenvolvimento.' };

    // Ciclos de Vida
    textosDinamicos.ciclos_vida = {
      title: 'Ciclos de Vida',
      body: `
        **Primeiro Ciclo (0-28 anos):** ${numeros.ciclos_vida?.primeiro || 'N/A'} - ${textosMap[`Ciclos de Vida_${numeros.ciclos_vida?.primeiro}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Segundo Ciclo (29-56 anos):** ${numeros.ciclos_vida?.segundo || 'N/A'} - ${textosMap[`Ciclos de Vida_${numeros.ciclos_vida?.segundo}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Terceiro Ciclo (57+ anos):** ${numeros.ciclos_vida?.terceiro || 'N/A'} - ${textosMap[`Ciclos de Vida_${numeros.ciclos_vida?.terceiro}`]?.body || 'Conteúdo em desenvolvimento.'}
      `.trim()
    };

    // Desafios
    textosDinamicos.desafios = {
      title: 'Desafios',
      body: `
        **Primeiro Desafio:** ${numeros.desafios?.primeiro || 'N/A'} - ${textosMap[`Desafios_${numeros.desafios?.primeiro}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Segundo Desafio:** ${numeros.desafios?.segundo || 'N/A'} - ${textosMap[`Desafios_${numeros.desafios?.segundo}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Terceiro Desafio:** ${numeros.desafios?.terceiro || 'N/A'} - ${textosMap[`Desafios_${numeros.desafios?.terceiro}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Quarto Desafio:** ${numeros.desafios?.quarto || 'N/A'} - ${textosMap[`Desafios_${numeros.desafios?.quarto}`]?.body || 'Conteúdo em desenvolvimento.'}
      `.trim()
    };

    // Momentos Decisivos
    textosDinamicos.momentos_decisivos = {
      title: 'Momentos Decisivos',
      body: `
        **Primeiro Momento:** ${numeros.momentos?.primeiro || 'N/A'} - ${textosMap[`Momentos Decisivos_${numeros.momentos?.primeiro}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Segundo Momento:** ${numeros.momentos?.segundo || 'N/A'} - ${textosMap[`Momentos Decisivos_${numeros.momentos?.segundo}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Terceiro Momento:** ${numeros.momentos?.terceiro || 'N/A'} - ${textosMap[`Momentos Decisivos_${numeros.momentos?.terceiro}`]?.body || 'Conteúdo em desenvolvimento.'}
        
        **Quarto Momento:** ${numeros.momentos?.quarto || 'N/A'} - ${textosMap[`Momentos Decisivos_${numeros.momentos?.quarto}`]?.body || 'Conteúdo em desenvolvimento.'}
      `.trim()
    };

    // Seções especiais (buscar o primeiro disponível se não tiver número específico)
    textosDinamicos.cores_favoraveis = textosMap[`Cores Favoráveis_${numeros.destino}`] || 
      (todosTextos || []).find(t => t.section === 'Cores Favoráveis') || 
      { title: 'Cores Favoráveis', body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.dias_favoraveis = textosMap[`Dias do Mês Favoráveis_${numeros.destino}`] || 
      (todosTextos || []).find(t => t.section === 'Dias do Mês Favoráveis') || 
      { title: 'Dias do Mês Favoráveis', body: 'Conteúdo em desenvolvimento.' };

    const resultado = {
      header: { 
        name, 
        birth, 
        anoReferencia: ano,
        dataGeracao: new Date().toISOString()
      },
      numeros: numerosCompletos,
      textos: textosDinamicos,
      debug: numeros.debug
    };

    console.log('✅ Mapa completo gerado com sucesso!');
    console.log('📋 Seções incluídas:', Object.keys(textosDinamicos));

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('💥 Erro na geração do mapa:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});