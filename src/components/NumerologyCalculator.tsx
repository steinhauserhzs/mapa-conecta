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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [manualDate, setManualDate] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<NumerologyFormData>();

  const constructDateFromInputs = (): Date | null => {
    if (manualDate) {
      // Tentar parsing da data manual no formato DD/MM/YYYY
      const dateParts = manualDate.split('/');
      if (dateParts.length === 3) {
        const parsedDay = parseInt(dateParts[0]);
        const parsedMonth = parseInt(dateParts[1]) - 1; // Mês é 0-indexed
        const parsedYear = parseInt(dateParts[2]);
        if (!isNaN(parsedDay) && !isNaN(parsedMonth) && !isNaN(parsedYear)) {
          return new Date(parsedYear, parsedMonth, parsedDay);
        }
      }
    }
    
    if (day && month && year) {
      const parsedDay = parseInt(day);
      const parsedMonth = parseInt(month) - 1; // Mês é 0-indexed
      const parsedYear = parseInt(year);
      if (!isNaN(parsedDay) && !isNaN(parsedMonth) && !isNaN(parsedYear)) {
        return new Date(parsedYear, parsedMonth, parsedDay);
      }
    }
    
    return date;
  };

  const onSubmit = async (data: NumerologyFormData) => {
    const finalDate = constructDateFromInputs();
    
    if (!finalDate) {
      toast.error("Por favor, selecione ou digite uma data de nascimento válida");
      return;
    }

    setIsCalculating(true);
    try {
      const birthFormatted = format(finalDate, "yyyy-MM-dd");
      
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

            <div className="space-y-4">
              <Label>Data de Nascimento</Label>
              
              {/* Entrada Manual */}
              <div className="space-y-2">
                <Label htmlFor="manual-date" className="text-sm text-muted-foreground">
                  Digite manualmente (DD/MM/YYYY)
                </Label>
                <Input
                  id="manual-date"
                  placeholder="Ex: 11/05/2000"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="font-mono"
                />
              </div>

              {/* Separador */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-xs text-muted-foreground">OU</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Seletores Separados */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Selecione separadamente
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="day" className="text-xs">Dia</Label>
                    <Select value={day} onValueChange={setDay}>
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="month" className="text-xs">Mês</Label>
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="1">Janeiro</SelectItem>
                        <SelectItem value="2">Fevereiro</SelectItem>
                        <SelectItem value="3">Março</SelectItem>
                        <SelectItem value="4">Abril</SelectItem>
                        <SelectItem value="5">Maio</SelectItem>
                        <SelectItem value="6">Junho</SelectItem>
                        <SelectItem value="7">Julho</SelectItem>
                        <SelectItem value="8">Agosto</SelectItem>
                        <SelectItem value="9">Setembro</SelectItem>
                        <SelectItem value="10">Outubro</SelectItem>
                        <SelectItem value="11">Novembro</SelectItem>
                        <SelectItem value="12">Dezembro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="year" className="text-xs">Ano</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Ano" />
                      </SelectTrigger>
                      <SelectContent className="bg-background max-h-[200px]">
                        {Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-xs text-muted-foreground">OU</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Calendário */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Selecione no calendário
                </Label>
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
                      {date ? format(date, "dd/MM/yyyy") : <span>Selecionar no calendário</span>}
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