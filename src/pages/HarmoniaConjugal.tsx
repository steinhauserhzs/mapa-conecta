import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PartnerData {
  nome: string;
  nascimento: string;
  expressao: number;
  motivacao: number;
  destino: number;
}

interface HarmoniaAnalysis {
  parceiro1: PartnerData;
  parceiro2: PartnerData;
  compatibilidadeGeral: number;
  harmoniaExpressao: number;
  harmoniaMotivacao: number;
  harmoniaDestino: number;
}

export default function HarmoniaConjugal() {
  const [partner1Name, setPartner1Name] = useState("");
  const [partner1Birth, setPartner1Birth] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [partner2Birth, setPartner2Birth] = useState("");
  const [analysis, setAnalysis] = useState<HarmoniaAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateCompatibility = (num1: number, num2: number): number => {
    const diff = Math.abs(num1 - num2);
    if (diff === 0) return 100;
    if (diff === 1) return 85;
    if (diff === 2) return 70;
    if (diff === 3) return 55;
    if (diff === 4) return 40;
    return 25;
  };

  const handleAnalyze = async () => {
    if (!partner1Name.trim() || !partner1Birth || !partner2Name.trim() || !partner2Birth) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Calculate numerology for both partners
      const [result1, result2] = await Promise.all([
        supabase.functions.invoke('calculate-numerology', {
          body: { name: partner1Name, birth: partner1Birth }
        }),
        supabase.functions.invoke('calculate-numerology', {
          body: { name: partner2Name, birth: partner2Birth }
        })
      ]);

      if (result1.error || result2.error) {
        throw new Error("Erro no cálculo numerológico");
      }

      const partner1Data: PartnerData = {
        nome: partner1Name,
        nascimento: partner1Birth,
        expressao: result1.data.expressao,
        motivacao: result1.data.motivacao,
        destino: result1.data.destino
      };

      const partner2Data: PartnerData = {
        nome: partner2Name,
        nascimento: partner2Birth,
        expressao: result2.data.expressao,
        motivacao: result2.data.motivacao,
        destino: result2.data.destino
      };

      const harmoniaExpressao = calculateCompatibility(partner1Data.expressao, partner2Data.expressao);
      const harmoniaMotivacao = calculateCompatibility(partner1Data.motivacao, partner2Data.motivacao);
      const harmoniaDestino = calculateCompatibility(partner1Data.destino, partner2Data.destino);
      
      const compatibilidadeGeral = Math.round((harmoniaExpressao + harmoniaMotivacao + harmoniaDestino) / 3);

      setAnalysis({
        parceiro1: partner1Data,
        parceiro2: partner2Data,
        compatibilidadeGeral,
        harmoniaExpressao,
        harmoniaMotivacao,
        harmoniaDestino
      });

      toast({
        title: "Análise concluída",
        description: "Análise de harmonia conjugal gerada com sucesso!",
      });
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na análise",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Harmonia Conjugal
          </h1>
          <p className="text-muted-foreground">
            Análise de compatibilidade numerológica entre parceiros
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dados dos Parceiros
            </CardTitle>
            <CardDescription>
              Insira os dados de ambos os parceiros para análise de compatibilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Parceiro 1</h3>
                <div className="space-y-2">
                  <Label htmlFor="partner1Name">Nome Completo</Label>
                  <Input
                    id="partner1Name"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    placeholder="Nome do primeiro parceiro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner1Birth">Data de Nascimento</Label>
                  <Input
                    id="partner1Birth"
                    type="date"
                    value={partner1Birth}
                    onChange={(e) => setPartner1Birth(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Parceiro 2</h3>
                <div className="space-y-2">
                  <Label htmlFor="partner2Name">Nome Completo</Label>
                  <Input
                    id="partner2Name"
                    value={partner2Name}
                    onChange={(e) => setPartner2Name(e.target.value)}
                    placeholder="Nome do segundo parceiro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner2Birth">Data de Nascimento</Label>
                  <Input
                    id="partner2Birth"
                    type="date"
                    value={partner2Birth}
                    onChange={(e) => setPartner2Birth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Analisando..." : "Analisar Compatibilidade"}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análise de Compatibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getCompatibilityColor(analysis.compatibilidadeGeral)}`}>
                  {analysis.compatibilidadeGeral}%
                </div>
                <div className="text-lg text-muted-foreground">Compatibilidade Geral</div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(analysis.harmoniaExpressao)}`}>
                    {analysis.harmoniaExpressao}%
                  </div>
                  <div className="text-sm text-muted-foreground">Harmonia na Expressão</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(analysis.harmoniaMotivacao)}`}>
                    {analysis.harmoniaMotivacao}%
                  </div>
                  <div className="text-sm text-muted-foreground">Harmonia na Motivação</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(analysis.harmoniaDestino)}`}>
                    {analysis.harmoniaDestino}%
                  </div>
                  <div className="text-sm text-muted-foreground">Harmonia no Destino</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{analysis.parceiro1.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Expressão:</span>
                        <span className="font-semibold">{analysis.parceiro1.expressao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Motivação:</span>
                        <span className="font-semibold">{analysis.parceiro1.motivacao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destino:</span>
                        <span className="font-semibold">{analysis.parceiro1.destino}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{analysis.parceiro2.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Expressão:</span>
                        <span className="font-semibold">{analysis.parceiro2.expressao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Motivação:</span>
                        <span className="font-semibold">{analysis.parceiro2.motivacao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destino:</span>
                        <span className="font-semibold">{analysis.parceiro2.destino}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}