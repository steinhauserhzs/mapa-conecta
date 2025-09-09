// Numerologia Cabalística – Jé Fêrraz (implementação oficial do projeto)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BASE_MAP = {
  A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
  J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
  S:3, T:4, U:6, V:6, W:6, X:6, Y:1, Z:7, 'Ç':8
};

// Vogais consideradas para "Motivação"
const VOWELS = new Set(['A','E','I','O','U','Y']);

// Números mestres preservados
const MASTER_NUMBERS = new Set([11, 22]);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ---- Utilidades de parsing de acentos/sinais ----
// Retorna { baseChar, marks: {apostrophe, circumflex, ring, tilde, diaeresis, grave} }
function analyzeChar(raw: string) {
  if (!raw) return null;

  // Quebra o caractere composto em NFD para checar diacríticos
  const nfd = raw.normalize('NFD');

  // Base: primeira letra A–Z/Ç detectada
  const match = nfd.toUpperCase().match(/[A-Z]|Ç/);
  if (!match) return null;
  const baseChar = match[0];

  // Flags de marcas
  const marks = {
    apostrophe: /['']/.test(raw),                // apóstrofo no texto
    circumflex: /[\u0302]/.test(nfd) || /[\^]/.test(raw),
    ring: /[\u030A]/.test(nfd) || /[\u02DA]/.test(nfd), // anel acima
    tilde: /[\u0303]/.test(nfd) || /[~]/.test(raw),     // til
    diaeresis: /[\u0308]/.test(nfd) || /[\u00A8]/.test(raw), // trema
    grave: /[\u0300]/.test(nfd) || /[`]/.test(raw)      // acento grave
  };

  return { baseChar, marks };
}

// Aplica os modificadores conforme a tabela do projeto
function applyModifiers(baseValue: number, marks: any) {
  let val = baseValue;

  if (marks.apostrophe) val += 2;       // '+2'
  if (marks.circumflex) val += 7;       // '^ +7'
  if (marks.ring)       val += 7;       // '˚ +7'
  if (marks.tilde)      val += 3;       // '~ +3'

  // multiplicadores por último
  if (marks.diaeresis)  val *= 2;       // '¨ x2'
  if (marks.grave)      val *= 2;       // '` x2'

  return val;
}

function letterValue(rawChar: string) {
  const info = analyzeChar(rawChar);
  if (!info) return null;
  const { baseChar, marks } = info;

  const base = BASE_MAP[baseChar as keyof typeof BASE_MAP];
  if (!base) return null; // ignora espaços, hífens, números etc.

  const final = applyModifiers(base, marks);
  return { char: rawChar, baseChar, base, marks, valor_final: final };
}

function sumLetters(str: string, filterFn = () => true) {
  const breakdown: any[] = [];
  let total = 0;

  for (const ch of [...str]) {
    const lv = letterValue(ch);
    if (!lv) continue;

    const upper = lv.baseChar.toUpperCase();
    if (filterFn(upper)) {
      total += lv.valor_final;
      breakdown.push(lv);
    }
  }
  return { total, breakdown };
}

// Redução numerológica com preservação de 11 e 22
function reduceNumber(n: number) {
  if (n <= 0) return 0;
  // preserva 11 e 22
  if (MASTER_NUMBERS.has(n)) return n;

  // reduz até 1–9 (exceto quando passar por 11/22)
  let x = n;
  while (x > 9 && !MASTER_NUMBERS.has(x)) {
    x = String(x).split('').reduce((a,d) => a + Number(d), 0);
    if (MASTER_NUMBERS.has(x)) return x;
  }
  return x;
}

// Data: aceita 'YYYY-MM-DD' ou 'DD/MM/YYYY'
function parseBirth(birth: string) {
  if (!birth) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
    const [y,m,d] = birth.split('-').map(Number);
    return { d, m, y };
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(birth)) {
    const [d,m,y] = birth.split('/').map(Number);
    return { d, m, y };
  }
  return null;
}

function sumBirth({d,m,y}: {d: number, m: number, y: number}) {
  const total = (String(d)+String(m)+String(y))
    .split('')
    .reduce((a,c)=>a+Number(c),0);
  return total;
}

// --- Cálculos principais ---
function computeNumerology({ name, birth }: { name: string, birth: string }) {
  const nameStr = String(name ?? '').trim();
  const birthObj = parseBirth(String(birth ?? '').trim());

  // SOMAS
  const all = sumLetters(nameStr, () => true);
  const vow = sumLetters(nameStr, (ch: string) => VOWELS.has(ch));
  const cons = sumLetters(nameStr, (ch: string) => !VOWELS.has(ch));

  // REDUÇÕES
  const expressao = reduceNumber(all.total);
  const motivacao = reduceNumber(vow.total);
  const impressao = reduceNumber(cons.total);

  let destino = 0;
  if (birthObj) {
    const raw = sumBirth(birthObj);
    destino = reduceNumber(raw);
  }

  return {
    expressao,
    motivacao,
    impressao,
    destino,
    detalhado: {
      letras: all.breakdown,
      somas: {
        todas: all.total,
        vogais: vow.total,
        consoantes: cons.total
      }
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, birth } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ error: "Nome é obrigatório" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const result = computeNumerology({ name, birth });
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro no cálculo:', error);
    return new Response(
      JSON.stringify({ error: "Erro interno no cálculo" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});