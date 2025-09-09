import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Calculator } from "lucide-react";
import { useState } from "react";

export default function AnaliseTelefone() {
  const [telefone, setTelefone] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularNumerologia = () => {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 0) return;
    
    const soma = numeros.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    let resultado = soma;
    
    while (resultado > 9) {
      resultado = resultado.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    setResultado(resultado);
  };

  const interpretacoes = {
    1: "Liderança e independência - Este número traz energia de pioneirismo",
    2: "Cooperação e parceria - Favorece relacionamentos e trabalho em equipe",
    3: "Criatividade e comunicação - Estimula a expressão artística e social",
    4: "Estabilidade e organização - Promove estrutura e disciplina",
    5: "Liberdade e aventura - Traz mudanças e experiências variadas",
    6: "Responsabilidade e cuidado - Favorece família e compromissos",
    7: "Espiritualidade e análise - Estimula introspecção e estudos",
    8: "Sucesso material e poder - Atrai prosperidade financeira",
    9: "Sabedoria e altruísmo - Promove compaixão e serviço aos outros"
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Phone className="h-8 w-8" />
          Análise de Telefones
        </h1>
        <p className="text-muted-foreground mt-2">
          Descubra o significado numerológico do seu número de telefone
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Digite o Número do Telefone</CardTitle>
          <CardDescription>
            Inclua DDD e o número completo (apenas números são considerados)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telefone">Número do Telefone</Label>
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
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
                  Número Numerológico: {resultado}
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