import { NumerologyCalculator } from "@/components/NumerologyCalculator";
import { NumerologyValidator } from "@/components/NumerologyValidator";
import { ProfessionalNumerologyMap } from "@/components/ProfessionalNumerologyMap";
import { SEO } from "@/components/SEO";

const Numerology = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEO 
        title="Numerologia Profissional - Mapa Numerológico Completo"
        description="Gere seu mapa numerológico completo com análise detalhada de personalidade, destino, missão de vida e orientações cabalísticas. Sistema profissional de numerologia."
        keywords="numerologia, mapa numerológico, análise numerológica, cabala, destino, personalidade"
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Numerologia Profissional
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra os segredos do seu mapa numerológico completo com análise cabalística profissional
          </p>
        </div>
        
        <NumerologyCalculator />
        
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Validação dos Cálculos
          </h2>
          <NumerologyValidator />
        </div>
      </div>
    </div>
  );
};

export default Numerology;