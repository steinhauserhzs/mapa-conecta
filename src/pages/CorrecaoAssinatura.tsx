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

const FALLBACK_BASE_MAP: Record<string, number> = { A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1, J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2, S:3, T:4, U:6, V:6, W:6, X:6, Y:1, Z:7, 'Ç':8 };
const MASTER = new Set([11,22]);

function analyzeChar(raw: string) {
  if (!raw) return null;
  const nfd = raw.normalize('NFD');
  const m = nfd.toUpperCase().match(/[A-Z]|Ç/);
  if (!m) return null;
  const baseChar = m[0];
  return {
    baseChar,
    marks: {
      apostrophe: /['']/.test(raw),
      circumflex: /[\u0302]|\^/.test(nfd),
      ring: /[\u030A]|\u02DA/.test(nfd),
      tilde: /[\u0303]|~/.test(nfd),
      diaeresis: /[\u0308]|\u00A8/.test(nfd),
      grave: /[\u0300]|`/.test(nfd)
    }
  };
}

function applyMods(v: number, m: any) {
  let val = v;
  if (m.apostrophe) val += 2;
  if (m.circumflex) val += 7;
  if (m.ring) val += 7;
  if (m.tilde) val += 3;
  if (m.diaeresis) val *= 2;
  if (m.grave) val *= 2;
  return val;
}

function reduce(n: number): number {
  if (n <= 0) return 0;
  if (MASTER.has(n)) return n;
  while (n > 9 && !MASTER.has(n)) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
    if (MASTER.has(n)) return n;
  }
  return n;
}

function expressaoNumero(nome: string) {
  let total = 0;
  for (const ch of [...(nome || '')]) {
    const analyzed = analyzeChar(ch);
    if (!analyzed) continue;
    const base = FALLBACK_BASE_MAP[analyzed.baseChar];
    if (base === undefined) continue;
    total += applyMods(base, analyzed.marks);
  }
  return reduce(total);
}

  const analisarAssinatura = () => {
    if (!nomeCompleto) return;

    const nomes = nomeCompleto.trim().split(' ');
    const primeiroNome = nomes[0];
    const ultimoNome = nomes[nomes.length - 1];
    
    // Calcular número do nome completo
const numeroNomeCompleto = expressaoNumero(nomeCompleto);
    
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