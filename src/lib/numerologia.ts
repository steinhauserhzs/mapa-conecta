import { supabase } from "@/integrations/supabase/client";

// Types
export interface NumerologyResult {
  motivation: number;
  impression: number;
  expression: number;
  destiny: number;
  mission: number;
  psychic: number;
  karmicLessons: number[];
  karmicDebts: number[];
  hiddenTendencies: number[];
  subconsciousResponse: number;
  lifeCycles: [number, number, number];
  challenges: [number, number, number];
  decisiveMoments: [number, number, number, number];
}

export interface ConversionTable {
  [key: string]: number;
}

export interface NumerologyText {
  section: string;
  key_number: number;
  title: string;
  body: string;
}

// Default conversion table (Pythagorean)
export const DEFAULT_CONVERSION_TABLE: ConversionTable = {
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9,
  "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 6, "P": 7, "Q": 8, "R": 9,
  "S": 1, "T": 2, "U": 3, "V": 4, "W": 5, "X": 6, "Y": 7, "Z": 8,
  "Á": 1, "À": 1, "Â": 1, "Ã": 1,
  "É": 5, "Ê": 5,
  "Í": 9,
  "Ó": 6, "Ô": 6, "Õ": 6,
  "Ú": 3, "Ü": 3,
  "Ç": 3
};

// Psychic number table (day of month -> psychic number)
export const DEFAULT_PSYCHIC_TABLE: { [key: number]: number } = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  10: 1, 11: 2, 12: 3, 13: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9,
  19: 1, 20: 2, 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 26: 8, 27: 9,
  28: 1, 29: 2, 30: 3, 31: 4
};

// Utility functions
export function normalizarLetras(str: string): string {
  return str
    .replace(/[^\p{L}]/gu, '') // Keep only letters (Unicode property)
    .toUpperCase();
}

export function isVogal(ch: string): boolean {
  const vowels = new Set(['A', 'E', 'I', 'O', 'U', 'Á', 'À', 'Â', 'Ã', 'É', 'Ê', 'Í', 'Ó', 'Ô', 'Õ', 'Ú', 'Ü']);
  return vowels.has(ch);
}

export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function valorLetra(ch: string, conversionTable: ConversionTable): number {
  // First try the exact character
  if (conversionTable[ch] !== undefined) {
    return conversionTable[ch];
  }
  
  // If not found, try without diacritics
  const base = removeDiacritics(ch);
  if (conversionTable[base] !== undefined) {
    return conversionTable[base];
  }
  
  // If still not found, return 0
  return 0;
}

export function somarLetras(
  texto: string, 
  conversionTable: ConversionTable,
  filtro: (ch: string) => boolean = () => true
): number {
  const normalized = normalizarLetras(texto);
  let sum = 0;
  
  for (const ch of normalized) {
    if (filtro(ch)) {
      sum += valorLetra(ch, conversionTable);
    }
  }
  
  return sum;
}

export function reduzirComMestre(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return n;
}

export function reduzirSimples(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return n;
}

// Core numerology calculations
export function calcularExpressao(nome: string, conversionTable: ConversionTable): number {
  const soma = somarLetras(nome, conversionTable);
  return reduzirComMestre(soma);
}

export function calcularMotivacao(nome: string, conversionTable: ConversionTable): number {
  const soma = somarLetras(nome, conversionTable, isVogal);
  // If the sum is 11 or 22, don't reduce
  if (soma === 11 || soma === 22) {
    return soma;
  }
  return reduzirComMestre(soma);
}

export function calcularImpressao(nome: string, conversionTable: ConversionTable): number {
  const soma = somarLetras(nome, conversionTable, ch => !isVogal(ch));
  return reduzirComMestre(soma);
}

export function calcularDestino(data: string): number {
  // Parse date DD/MM/YYYY and sum all digits
  const digits = data.replace(/\D/g, '');
  const soma = digits.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  return reduzirComMestre(soma);
}

export function calcularMissao(expressao: number, destino: number): number {
  return reduzirSimples(expressao + destino);
}

export function calcularPsiquico(dia: number, psychicTable: { [key: number]: number }): number {
  return psychicTable[dia] || reduzirSimples(dia);
}

export function calcularLicoesCarmicas(nome: string, conversionTable: ConversionTable): number[] {
  const normalized = normalizarLetras(nome);
  const presentNumbers = new Set<number>();
  
  for (const ch of normalized) {
    const value = valorLetra(ch, conversionTable);
    if (value >= 1 && value <= 9) {
      presentNumbers.add(value);
    }
  }
  
  const absent = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      absent.push(i);
    }
  }
  
  return absent;
}

export function calcularDividasCarmicas(nome: string, conversionTable: ConversionTable): number[] {
  // Implementation would need specific rules from Supabase
  // For now, return empty array
  return [];
}

export function calcularTendenciasOcultas(nome: string, conversionTable: ConversionTable): number[] {
  const normalized = normalizarLetras(nome);
  const frequency: { [key: number]: number } = {};
  
  for (const ch of normalized) {
    const value = valorLetra(ch, conversionTable);
    if (value >= 1 && value <= 9) {
      frequency[value] = (frequency[value] || 0) + 1;
    }
  }
  
  const maxFreq = Math.max(...Object.values(frequency));
  return Object.keys(frequency)
    .filter(key => frequency[parseInt(key)] === maxFreq)
    .map(key => parseInt(key))
    .sort((a, b) => a - b);
}

