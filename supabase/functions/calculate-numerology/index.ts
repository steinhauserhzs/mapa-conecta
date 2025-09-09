import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CALCULATE-NUMEROLOGY] ${step}${detailsStr}`);
};

interface ConversionTable {
  mapping: Record<string, number>;
  normalization_rules: {
    remove_accents: boolean;
    normalize_spaces: boolean;
    uppercase: boolean;
    vowels: string[];
    consonants: string[];
  };
}

interface CalculationRules {
  masters: number[];
  karmic_debts: number[];
  reduction_type: 'cabalistic' | 'pythagorean';
  include_yod: boolean;
  preserve_masters_in_reduction: boolean;
  karmic_detection_mode: string;
}

interface NumerologyInput {
  birth_name?: string;
  birth_date?: string;
  birth_place?: string;
  business_name?: string;
  business_opening_date?: string;
  phone_number?: string;
  address?: string;
  license_plate?: string;
  person1?: any;
  person2?: any;
  signature_options?: string[];
}

interface NumerologyResult {
  core_numbers: any;
  cycles: any;
  inclusion_table: any;
  planes: any;
  karmic_debts: any;
  signature_scores?: any;
  compatibility?: any;
  explanations: any;
  phone_analysis?: any;
  address_analysis?: any;
  license_plate_analysis?: any;
}

// Normalize name according to rules
function normalizeName(name: string, rules: ConversionTable['normalization_rules']): string {
  let normalized = name;
  
  if (rules.normalize_spaces) {
    normalized = normalized.replace(/\s+/g, ' ').trim();
  }
  
  if (rules.uppercase) {
    normalized = normalized.toUpperCase();
  }
  
  return normalized;
}

// Convert letters to numbers using conversion table
function convertToNumbers(text: string, mapping: Record<string, number>): number[] {
  const numbers: number[] = [];
  for (const char of text) {
    if (mapping[char] !== undefined) {
      numbers.push(mapping[char]);
    }
  }
  return numbers;
}

// Reduce number according to rules
function reduceNumber(num: number, rules: CalculationRules): number {
  const masters = rules.masters || [11, 22, 33];
  const karmicDebts = rules.karmic_debts || [13, 14, 16, 19];
  
  // Check if it's a master number
  if (masters.includes(num) && rules.preserve_masters_in_reduction) {
    return num;
  }
  
  // Check if it's a karmic debt number
  if (karmicDebts.includes(num)) {
    return num;
  }
  
  // Reduce to single digit
  while (num > 9) {
    const digits = num.toString().split('').map(d => parseInt(d));
    num = digits.reduce((sum, digit) => sum + digit, 0);
    
    // Check again for masters and karmic debts after reduction
    if (masters.includes(num) && rules.preserve_masters_in_reduction) {
      return num;
    }
    if (karmicDebts.includes(num)) {
      return num;
    }
  }
  
  return num;
}

// Separate vowels and consonants
function separateVowelsConsonants(text: string, rules: ConversionTable['normalization_rules']) {
  const vowels: string[] = [];
  const consonants: string[] = [];
  
  for (const char of text) {
    if (char === ' ') continue;
    
    if (rules.vowels.includes(char)) {
      vowels.push(char);
    } else if (rules.consonants.includes(char)) {
      consonants.push(char);
    }
  }
  
  return { vowels: vowels.join(''), consonants: consonants.join('') };
}

// Calculate birth date numbers
function calculateBirthNumbers(birthDate: string, rules: CalculationRules) {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const dayReduced = reduceNumber(day, rules);
  const monthReduced = reduceNumber(month, rules);
  const yearReduced = reduceNumber(year, rules);
  
  const destiny = reduceNumber(day + month + year, rules);
  
  return {
    day: dayReduced,
    month: monthReduced,
    year: yearReduced,
    destiny,
    full_date: `${day}/${month}/${year}`
  };
}

// Calculate cycles and pinnacles
function calculateCycles(birthDate: string, rules: CalculationRules) {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Life cycles (simplified calculation)
  const cycle1 = reduceNumber(month, rules);
  const cycle2 = reduceNumber(day, rules);
  const cycle3 = reduceNumber(year, rules);
  
  // Pinnacles (simplified calculation)
  const pinnacle1 = reduceNumber(month + day, rules);
  const pinnacle2 = reduceNumber(day + year, rules);
  const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2, rules);
  const pinnacle4 = reduceNumber(month + year, rules);
  
  // Challenges
  const challenge1 = Math.abs(month - day);
  const challenge2 = Math.abs(day - year);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(month - year);
  
  return {
    cycles: {
      first: cycle1,
      second: cycle2,
      third: cycle3
    },
    pinnacles: {
      first: pinnacle1,
      second: pinnacle2,
      third: pinnacle3,
      fourth: pinnacle4
    },
    challenges: {
      first: challenge1,
      second: challenge2,
      third: challenge3,
      fourth: challenge4
    }
  };
}

// Calculate inclusion table
function calculateInclusionTable(name: string, mapping: Record<string, number>) {
  const frequency: Record<number, number> = {};
  
  for (const char of name) {
    if (mapping[char] !== undefined) {
      const num = mapping[char];
      frequency[num] = (frequency[num] || 0) + 1;
    }
  }
  
  // Find missing numbers
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!frequency[i]) {
      missing.push(i);
    }
  }
  
  return {
    frequency,
    missing_numbers: missing
  };
}

// Calculate expression planes
function calculateExpressionPlanes(name: string, mapping: Record<string, number>) {
  const planes = {
    physical: 0,    // 4, 5
    mental: 0,      // 1, 8  
    emotional: 0,   // 2, 3, 6
    intuitive: 0    // 7, 9
  };
  
  for (const char of name) {
    if (mapping[char] !== undefined) {
      const num = mapping[char];
      
      if ([4, 5].includes(num)) planes.physical++;
      else if ([1, 8].includes(num)) planes.mental++;
      else if ([2, 3, 6].includes(num)) planes.emotional++;
      else if ([7, 9].includes(num)) planes.intuitive++;
    }
  }
  
  return planes;
}

// Main calculation function
async function calculateNumerology(
  input: NumerologyInput,
  conversionTable: ConversionTable,
  calculationRules: CalculationRules
): Promise<NumerologyResult> {
  
  logStep("Starting numerology calculation", { inputKeys: Object.keys(input) });
  
  const result: NumerologyResult = {
    core_numbers: {},
    cycles: {},
    inclusion_table: {},
    planes: {},
    karmic_debts: [],
    explanations: {}
  };
  
  // Personal/Business name calculations
  if (input.birth_name || input.business_name) {
    const name = input.birth_name || input.business_name || '';
    const normalizedName = normalizeName(name, conversionTable.normalization_rules);
    
    logStep("Processing name", { original: name, normalized: normalizedName });
    
    // Separate vowels and consonants
    const { vowels, consonants } = separateVowelsConsonants(normalizedName, conversionTable.normalization_rules);
    
    // Convert to numbers
    const allNumbers = convertToNumbers(normalizedName, conversionTable.mapping);
    const vowelNumbers = convertToNumbers(vowels, conversionTable.mapping);
    const consonantNumbers = convertToNumbers(consonants, conversionTable.mapping);
    
    // Calculate core numbers
    const expressionSum = allNumbers.reduce((sum, num) => sum + num, 0);
    const soulSum = vowelNumbers.reduce((sum, num) => sum + num, 0);
    const personalitySum = consonantNumbers.reduce((sum, num) => sum + num, 0);
    
    result.core_numbers.expression = reduceNumber(expressionSum, calculationRules);
    result.core_numbers.soul = reduceNumber(soulSum, calculationRules);
    result.core_numbers.personality = reduceNumber(personalitySum, calculationRules);
    
    // Calculate inclusion table
    result.inclusion_table = calculateInclusionTable(normalizedName, conversionTable.mapping);
    
    // Calculate expression planes
    result.planes = calculateExpressionPlanes(normalizedName, conversionTable.mapping);
    
    logStep("Core numbers calculated", result.core_numbers);
  }
  
  // Birth date calculations
  if (input.birth_date || input.business_opening_date) {
    const date = input.birth_date || input.business_opening_date || '';
    const birthNumbers = calculateBirthNumbers(date, calculationRules);
    
    result.core_numbers.destiny = birthNumbers.destiny;
    result.core_numbers.birth_day = birthNumbers.day;
    result.core_numbers.birth_month = birthNumbers.month;
    result.core_numbers.birth_year = birthNumbers.year;
    
    // Calculate maturity number
    if (result.core_numbers.expression && result.core_numbers.destiny) {
      result.core_numbers.maturity = reduceNumber(
        result.core_numbers.expression + result.core_numbers.destiny,
        calculationRules
      );
    }
    
    // Calculate cycles and pinnacles
    result.cycles = calculateCycles(date, calculationRules);
    
    logStep("Birth date numbers calculated", { birthNumbers, cycles: result.cycles });
  }
  
  // Phone number analysis
  if (input.phone_number) {
    const phoneNumbers = convertToNumbers(input.phone_number.replace(/\D/g, ''), {
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
    });
    const phoneSum = phoneNumbers.reduce((sum, num) => sum + num, 0);
    result.phone_analysis = {
      vibration: reduceNumber(phoneSum, calculationRules),
      interpretation: getPhoneInterpretation(reduceNumber(phoneSum, calculationRules))
    };
  }
  
  // Address analysis
  if (input.address) {
    const addressNumbers = convertToNumbers(input.address.toUpperCase(), conversionTable.mapping);
    const addressSum = addressNumbers.reduce((sum, num) => sum + num, 0);
    result.address_analysis = {
      vibration: reduceNumber(addressSum, calculationRules),
      interpretation: getAddressInterpretation(reduceNumber(addressSum, calculationRules))
    };
  }
  
  // License plate analysis
  if (input.license_plate) {
    const plateText = input.license_plate.toUpperCase().replace(/\s/g, '');
    const plateNumbers = convertToNumbers(plateText, {
      ...conversionTable.mapping,
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
    });
    const plateSum = plateNumbers.reduce((sum, num) => sum + num, 0);
    result.license_plate_analysis = {
      vibration: reduceNumber(plateSum, calculationRules),
      interpretation: getLicensePlateInterpretation(reduceNumber(plateSum, calculationRules))
    };
  }
  
  // Detect karmic debts
  result.karmic_debts = detectKarmicDebts(result, calculationRules);
  
  // Add explanations
  result.explanations = generateExplanations(result);
  
  logStep("Numerology calculation completed", { resultKeys: Object.keys(result) });
  
  return result;
}

function detectKarmicDebts(result: NumerologyResult, rules: CalculationRules): any[] {
  const karmicDebts: any[] = [];
  const karmicNumbers = rules.karmic_debts || [13, 14, 16, 19];
  
  // Check core numbers for karmic debts
  Object.entries(result.core_numbers).forEach(([key, value]) => {
    if (typeof value === 'number' && karmicNumbers.includes(value)) {
      karmicDebts.push({
        number: value,
        position: key,
        meaning: getKarmicDebtMeaning(value)
      });
    }
  });
  
  return karmicDebts;
}

function getKarmicDebtMeaning(number: number): string {
  const meanings: Record<number, string> = {
    13: "Disciplina e trabalho duro são necessários para superar a preguiça passada.",
    14: "Moderação e autocontrole são essenciais para superar excessos passados.",
    16: "Humildade e reconstrução são necessárias após quedas do ego.",
    19: "Independência equilibrada é necessária para superar o egoísmo passado."
  };
  return meanings[number] || "Lição karmica a ser aprendida.";
}

function getPhoneInterpretation(vibration: number): string {
  const interpretations: Record<number, string> = {
    1: "Número de liderança e iniciativa. Favorece novos empreendimentos.",
    2: "Número de cooperação e diplomacia. Ideal para parcerias.",
    3: "Número de criatividade e comunicação. Favorece expressão artística.",
    4: "Número de estabilidade e trabalho. Ideal para negócios sólidos.",
    5: "Número de liberdade e mudança. Favorece viagens e novidades.",
    6: "Número de responsabilidade e família. Ideal para questões domésticas.",
    7: "Número de espiritualidade e introspecção. Favorece estudos profundos.",
    8: "Número de poder e materialidade. Ideal para negócios e finanças.",
    9: "Número de universalidade e humanitarismo. Favorece causas nobres.",
    11: "Número mestre de intuição e inspiração. Vibração espiritual elevada.",
    22: "Número mestre de realizações práticas. Grande potencial construtivo.",
    33: "Número mestre do amor universal e cura. Vibração altruísta."
  };
  return interpretations[vibration] || "Vibração neutra.";
}

function getAddressInterpretation(vibration: number): string {
  const interpretations: Record<number, string> = {
    1: "Casa de liderança e independência. Favorece pioneirismo.",
    2: "Casa de harmonia e cooperação. Ideal para relacionamentos.",
    3: "Casa de alegria e criatividade. Ambiente inspirador e comunicativo.",
    4: "Casa de estabilidade e segurança. Base sólida para a família.",
    5: "Casa de liberdade e aventura. Ambiente dinâmico e variado.",
    6: "Casa de amor e responsabilidade. Ambiente acolhedor e nutritivo.",
    7: "Casa de paz e reflexão. Ambiente propício para estudos e meditação.",
    8: "Casa de prosperidade e poder. Ambiente para crescimento material.",
    9: "Casa de compaixão e serviço. Ambiente altruísta e humanitário.",
    11: "Casa de inspiração e intuição. Vibração espiritual elevada.",
    22: "Casa de grandes realizações. Potencial para projetos significativos.",
    33: "Casa de amor incondicional e cura. Ambiente de compaixão e serviço."
  };
  return interpretations[vibration] || "Vibração equilibrada.";
}

function getLicensePlateInterpretation(vibration: number): string {
  const interpretations: Record<number, string> = {
    1: "Veículo de liderança. Favorece jornadas pioneiras e independentes.",
    2: "Veículo de cooperação. Ideal para viagens em parceria.",
    3: "Veículo de alegria. Favorece viagens prazerosas e comunicativas.",
    4: "Veículo de estabilidade. Confiável para o dia a dia.",
    5: "Veículo de liberdade. Ideal para aventuras e mudanças.",
    6: "Veículo de responsabilidade. Perfeito para a família.",
    7: "Veículo de reflexão. Favorece jornadas contemplativas.",
    8: "Veículo de poder. Ideal para negócios e status.",
    9: "Veículo de serviço. Favorece causas humanitárias.",
    11: "Veículo de inspiração. Vibração espiritual elevada.",
    22: "Veículo de realizações. Grande potencial para projetos importantes.",
    33: "Veículo de amor universal. Energia de cura e compaixão."
  };
  return interpretations[vibration] || "Vibração neutra e equilibrada.";
}

function generateExplanations(result: NumerologyResult): any {
  return {
    expression: "Representa sua missão de vida e talentos naturais.",
    soul: "Revela seus desejos íntimos e motivações profundas.", 
    personality: "Mostra como os outros o percebem externamente.",
    destiny: "Indica o caminho de vida e lições a aprender.",
    maturity: "Representa a síntese de sua evolução pessoal.",
    karmic_debts: "Lições não aprendidas em vidas passadas que precisam ser resolvidas."
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id });

    // Get request body
    const body = await req.json();
    const { input, conversion_table_id, calculation_rule_id } = body;
    
    logStep("Request body parsed", { 
      hasInput: !!input, 
      conversionTableId: conversion_table_id,
      calculationRuleId: calculation_rule_id 
    });

    // Get conversion table
    let conversionTable: ConversionTable;
    if (conversion_table_id) {
      const { data: tableData, error: tableError } = await supabaseClient
        .from('conversion_tables')
        .select('*')
        .eq('id', conversion_table_id)
        .single();
      
      if (tableError) throw new Error(`Error fetching conversion table: ${tableError.message}`);
      conversionTable = {
        mapping: tableData.mapping,
        normalization_rules: tableData.normalization_rules
      };
    } else {
      // Use default conversion table
      const { data: defaultTable, error: defaultError } = await supabaseClient
        .from('conversion_tables')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (defaultError) throw new Error(`Error fetching default conversion table: ${defaultError.message}`);
      conversionTable = {
        mapping: defaultTable.mapping,
        normalization_rules: defaultTable.normalization_rules
      };
    }

    // Get calculation rules
    let calculationRules: CalculationRules;
    if (calculation_rule_id) {
      const { data: rulesData, error: rulesError } = await supabaseClient
        .from('calculation_rules')
        .select('*')
        .eq('id', calculation_rule_id)
        .single();
      
      if (rulesError) throw new Error(`Error fetching calculation rules: ${rulesError.message}`);
      calculationRules = rulesData.config;
    } else {
      // Use default calculation rules
      const { data: defaultRules, error: defaultError } = await supabaseClient
        .from('calculation_rules')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (defaultError) throw new Error(`Error fetching default calculation rules: ${defaultError.message}`);
      calculationRules = defaultRules.config;
    }

    logStep("Tables and rules loaded", { 
      conversionTableKeys: Object.keys(conversionTable.mapping).length,
      calculationRulesKeys: Object.keys(calculationRules) 
    });

    // Perform calculations
    const result = await calculateNumerology(input, conversionTable, calculationRules);

    logStep("Calculation completed successfully");

    return new Response(JSON.stringify({ 
      success: true,
      result 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in calculate-numerology", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});