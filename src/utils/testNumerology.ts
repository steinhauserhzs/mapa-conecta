import { supabase } from "@/integrations/supabase/client";

export async function testNumerologyCase() {
  const testName = "Hairã zupanc Steinhauser";
  const testBirth = "11/05/2000";
  
  console.log("🧪 Testando caso específico:", testName, testBirth);
  
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-map', {
      body: { 
        name: testName, 
        birth: testBirth,
        anoReferencia: new Date().getFullYear()
      }
    });
    
    if (error) {
      console.error("❌ Erro no teste:", error);
      return { success: false, error };
    }
    
    const numbers = result?.numeros;
    if (!numbers) {
      console.error("❌ Nenhum número calculado");
      return { success: false, error: "No numbers calculated" };
    }
    
    console.log("✅ Números calculados no teste:", {
      motivacao: numbers.motivacao,
      impressao: numbers.impressao,
      expressao: numbers.expressao,
      destino: numbers.destino,
      missao: numbers.missao,
      psiquico: numbers.psiquico,
      anoPessoal: numbers.anoPessoal,
      anjoEspecial: numbers.anjoEspecial,
      arrays: {
        licoesCarmicas: numbers.licoesCarmicas,
        dividasCarmicas: numbers.dividasCarmicas,
        tendenciasOcultas: numbers.tendenciasOcultas,
        ciclosVida: numbers.ciclosVida,
        desafios: numbers.desafios,
        momentos: numbers.momentos
      }
    });
    
    console.log("📝 Textos disponíveis:", Object.keys(result?.textos || {}));
    
    // Validation against expected values (based on user's reference PDF)
    const expected = {
      motivacao: 22,
      impressao: 7,
      expressao: 11,
      destino: 9,
      missao: 2,
      psiquico: 11,
      licoesCarmicas: [9],
      dividasCarmicas: [13],
      tendenciasOcultas: [1, 5], // Corrected: números que aparecem 2+ vezes
      respostaSubconsciente: 8,
      ciclosVida: [5, 11, 2],
      desafios: [3, 0, 3], // Corrected: |5-11|=6->3, |2000->2|=2, |11-2|=9->0, |3-0|=3
      momentos: [7, 4, 11, 7], // Dia+mês=16->7, dia=11->4, destino=9->11, mês+destino=14->5->7
      anjoEspecial: "Nanael"
    };
    
    const validation = {
      motivacao: numbers.motivacao === expected.motivacao,
      impressao: numbers.impressao === expected.impressao,
      expressao: numbers.expressao === expected.expressao,
      destino: numbers.destino === expected.destino,
      missao: numbers.missao === expected.missao,
      psiquico: numbers.psiquico === expected.psiquico,
      licoesCarmicas: JSON.stringify(numbers.licoesCarmicas?.sort()) === JSON.stringify(expected.licoesCarmicas.sort()),
      dividasCarmicas: JSON.stringify(numbers.dividasCarmicas?.sort()) === JSON.stringify(expected.dividasCarmicas.sort()),
      tendenciasOcultas: JSON.stringify(numbers.tendenciasOcultas?.sort()) === JSON.stringify(expected.tendenciasOcultas.sort()),
      respostaSubconsciente: numbers.respostaSubconsciente === expected.respostaSubconsciente,
      ciclosVida: JSON.stringify(numbers.ciclosVida) === JSON.stringify(expected.ciclosVida),
      desafios: JSON.stringify(numbers.desafios) === JSON.stringify(expected.desafios),
      momentos: JSON.stringify(numbers.momentos) === JSON.stringify(expected.momentos),
      anjoEspecial: numbers.anjoEspecial === expected.anjoEspecial,
      hasAllArrays: !!(numbers.licoesCarmicas && numbers.ciclosVida && numbers.desafios && numbers.momentos),
      hasTexts: !!(result?.textos && Object.keys(result.textos).length > 0)
    };
    
    console.log("🔍 Validação do teste:", validation);
    
    // Detailed error reporting
    if (!validation.motivacao) console.error("❌ Motivação incorreta:", numbers.motivacao, "esperado:", expected.motivacao);
    if (!validation.impressao) console.error("❌ Impressão incorreta:", numbers.impressao, "esperado:", expected.impressao);
    if (!validation.expressao) console.error("❌ Expressão incorreta:", numbers.expressao, "esperado:", expected.expressao);
    if (!validation.destino) console.error("❌ Destino incorreto:", numbers.destino, "esperado:", expected.destino);
    if (!validation.missao) console.error("❌ Missão incorreta:", numbers.missao, "esperado:", expected.missao);
    if (!validation.tendenciasOcultas) console.error("❌ Tendências Ocultas incorretas:", numbers.tendenciasOcultas, "esperado:", expected.tendenciasOcultas);
    if (!validation.desafios) console.error("❌ Desafios incorretos:", numbers.desafios, "esperado:", expected.desafios);
    if (!validation.anjoEspecial) console.error("❌ Anjo incorreto:", numbers.anjoEspecial, "esperado:", expected.anjoEspecial);
    
    const allValid = Object.values(validation).every(v => v === true);
    
    return { 
      success: allValid, 
      result, 
      validation,
      numbers,
      expected
    };
    
  } catch (error) {
    console.error("💥 Exceção no teste:", error);
    return { success: false, error };
  }
}

// Call test automatically in development
if (import.meta.env.DEV) {
  // Delay to ensure Supabase is initialized
  setTimeout(() => {
    testNumerologyCase().then(result => {
      console.log("📊 Resultado final do teste:", result);
    });
  }, 2000);
}