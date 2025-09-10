import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Calculator, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmpresaAnalysis {
  nomeEmpresa: string;
  expressao: number;
  motivacao: number;
  impressao: number;
  destino: number;
  textos: any;
}

export default function MapasEmpresariais() {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [analysis, setAnalysis] = useState<EmpresaAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!nomeEmpresa.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome da empresa.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use the same numerology calculation logic but with business context
      const { data, error } = await supabase.functions.invoke('calculate-numerology', {
        body: { 
          name: nomeEmpresa,
          birth: "01/01/2000", // Default birth for business
          type: "empresarial"
        }
      });

      if (error) throw error;

      setAnalysis({
        nomeEmpresa,
        expressao: data.expressao,
        motivacao: data.motivacao,
        impressao: data.impressao,
        destino: data.destino,
        textos: data.textos
      });

      toast({
        title: "Análise concluída",
        description: "Mapa empresarial gerado com sucesso!",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Mapas Empresariais
          </h1>
          <p className="text-muted-foreground">
            Análise numerológica para empresas e negócios
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Insira o nome da empresa para análise numerológica empresarial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                placeholder="Digite o nome completo da empresa"
              />
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Analisando..." : "Gerar Análise Empresarial"}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Análise Numerológica - {analysis.nomeEmpresa}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{analysis.expressao}</div>
                  <div className="text-sm text-muted-foreground">Expressão</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{analysis.motivacao}</div>
                  <div className="text-sm text-muted-foreground">Motivação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{analysis.impressao}</div>
                  <div className="text-sm text-muted-foreground">Impressão</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{analysis.destino}</div>
                  <div className="text-sm text-muted-foreground">Destino</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Perfil Empresarial</h3>
                <p className="text-muted-foreground">
                  A análise numerológica indica que esta empresa possui características únicas
                  baseadas na vibração do seu nome comercial, proporcionando insights valiosos
                  para estratégias de negócio e posicionamento no mercado.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}