export function calcularRespostaSubconsciente(licoesCarmicas: number[]): number {
  return Math.max(0, Math.min(9, 9 - licoesCarmicas.length));
}

export function calcularCiclosVida(data: string): [number, number, number] {
  const [dia, mes, ano] = data.split('/').map(n => parseInt(n));
  
  const ciclo1 = reduzirComMestre(mes);
  const ciclo2 = reduzirComMestre(dia);
  const ciclo3 = reduzirComMestre(ano);
  
  return [ciclo1, ciclo2, ciclo3];
}

export function calcularDesafios(data: string): [number, number, number] {
  const [dia, mes, ano] = data.split('/').map(n => parseInt(n));
  
  const diaRed = reduzirSimples(dia);
  const mesRed = reduzirSimples(mes);
  const anoRed = reduzirSimples(ano);
  
  const desafio1 = Math.abs(diaRed - mesRed);
  const desafio2 = Math.abs(diaRed - anoRed);
  const desafioPrincipal = Math.abs(desafio1 - desafio2);
  
  return [desafio1, desafio2, desafioPrincipal];
}

export function calcularMomentos(data: string): [number, number, number, number] {
  const [dia, mes, ano] = data.split('/').map(n => parseInt(n));
  
  const momento1 = reduzirComMestre(dia + mes);
  const momento2 = reduzirComMestre(dia + ano);
  const momento3 = reduzirComMestre(mes + ano);
  const momento4 = reduzirComMestre(momento1 + momento2 + momento3);
  
  return [momento1, momento2, momento3, momento4];
}

// Supabase integration functions
export async function loadConversionTable(): Promise<ConversionTable> {
  try {
    const { data, error } = await supabase
      .from('conversion_tables')
      .select('mapping')
      .eq('is_default', true)
      .single();
      
    if (error || !data) {
      console.warn('Using default conversion table:', error);
      return DEFAULT_CONVERSION_TABLE;
    }
    
    return data.mapping as ConversionTable;
  } catch (error) {
    console.warn('Error loading conversion table, using default:', error);
    return DEFAULT_CONVERSION_TABLE;
  }
}

export async function loadPsychicTable(): Promise<{ [key: number]: number }> {
  // For now, use default table
  // TODO: Load from Supabase when table is available
  return DEFAULT_PSYCHIC_TABLE;
}

export async function loadNumerologyTexts(): Promise<NumerologyText[]> {
  try {
    const { data, error } = await supabase
      .from('numerology_texts')
      .select('*');
      
    if (error) {
      console.error('Error loading numerology texts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error loading numerology texts:', error);
    return [];
  }
}

// Main calculation function
export function calcularCompleto(
  nome: string, 
  data: string, 
  conversionTable: ConversionTable,
  psychicTable: { [key: number]: number }
): NumerologyResult {
  const [dia] = data.split('/').map(n => parseInt(n));
  
  const expressao = calcularExpressao(nome, conversionTable);
  const motivacao = calcularMotivacao(nome, conversionTable);
  const impressao = calcularImpressao(nome, conversionTable);
  const destino = calcularDestino(data);
  const missao = calcularMissao(expressao, destino);
  const psiquico = calcularPsiquico(dia, psychicTable);
  const licoesCarmicas = calcularLicoesCarmicas(nome, conversionTable);
  const dividasCarmicas = calcularDividasCarmicas(nome, conversionTable);
  const tendenciasOcultas = calcularTendenciasOcultas(nome, conversionTable);
  const respostaSubconsciente = calcularRespostaSubconsciente(licoesCarmicas);
  const ciclosVida = calcularCiclosVida(data);
  const desafios = calcularDesafios(data);
  const momentos = calcularMomentos(data);
  
  return {
    motivation: motivacao,
    impression: impressao,
    expression: expressao,
    destiny: destino,
    mission: missao,
    psychic: psiquico,
    karmicLessons: licoesCarmicas,
    karmicDebts: dividasCarmicas,
    hiddenTendencies: tendenciasOcultas,
    subconsciousResponse: respostaSubconsciente,
    lifeCycles: ciclosVida,
    challenges: desafios,
    decisiveMoments: momentos
  };
}

// Test case validation
export function validateTestCase(result: NumerologyResult): boolean {
  const expected = {
    motivation: 22,
    impression: 7,
    expression: 11,
    destiny: 9,
    mission: 2,
    lifeCycles: [5, 11, 2],
    challenges: [3, 0, 3],
    decisiveMoments: [7, 4, 11, 7]
  };
  
  return (
    result.motivation === expected.motivation &&
    result.impression === expected.impression &&
    result.expression === expected.expression &&
    result.destiny === expected.destiny &&
    result.mission === expected.mission &&
    JSON.stringify(result.lifeCycles) === JSON.stringify(expected.lifeCycles) &&
    JSON.stringify(result.challenges) === JSON.stringify(expected.challenges) &&
    JSON.stringify(result.decisiveMoments) === JSON.stringify(expected.decisiveMoments)
  );
}