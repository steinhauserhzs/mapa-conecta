import { numerologiaJéTabela } from './numerologia';

export interface ValidationResult {
  test: string;
  expected: number;
  actual: number;
  passed: boolean;
  details?: any;
}

export function runValidationTests(): ValidationResult[] {
  const tests = [
    // Teste 1: "ÇU" → 6 (Ç) + 6 (U) = 12 → redução: ((12–1)%8)+1 = 4
    {
      input: "ÇU",
      expectedSum: 12,
      expectedReduction: 4
    },
    // Teste 2: "Á" → A=1, agudo +2 ⇒ 3
    {
      input: "Á",
      expectedSum: 3,
      expectedReduction: 3
    },
    // Teste 3: "À" → A=1, grave ×2 ⇒ 2
    {
      input: "À",
      expectedSum: 2,
      expectedReduction: 2
    },
    // Teste 4: "Â" → A=1, circunflexo +7 ⇒ 8
    {
      input: "Â",
      expectedSum: 8,
      expectedReduction: 8
    },
    // Teste 5: "ÃO" → A=1 (+3 til) = 4; O=7 ⇒ total 11; redução ((11–1)%8)+1 = 4
    {
      input: "ÃO",
      expectedSum: 11,
      expectedReduction: 4
    }
  ];

  const results: ValidationResult[] = [];

  for (const test of tests) {
    const resultado = numerologiaJéTabela(test.input);
    
    const sumPassed = resultado.somaTotal === test.expectedSum;
    const reductionPassed = resultado.reducao_1a8 === test.expectedReduction;
    
    results.push({
      test: `${test.input} (soma)`,
      expected: test.expectedSum,
      actual: resultado.somaTotal,
      passed: sumPassed,
      details: resultado.detalhes
    });
    
    results.push({
      test: `${test.input} (redução 1-8)`,
      expected: test.expectedReduction,
      actual: resultado.reducao_1a8,
      passed: reductionPassed,
      details: resultado
    });
  }

  return results;
}

export function logValidationResults(): void {
  const results = runValidationTests();
  
  console.log('=== TESTES DE VALIDAÇÃO NUMEROLOGIA JÉ ===');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASSOU' : '❌ FALHOU';
    console.log(`${status} - ${result.test}: esperado ${result.expected}, obtido ${result.actual}`);
    
    if (!result.passed && result.details) {
      console.log('  Detalhes:', result.details);
    }
  });
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`\nResumo: ${passedTests}/${totalTests} testes passaram (${passRate}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Todos os testes de validação passaram!');
  } else {
    console.log('⚠️  Alguns testes falharam. Verificar implementação.');
  }
}