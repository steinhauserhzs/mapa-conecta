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
    
    // Validation against expected values (based on user's reference)
    const expected = {
      motivacao: 22, // User expects this to be 22 based on their reference
      // Add other expected values based on user's screenshots
    };
    
    const validation = {
      motivacao: numbers.motivacao === expected.motivacao,
      hasAllArrays: !!(numbers.licoesCarmicas && numbers.ciclosVida && numbers.desafios && numbers.momentos),
      hasTexts: !!(result?.textos && Object.keys(result.textos).length > 0)
    };
    
    console.log("🔍 Validação do teste:", validation);
    
    return { 
      success: true, 
      result, 
      validation,
      numbers 
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