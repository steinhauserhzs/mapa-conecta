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

function letterValue(ch: string, baseMap: Record<string, number>) {
  const info = analyzeChar(ch);
  if (!info) return null;
  const base = baseMap[info.baseChar as keyof typeof baseMap];
  if (!base) return null;
  return { ...info, base, value: base, raw: ch };
}

function sumLetters(str: string, baseMap: Record<string, number>, filter = () => true) {
  let total = 0;
  const list: any[] = [];
  for (const ch of [...str]) {
    const lv = letterValue(ch, baseMap);
    if (!lv) continue;
    if (filter(lv.baseChar)) { 
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

  return {
    expressao, motivacao, impressao, destino,
    numero_psiquico, dia_nascimento_natural, dia_nascimento_reduzido, grau_ascensao,
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

    // Cálculo do Ano Pessoal
    const ano = yearRef ?? new Date().getFullYear();
    const birthObj = parseBirth(birth);
    if (!birthObj) {
      throw new Error("Data de nascimento inválida");
    }
    
    const anoPessoalRaw = birthObj.d + birthObj.m + ano;
    const anoPessoal = reduce(anoPessoalRaw);
    console.log('📅 Ano pessoal calculado:', anoPessoal, 'para ano', ano);

    // Definir seções e números para buscar
    const secoes = [
      'motivacao', 'expressao', 'impressao', 'destino', 'ano_pessoal',
      'Número Psíquico', 'Dia do Nascimento', 'Grau de Ascensão',
      'Cores Favoráveis', 'Dias do Mês Favoráveis'
    ];

    const numerosCompletos = {
      ...numeros,
      ano_pessoal: anoPessoal
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
    
    textosDinamicos.ano_pessoal = textosMap[`ano_pessoal_${anoPessoal}`] || 
      { title: `Ano Pessoal ${anoPessoal}`, body: 'Conteúdo em desenvolvimento.' };

    // Seções adicionais
    textosDinamicos.numero_psiquico = textosMap[`Número Psíquico_${numeros.numero_psiquico}`] || 
      { title: `Número Psíquico ${numeros.numero_psiquico}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.dia_nascimento = textosMap[`Dia do Nascimento_${numeros.dia_nascimento_natural}`] || 
      { title: `Dia do Nascimento ${numeros.dia_nascimento_natural}`, body: 'Conteúdo em desenvolvimento.' };
    
    textosDinamicos.grau_ascensao = textosMap[`Grau de Ascensão_${numeros.grau_ascensao}`] || 
      { title: `Grau de Ascensão ${numeros.grau_ascensao}`, body: 'Conteúdo em desenvolvimento.' };

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