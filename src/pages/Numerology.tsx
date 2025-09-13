import { NumerologyCalculator } from "@/components/NumerologyCalculator";
import { ProfessionalNumerologyMap } from "@/components/ProfessionalNumerologyMap";

const Numerology = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Numerologia Cabalística Profissional</h1>
          <p className="text-muted-foreground">
            Mapa numerológico completo com estrutura profissional igual aos mapas tradicionais de numerólogos
          </p>
        </div>
        
        <NumerologyCalculator />
      </div>
    </div>
  );
};

export default Numerology;