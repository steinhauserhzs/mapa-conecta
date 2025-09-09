import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Calculator, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function CorrecaoAssinatura() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [assinaturaAtual, setAssinaturaAtual] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);

  const calcularLetraNumero = (letra: string): number => {
    const valores: { [key: string]: number } = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    };
    return valores[letra.toUpperCase()] || 0;
  };

  const reduzirNumero = (num: number): number => {
    while (num > 9) {
      num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };

  const analisarAssinatura = () => {
    if (!nomeCompleto) return;

    const nomes = nomeCompleto.trim().split(' ');
    const primeiroNome = nomes[0];
    const ultimoNome = nomes[nomes.length - 1];
    
    // Calcular número do nome completo
    const numeroNomeCompleto = reduzirNumero(
      nomeCompleto.replace(/\s/g, '').split('').reduce((acc, letra) => acc + calcularLetraNumero(letra), 0)
    );
    
    const novasSugestoes = [
      `Seu número de expressão é ${numeroNomeCompleto}. Considere assinar sempre com o nome completo para manifestar toda sua energia.`,
      `Para equilibrar energia: assine "${primeiroNome} ${ultimoNome}" (foco na essência pessoal e familiar).`,
      `Para fortalecer liderança: enfatize a primeira letra do nome com um traço mais marcante.`,
      `Para suavizar personalidade: use curvas suaves na assinatura, evite traços muito angulares.`,
      `Para atrair prosperidade: termine a assinatura com um traço ascendente.`,
      `Para proteção energética: circule ou sublinhe sua assinatura.`
    ];
    
    setSugestoes(novasSugestoes);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Edit className="h-8 w-8" />
          Correção de Assinatura
        </h1>
        <p className="text-muted-foreground mt-2">
          Otimize sua assinatura com base na numerologia do seu nome
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados para Análise</CardTitle>
          <CardDescription>
            Informe seus dados para receber sugestões personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assinatura">Assinatura Atual (opcional)</Label>
            <Textarea
              id="assinatura"
              placeholder="Descreva como você costuma assinar atualmente..."
              value={assinaturaAtual}
              onChange={(e) => setAssinaturaAtual(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button onClick={analisarAssinatura} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Gerar Sugestões
          </Button>
          
          {sugestoes.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Sugestões para sua Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {sugestoes.map((sugestao, index) => (
                    <li key={index} className="text-sm text-muted-foreground border-l-2 border-primary pl-4">
                      {sugestao}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}