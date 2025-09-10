import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Baby, Plus, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NameAnalysis {
  nome: string;
  expressao: number;
  motivacao: number;
  impressao: number;
  destino: number;
  pontuacao: number;
}

export default function MapasInfantis() {
  const [birthDate, setBirthDate] = useState("");
  const [candidateNames, setCandidateNames] = useState<string[]>([""]);
  const [analyses, setAnalyses] = useState<NameAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addNameField = () => {
    setCandidateNames([...candidateNames, ""]);
  };

  const removeNameField = (index: number) => {
    if (candidateNames.length > 1) {
      const newNames = candidateNames.filter((_, i) => i !== index);
      setCandidateNames(newNames);
    }
  };

  const updateName = (index: number, value: string) => {
    const newNames = [...candidateNames];
    newNames[index] = value;
    setCandidateNames(newNames);
  };

  const calculateScore = (expressao: number, motivacao: number, impressao: number, destino: number): number => {
    // Scoring system: master numbers (11, 22) get bonus points
    let score = 0;
    
    [expressao, motivacao, impressao, destino].forEach(num => {
      if (num === 11 || num === 22) score += 25; // Master numbers bonus
      else if (num === 1 || num === 9) score += 20; // Leadership numbers
      else if (num === 3 || num === 6) score += 18; // Creative/nurturing numbers
      else if (num === 2 || num === 7) score += 15; // Intuitive numbers
      else score += 10; // Base score
    });
    
    return score;
  };

  const handleAnalyze = async () => {
    const validNames = candidateNames.filter(name => name.trim() !== "");
    
    if (!birthDate || validNames.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha a data de nascimento e pelo menos um nome.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const promises = validNames.map(async (name) => {
        const { data, error } = await supabase.functions.invoke('calculate-numerology', {
          body: { name: name.trim(), birth: birthDate }
        });
        
        if (error) throw error;
        
        const score = calculateScore(data.expressao, data.motivacao, data.impressao, data.destino);
        
        return {
          nome: name.trim(),
          expressao: data.expressao,
          motivacao: data.motivacao,
          impressao: data.impressao,
          destino: data.destino,
          pontuacao: score
        };
      });

      const results = await Promise.all(promises);
      // Sort by score (highest first)
      const sortedResults = results.sort((a, b) => b.pontuacao - a.pontuacao);
      setAnalyses(sortedResults);

      toast({
        title: "Análise concluída",
        description: `${validNames.length} nomes analisados com sucesso!`,
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

  const getBestNameBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500"><Star className="w-3 h-3 mr-1" />Melhor</Badge>;
    if (index === 1) return <Badge variant="secondary">2º Lugar</Badge>;
    if (index === 2) return <Badge variant="outline">3º Lugar</Badge>;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Baby className="h-8 w-8 text-primary" />
            Mapas Infantis
          </h1>
          <p className="text-muted-foreground">
            Simulador de nomes para bebês com análise numerológica
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Dados do Bebê
            </CardTitle>
            <CardDescription>
              Insira a data prevista de nascimento e os nomes candidatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data Prevista de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Nomes Candidatos</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNameField}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Nome
                </Button>
              </div>

              {candidateNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => updateName(index, e.target.value)}
                    placeholder={`Nome candidato ${index + 1}`}
                  />
                  {candidateNames.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeNameField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Analisando..." : "Analisar Nomes"}
            </Button>
          </CardContent>
        </Card>

        {analyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ranking dos Nomes</CardTitle>
              <CardDescription>
                Nomes ordenados pela pontuação numerológica (melhor para o pior)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyses.map((analysis, index) => (
                  <Card key={index} className={index === 0 ? "border-yellow-500 bg-yellow-50/50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{analysis.nome}</h3>
                          {getBestNameBadge(index)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{analysis.pontuacao}</div>
                          <div className="text-sm text-muted-foreground">pontos</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold">{analysis.expressao}</div>
                          <div className="text-sm text-muted-foreground">Expressão</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">{analysis.motivacao}</div>
                          <div className="text-sm text-muted-foreground">Motivação</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">{analysis.impressao}</div>
                          <div className="text-sm text-muted-foreground">Impressão</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">{analysis.destino}</div>
                          <div className="text-sm text-muted-foreground">Destino</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}