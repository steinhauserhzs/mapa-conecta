import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Calculator, Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { CompleteNumerologyResult } from "./CompleteNumerologyResult";

interface NumerologyFormData {
  name: string;
  birth: Date;
}

interface CompleteNumerologyResult {
  header: {
    titulo: string;
    subtitulo: string;
    nome: string;
    dataNascimento: string;
    dataGeracao: string;
    orientacao: string;
  };
  numeros: any;
  complementares: any;
  metadados: {
    versaoConteudo: string;
    totalTextos: number;
    angeloEncontrado: boolean;
    calculosCompletos: boolean;
  };
}

export const NumerologyCalculator = () => {
  const [result, setResult] = useState<CompleteNumerologyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [date, setDate] = useState<Date>();

  const { register, handleSubmit, formState: { errors } } = useForm<NumerologyFormData>();

  const onSubmit = async (data: NumerologyFormData) => {
    if (!date) {
      toast.error("Por favor, selecione a data de nascimento");
      return;
    }

    setIsCalculating(true);
    try {
      const birthFormatted = format(date, "yyyy-MM-dd");
      
      // Usar generate-map para obter o mapa completo
      const { data: response, error } = await supabase.functions.invoke('generate-map', {
        body: {
          name: data.name,
          birth: birthFormatted
        }
      });

      if (error) {
        console.error('Erro na função generate-map:', error);
        setIsOnlineMode(false);
        toast.error("Erro ao gerar mapa numerológico completo. Sistema offline temporariamente.");
        return;
      }

      if (response && response.metadados) {
        setResult(response);
        setIsOnlineMode(true);
        
        const completeness = response.metadados.totalTextos > 0 ? "completo" : "básico";
        toast.success(`Mapa numerológico ${completeness} gerado com sucesso!`);
        
        // Validação do teste interno
        if (response.metadados.calculosCompletos) {
          console.log('✅ Mapa gerado com cálculos completos');
        }
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no cálculo:', error);
      setIsOnlineMode(false);
      toast.error("Erro ao calcular numerologia. Verifique sua conexão.");
    } finally {
      setIsCalculating(false);
    }
  };

  const exportJSON = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapa-numerologico-${result.header?.nome?.replace(/\s+/g, '-') || 'resultado'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Mapa exportado como JSON!");
  };

  const exportPDF = async () => {
    if (!result) return;
    
    try {
      const { data: pdfData, error } = await supabase.functions.invoke('generate-professional-pdf', {
        body: {
          mapaContent: result,
          fileName: `mapa-numerologico-${result.header?.nome?.replace(/\s+/g, '-') || 'resultado'}`
        }
      });

      if (error) throw error;
      
      if (pdfData?.pdfUrl) {
        window.open(pdfData.pdfUrl, '_blank');
        toast.success("PDF gerado com sucesso!");
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Gerador de Mapa Numerológico Completo
          </CardTitle>
          <CardDescription>
            Gere seu mapa numerológico cabalístico completo com mais de 20 páginas de orientações
            {!isOnlineMode && (
              <div className="mt-2 text-sm text-amber-600 font-medium">
                ⚠️ Sistema em modo offline - mapas limitados disponíveis
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                {...register("name", { required: "Nome é obrigatório" })}
                placeholder="Digite seu nome completo (mantenha acentos e sinais)"
                className="font-medium"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              disabled={isCalculating || !isOnlineMode}
              className="w-full"
              size="lg"
            >
              {isCalculating ? "Gerando Mapa Completo..." : "Gerar Mapa Numerológico"}
            </Button>
            {!isOnlineMode && (
              <p className="text-xs text-muted-foreground text-center">
                Aguarde a reconexão para gerar mapas completos
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {result && (
        <>
          <CompleteNumerologyResult result={result} />
          <Card>
            <CardHeader>
              <CardTitle>Exportar Mapa</CardTitle>
              <CardDescription>
                Baixe seu mapa numerológico em diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={exportJSON}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar JSON
                </Button>
                <Button
                  onClick={exportPDF}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!isOnlineMode}
                >
                  <FileDown className="h-4 w-4" />
                  Gerar PDF Profissional
                </Button>
              </div>
              {!isOnlineMode && (
                <p className="text-xs text-muted-foreground mt-2">
                  PDF disponível apenas no modo online
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};