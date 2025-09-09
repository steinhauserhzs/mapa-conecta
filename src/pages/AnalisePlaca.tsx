import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Calculator } from "lucide-react";
import { useState } from "react";

export default function AnalisePlaca() {
  const [placa, setPlaca] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularNumerologia = () => {
    const numeros = placa.replace(/\D/g, '');
    if (numeros.length === 0) return;
    
    const soma = numeros.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    let resultado = soma;
    
    while (resultado > 9) {
      resultado = resultado.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    setResultado(resultado);
  };

  const interpretacoes = {
    1: "Veículo de liderança - Favorece quem toma iniciativas e comanda",
    2: "Veículo cooperativo - Ideal para parcerias e trabalho em equipe",
    3: "Veículo criativo - Estimula comunicação e expressão pessoal",
    4: "Veículo estável - Promove segurança e confiabilidade nas viagens",
    5: "Veículo aventureiro - Traz liberdade e experiências variadas",
    6: "Veículo familiar - Perfeito para uso doméstico e cuidado da família",
    7: "Veículo reflexivo - Favorece introspecção e viagens espirituais",
    8: "Veículo próspero - Atrai sucesso e reconhecimento profissional",
    9: "Veículo altruísta - Promove compaixão e serviço aos outros"
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Car className="h-8 w-8" />
          Análise de Placas
        </h1>
        <p className="text-muted-foreground mt-2">
          Descubra o significado numerológico da placa do seu veículo
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Digite a Placa do Veículo</CardTitle>
          <CardDescription>
            Informe a placa completa (apenas os números são considerados)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="placa">Placa do Veículo</Label>
            <Input
              id="placa"
              placeholder="ABC-1234 ou ABC1D23"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            />
          </div>
          
          <Button onClick={calcularNumerologia} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Analisar Numerologia
          </Button>
          
          {resultado && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Número da Placa: {resultado}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {interpretacoes[resultado as keyof typeof interpretacoes]}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}