import { supabase } from "@/integrations/supabase/client";

export interface TestResult {
  success: boolean;
  calculatedNumbers: Record<string, any>;
  expectedNumbers: Record<string, any>;
  validation: Record<string, boolean>;
  textCoverage: {
    totalFound: number;
    totalExpected: number;
    missingKeys: string[];
  };
}

// Test case: Hairã Zupanc Steinhauser, born 11/05/2000
export async function testMapGeneration(): Promise<TestResult> {
  const testCase = {
    name: 'Hairã Zupanc Steinhauser',
    birth: '11/05/2000',
    referenceYear: 2025
  };

  // Expected values based on cabalistic numerology (Jé system)
  const expectedNumbers = {
    motivacao: 9,   // vowels: A + Ã + U + A + E + I + A + U + E
    impressao: 7,   // consonants: H + R + Z + P + N + C + S + T + N + H + S + R
    expressao: 16,  // all letters (reduces to 7)
    destino: 7,     // birth date sum: 1+1+0+5+2+0+0+0
    missao: 2,      // (expressao + destino) mod 8 + 1
    psiquico: 2,    // day 11 -> psychic 11 -> but check table
    anoPessoal: 7,  // 1+1+0+5+2+0+2+5
    diaNascimento: 11,
    grauAscensao: 22, // (16+7) = 23 -> reduced to special handling
    anjoEspecial: 'Nanael'
  };

  try {
    console.log('🧪 Testando geração de mapa numerológico...');
    
    // Invoke the generate-map function
    const { data, error } = await supabase.functions.invoke('generate-map', {
      body: testCase
    });

    if (error) {
      console.error('❌ Erro na invocação:', error);
      return {
        success: false,
        calculatedNumbers: {},
        expectedNumbers,
        validation: {},
        textCoverage: { totalFound: 0, totalExpected: 31, missingKeys: [] }
      };
    }

    console.log('📊 Resultado recebido:', data);

    const calculatedNumbers = data.numeros || {};
    const texts = data.textos || {};
    
    // Validate calculated numbers against expected
    const validation: Record<string, boolean> = {};
    for (const [key, expected] of Object.entries(expectedNumbers)) {
      const calculated = calculatedNumbers[key];
      validation[key] = calculated === expected;
      
      if (!validation[key]) {
        console.log(`❌ ${key}: esperado ${expected}, calculado ${calculated}`);
      } else {
        console.log(`✅ ${key}: ${calculated} (correto)`);
      }
    }

    // Check text coverage
    const textKeys = Object.keys(texts);
    const missingKeys = [];
    let emptyTexts = 0;

    for (const [key, textObj] of Object.entries(texts)) {
      if (typeof textObj === 'object' && textObj !== null) {
        const obj = textObj as any;
        if (!obj.conteudo || obj.conteudo.trim() === '') {
          missingKeys.push(key);
          emptyTexts++;
        }
      }
    }

    const textCoverage = {
      totalFound: textKeys.length - emptyTexts,
      totalExpected: 31,
      missingKeys
    };

    console.log(`📚 Cobertura de textos: ${textCoverage.totalFound}/${textCoverage.totalExpected}`);
    
    if (missingKeys.length > 0) {
      console.log('❌ Textos vazios encontrados:', missingKeys);
    }

    const allNumbersCorrect = Object.values(validation).every(Boolean);
    const allTextsPresent = missingKeys.length === 0;
    
    return {
      success: allNumbersCorrect && allTextsPresent,
      calculatedNumbers,
      expectedNumbers,
      validation,
      textCoverage
    };

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return {
      success: false,
      calculatedNumbers: {},
      expectedNumbers,
      validation: {},
      textCoverage: { totalFound: 0, totalExpected: 31, missingKeys: [] }
    };
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  setTimeout(async () => {
    console.log('🧪 Executando teste automático...');
    const result = await testMapGeneration();
    console.log('🏁 Resultado final do teste:', result);
  }, 5000);
}