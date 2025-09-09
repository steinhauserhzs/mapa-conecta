import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calculator } from "lucide-react";
import { useState } from "react";

export default function AnaliseEndereco() {
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularNumerologia = () => {
    const todosNumeros = (numero + cep).replace(/\D/g, '');
    if (todosNumeros.length === 0) return;
    
    const soma = todosNumeros.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    let resultado = soma;
    
    while (resultado > 9) {
      resultado = resultado.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    setResultado(resultado);
  };

  const interpretacoes = {
    1: "Casa de liderança - Favorece empreendedorismo e independência",
    2: "Casa de harmonia - Ideal para relacionamentos e parcerias",
    3: "Casa criativa - Estimula arte, comunicação e vida social",
    4: "Casa estável - Promove segurança, trabalho e organização",
    5: "Casa dinâmica - Traz movimento, mudanças e experiências",
    6: "Casa familiar - Perfeita para vida doméstica e cuidado",
    7: "Casa espiritual - Favorece estudos, meditação e introspecção",
    8: "Casa próspera - Atrai sucesso financeiro e reconhecimento",
    9: "Casa altruísta - Promove compaixão e serviço à comunidade"
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <MapPin className="h-8 w-8" />
          Análise de Endereços
        </h1>
        <p className="text-muted-foreground mt-2">
          Descubra a energia numerológica do seu endereço
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Digite os Dados do Endereço</CardTitle>
          <CardDescription>
            Informe o endereço completo para uma análise precisa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endereco">Rua/Avenida</Label>
            <Input
              id="endereco"
              placeholder="Nome da rua ou avenida"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numero">Número da Casa/Apartamento</Label>
            <Input
              id="numero"
              placeholder="123"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              placeholder="12345-678"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
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
                  Número da Casa: {resultado}
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