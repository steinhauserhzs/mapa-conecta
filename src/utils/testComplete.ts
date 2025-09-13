import { supabase } from "@/integrations/supabase/client";

export async function testCompleteImplementation() {
  const testName = "Hairã zupanc Steinhauser";
  const testBirth = "11/05/2000";
  
  console.log("🧪 Testando implementação completa:", testName, testBirth);
  
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
    const texts = result?.textos;
    
    if (!numbers) {
      console.error("❌ Nenhum número calculado");
      return { success: false, error: "No numbers calculated" };
    }
    
    console.log("✅ Números calculados:", {
      motivacao: numbers.motivacao,
      impressao: numbers.impressao,
      expressao: numbers.expressao,
      destino: numbers.destino,
      missao: numbers.missao,
      psiquico: numbers.psiquico,
      anoPessoal: numbers.anoPessoal,
      anjoEspecial: numbers.anjoEspecial,
      licoesCarmicas: numbers.licoesCarmicas,
      dividasCarmicas: numbers.dividasCarmicas,
      tendenciasOcultas: numbers.tendenciasOcultas,
      respostaSubconsciente: numbers.respostaSubconsciente,
      ciclosVida: numbers.ciclosVida,
      desafios: numbers.desafios,
      momentos: numbers.momentos
    });
    
    console.log("📝 Textos disponíveis:", Object.keys(texts || {}));
    
    // Validação dos valores esperados
    const expected = {
      motivacao: 22,
      impressao: 7,
      expressao: 11,
      destino: 9,
      missao: 2,
      licoesCarmicas: [9],
      dividasCarmicas: [13],
      tendenciasOcultas: [1, 5], // Corrigido para incluir ambos os números
      respostaSubconsciente: 8,
      ciclosVida: [5, 11, 2],
      desafios: [3, 0, 3], // Corrigido para os valores corretos
      momentos: [7, 4, 11, 7],
      anjoEspecial: "Nanael"
    };
    
    const validation = {
      motivacao: numbers.motivacao === expected.motivacao,
      impressao: numbers.impressao === expected.impressao,
      expressao: numbers.expressao === expected.expressao,
      destino: numbers.destino === expected.destino,
      missao: numbers.missao === expected.missao,
      licoesCarmicas: JSON.stringify(numbers.licoesCarmicas) === JSON.stringify(expected.licoesCarmicas),
      dividasCarmicas: JSON.stringify(numbers.dividasCarmicas) === JSON.stringify(expected.dividasCarmicas),
      tendenciasOcultas: JSON.stringify(numbers.tendenciasOcultas?.sort()) === JSON.stringify(expected.tendenciasOcultas?.sort()),
      respostaSubconsciente: numbers.respostaSubconsciente === expected.respostaSubconsciente,
      ciclosVida: JSON.stringify(numbers.ciclosVida) === JSON.stringify(expected.ciclosVida),
      desafios: JSON.stringify(numbers.desafios) === JSON.stringify(expected.desafios),
      momentos: JSON.stringify(numbers.momentos) === JSON.stringify(expected.momentos),
      anjoEspecial: numbers.anjoEspecial === expected.anjoEspecial,
      hasTexts: !!(texts && Object.keys(texts).length > 0)
    };
    
    console.log("🔍 Validação completa:", validation);
    
    const allValid = Object.values(validation).every(v => v === true);
    
    if (allValid) {
      console.log("🎉 TESTE COMPLETO PASSOU! Todos os valores estão corretos e há conteúdo detalhado disponível.");
    } else {
      console.warn("⚠️ Algumas validações falharam:", Object.entries(validation).filter(([k, v]) => !v));
    }
    
    return { 
      success: allValid, 
      result, 
      validation,
      numbers,
      texts,
      expected 
    };
    
  } catch (error) {
    console.error("💥 Exceção no teste:", error);
    return { success: false, error };
  }
}

// Auto-execute in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testCompleteImplementation().then(result => {
      console.log("📊 Resultado final do teste completo:", result);
    });
  }, 3000);
}