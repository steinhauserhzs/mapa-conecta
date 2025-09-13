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
import { ProfessionalNumerologyMap } from "./ProfessionalNumerologyMap";

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
  const [result, setResult] = useState<any>(null);
  const [texts, setTexts] = useState<{ [key: string]: any }>({});
  const [angel, setAngel] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [birthDate, setBirthDate] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<NumerologyFormData>();

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    // Tentar parsing da data no formato DD/MM/YYYY
    const dateParts = dateStr.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexed
      const year = parseInt(dateParts[2]);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
          day >= 1 && day <= 31 && 
          month >= 0 && month <= 11 && 
          year >= 1900 && year <= new Date().getFullYear()) {
        return new Date(year, month, day);
      }
    }
    
    return null;
  };

  const onSubmit = async (data: NumerologyFormData) => {
    const finalDate = parseDate(birthDate);
    
    if (!finalDate) {
      toast.error("Por favor, digite uma data válida no formato DD/MM/YYYY");
      return;
    }

    setIsCalculating(true);
    try {
      // Format date for the API (DD/MM/YYYY)
      const formattedDate = format(finalDate, "dd/MM/yyyy");
      
      console.log("Chamando generate-map com:", { name: data.name, birth: formattedDate });

      // Call the Supabase function
      const { data: mapData, error } = await supabase.functions.invoke('generate-map', {
        body: { 
          name: data.name, 
          birth: formattedDate 
        }
      });

      if (error) {
        console.error('Erro na função generate-map:', error);
        toast.error("Erro ao gerar mapa numerológico. Tente novamente.");
        return;
      }

      console.log("Resposta recebida:", mapData);

      // Fetch numerology texts from database
      const { data: numerologyTexts, error: textsError } = await supabase
        .from('numerology_texts')
        .select('*');

      if (textsError) {
        console.warn("Erro ao carregar textos:", textsError);
      }

      // Fetch angel information
      let angelData = null;
      if (mapData?.anjoEspecial) {
        const { data: angelResult, error: angelError } = await supabase
          .from('cabalistic_angels')
          .select('*')
          .eq('name', mapData.anjoEspecial)
          .maybeSingle();

        if (!angelError && angelResult) {
          angelData = angelResult;
        }
      }

      // Create texts lookup object
      const textsLookup: { [key: string]: any } = {};
      if (numerologyTexts) {
        numerologyTexts.forEach((text) => {
          const key = `${text.section}-${text.key_number}`;
          textsLookup[key] = text;
        });
      }

      // Prepare comprehensive result for ProfessionalNumerologyMap
      const comprehensiveResult = {
        nome: data.name,
        dataNascimento: formattedDate,
        motivacao: mapData.numeros?.motivacao || 0,
        impressao: mapData.numeros?.impressao || 0,
        expressao: mapData.numeros?.expressao || 0,
        destino: mapData.numeros?.destino || 0,
        missao: mapData.numeros?.missao || 0,
        psiquico: mapData.numeros?.psiquico || 0,
        licoesCarmicas: mapData.numeros?.licoesCarmicas || [],
        dividasCarmicas: mapData.numeros?.dividasCarmicas || [],
        tendenciasOcultas: mapData.numeros?.tendenciasOcultas || [],
        respostaSubconsciente: mapData.numeros?.respostaSubconsciente || 0,
        ciclosVida: mapData.numeros?.ciclosVida || [],
        desafios: mapData.numeros?.desafios || [],
        momentos: mapData.numeros?.momentos || [],
        anoPessoal: mapData.complementares?.anoPessoal || 0,
        mesPessoal: mapData.complementares?.mesPessoal || 0,
        diaPessoal: mapData.complementares?.diaPessoal || 0,
        anjoEspecial: mapData.anjoEspecial
      };

      setResult(comprehensiveResult);
      setTexts(textsLookup);
      setAngel(angelData);
      setIsOnlineMode(true);

      toast.success("Mapa numerológico profissional gerado com sucesso!");

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
              <Label htmlFor="birth-date">Data de Nascimento</Label>
              <div className="flex gap-2">
                <Input
                  id="birth-date"
                  placeholder="DD/MM/YYYY (Ex: 11/05/2000)"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="flex-1 font-mono"
                  maxLength={10}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      type="button"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={parseDate(birthDate)}
                      onSelect={(date) => {
                        if (date) {
                          setBirthDate(format(date, "dd/MM/yyyy"));
                        }
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">
                Digite a data ou clique no calendário para selecionar
              </p>
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
          <div className="flex flex-wrap gap-2 justify-center mb-6">
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
          
          <ProfessionalNumerologyMap 
            result={result} 
            texts={texts} 
            angel={angel} 
          />
        </>
      )}
    </div>
  );
};