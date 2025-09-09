import { NumerologyCalculator } from "@/components/NumerologyCalculator";

const Numerology = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Numerologia Cabalística</h1>
          <p className="text-muted-foreground">
            Descubra os números que regem sua vida através da numerologia cabalística tradicional
          </p>
        </div>
        
        <NumerologyCalculator />
      </div>
    </div>
  );
};

export default Numerology;