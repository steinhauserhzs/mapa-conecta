import { useState, useEffect, useMemo } from 'react';
import { 
  calcularCompleto, 
  loadConversionTable, 
  loadPsychicTable,
  loadNumerologyTexts,
  validateTestCase,
  NumerologyResult,
  ConversionTable,
  NumerologyText,
  DEFAULT_CONVERSION_TABLE
} from '@/lib/numerologia';

export interface UseNumerologiaProps {
  nome: string;
  data: string;
}

export interface UseNumerologiaReturn {
  result: NumerologyResult | null;
  texts: { [key: string]: NumerologyText };
  loading: boolean;
  error: string | null;
  conversionTable: ConversionTable;
  psychicTable: { [key: number]: number };
  isValidTestCase: boolean;
}

export function useNumerologia({ nome, data }: UseNumerologiaProps): UseNumerologiaReturn {
  const [conversionTable, setConversionTable] = useState<ConversionTable>(DEFAULT_CONVERSION_TABLE);
  const [psychicTable, setPsychicTable] = useState<{ [key: number]: number }>({});
  const [numerologyTexts, setNumerologyTexts] = useState<NumerologyText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [conversionData, psychicData, textData] = await Promise.all([
          loadConversionTable(),
          loadPsychicTable(),
          loadNumerologyTexts()
        ]);

        setConversionTable(conversionData);
        setPsychicTable(psychicData);
        setNumerologyTexts(textData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate numerology result
  const result = useMemo(() => {
    if (!nome || !data || loading) return null;
    
    try {
      return calcularCompleto(nome, data, conversionTable, psychicTable);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro nos cálculos');
      return null;
    }
  }, [nome, data, conversionTable, psychicTable, loading]);

  // Validate test case
  const isValidTestCase = useMemo(() => {
    if (!result) return false;
    
    const isTestCase = nome.toLowerCase().includes('hairã') && data === '11/05/2000';
    if (isTestCase) {
      return validateTestCase(result);
    }
    
    return true; // Not a test case, so it's "valid"
  }, [result, nome, data]);

  // Create texts lookup object
  const texts = useMemo(() => {
    const textLookup: { [key: string]: NumerologyText } = {};
    
    if (!result) return textLookup;

    // Create keys for each calculated number
    const keys = [
      `motivacao-${result.motivation}`,
      `impressao-${result.impression}`,
      `expressao-${result.expression}`,
      `destino-${result.destiny}`,
      `missao-${result.mission}`,
      `psiquico-${result.psychic}`,
      `ciclo-vida-1-${result.lifeCycles[0]}`,
      `ciclo-vida-2-${result.lifeCycles[1]}`,
      `ciclo-vida-3-${result.lifeCycles[2]}`,
      `desafio-1-${result.challenges[0]}`,
      `desafio-2-${result.challenges[1]}`,
      `desafio-principal-${result.challenges[2]}`,
      `momento-1-${result.decisiveMoments[0]}`,
      `momento-2-${result.decisiveMoments[1]}`,
      `momento-3-${result.decisiveMoments[2]}`,
      `momento-4-${result.decisiveMoments[3]}`
    ];

    // Add karmic lessons
    result.karmicLessons.forEach(lesson => {
      keys.push(`licao-carmica-${lesson}`);
    });

    // Add karmic debts
    result.karmicDebts.forEach(debt => {
      keys.push(`divida-carmica-${debt}`);
    });

    // Add hidden tendencies
    result.hiddenTendencies.forEach(tendency => {
      keys.push(`tendencia-oculta-${tendency}`);
    });

    // Map texts to keys
    numerologyTexts.forEach(text => {
      const key = `${text.section}-${text.key_number}`;
      if (keys.includes(key)) {
        textLookup[key] = text;
      }
    });

    return textLookup;
  }, [result, numerologyTexts]);

  return {
    result,
    texts,
    loading,
    error,
    conversionTable,
    psychicTable,
    isValidTestCase
  };
}