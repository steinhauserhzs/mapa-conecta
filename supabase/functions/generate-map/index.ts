import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---- Engine de cálculo numerológico (Jé Fêrraz) ----
const BASE_MAP = {
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

function letterValue(ch: string) {
  const info = analyzeChar(ch);
  if (!info) return null;
  const base = BASE_MAP[info.baseChar as keyof typeof BASE_MAP];
  if (!base) return null;
  return { ...info, base, value: applyMods(base, info.marks), raw: ch };
}

function sumLetters(str: string, filter = () => true) {
  let total = 0;
  const list: any[] = [];
  for (const ch of [...str]) {
    const lv = letterValue(ch);
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

function calcularBasico({ name, birth }: { name: string, birth: string }) {
  const nm = String(name || '').trim();
  const b = parseBirth(String(birth || '').trim());

  const all = sumLetters(nm);
  const vow = sumLetters(nm, (ch: string) => VOWELS.has(ch));
  const cons = sumLetters(nm, (ch: string) => !VOWELS.has(ch));

  const expressao = reduce(all.total);
  const motivacao = reduce(vow.total);
  const impressao = reduce(cons.total);
  let destino = 0;
  if (b) destino = reduce(sumBirth(b));

  return {
    expressao, motivacao, impressao, destino,
    debug: { somas: { todas: all.total, vogais: vow.total, consoantes: cons.total }, letras: all.list }
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

    // Cálculos básicos
    const base = calcularBasico({ name, birth });
    console.log('🧮 Números calculados:', base);

    // Cálculo do Ano Pessoal
    const ano = yearRef ?? new Date().getFullYear();
    const birthObj = parseBirth(birth);
    let anoPessoal = 1;
    
    if (birthObj) {
      const anoPessoalRaw = birthObj.d + birthObj.m + ano;
      anoPessoal = reduce(anoPessoalRaw);
    }
    console.log('📅 Ano pessoal calculado:', anoPessoal, 'para ano', ano);

    // Buscar textos oficiais
    const numbersToSearch = [base.motivacao, base.expressao, base.impressao, base.destino, anoPessoal];
    console.log('🔍 Buscando textos para números:', numbersToSearch);
    
    const { data: textos, error: textError } = await supabase
      .from('numerology_texts')
      .select('section, key_number, title, body')
      .in('section', ['motivacao', 'expressao', 'impressao', 'destino', 'ano_pessoal'])
      .in('key_number', numbersToSearch)
      .eq('lang', 'pt-BR');

    console.log('📚 Textos encontrados:', textos?.length || 0);
    if (textError) {
      console.error('❌ Erro ao buscar textos:', textError);
    }

    // Organizar textos por seção
    const textosMap = (textos || []).reduce((acc: any, texto: any) => {
      const key = `${texto.section}_${texto.key_number}`;
      acc[key] = texto;
      return acc;
    }, {});

    const resultado = {
      header: { 
        name, 
        birth, 
        anoReferencia: ano,
        dataGeracao: new Date().toISOString()
      },
      numeros: {
        expressao: base.expressao,
        motivacao: base.motivacao,
        impressao: base.impressao,
        destino: base.destino,
        ano_pessoal: anoPessoal
      },
      textos: {
        motivacao: textosMap[`motivacao_${base.motivacao}`] || { title: `Motivação ${base.motivacao}`, body: 'Texto não encontrado.' },
        expressao: textosMap[`expressao_${base.expressao}`] || { title: `Expressão ${base.expressao}`, body: 'Texto não encontrado.' },
        impressao: textosMap[`impressao_${base.impressao}`] || { title: `Impressão ${base.impressao}`, body: 'Texto não encontrado.' },
        destino: textosMap[`destino_${base.destino}`] || { title: `Destino ${base.destino}`, body: 'Texto não encontrado.' },
        ano_pessoal: textosMap[`ano_pessoal_${anoPessoal}`] || { title: `Ano Pessoal ${anoPessoal}`, body: 'Texto não encontrado.' }
      },
      debug: base.debug
    };

    console.log('✅ Mapa gerado com sucesso!', JSON.stringify(resultado, null, 2));

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Erro na geração do mapa:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});