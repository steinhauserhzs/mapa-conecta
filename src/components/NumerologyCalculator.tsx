import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Calculator, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface NumerologyFormData {
  name: string;
  birth: Date;
}

interface NumerologyResult {
  expressao: number;
  motivacao: number;
  impressao: number;
  destino: number;
  detalhado: {
    letras: Array<{
      char: string;
      baseChar: string;
      base: number;
      marks: any;
      valor_final: number;
    }>;
    somas: {
      todas: number;
      vogais: number;
      consoantes: number;
    };
  };
}

export const NumerologyCalculator = () => {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
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
      
      const { data: response, error } = await supabase.functions.invoke('calculate-numerology', {
        body: {
          name: data.name,
          birth: birthFormatted
        }
      });

      if (error) {
        throw error;
      }

      setResult(response);
      toast.success("Cálculo realizado com sucesso!");
    } catch (error) {
      console.error('Erro no cálculo:', error);
      toast.error("Erro ao calcular numerologia");
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
    link.download = 'numerologia-resultado.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Numerologia Cabalística
          </CardTitle>
          <CardDescription>
            Insira seu nome completo e data de nascimento para calcular sua numerologia
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
              disabled={isCalculating}
              className="w-full"
              size="lg"
            >
              {isCalculating ? "Calculando..." : "Calcular Numerologia"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Seus Números</CardTitle>
            <CardDescription>
              Resultados da análise numerológica cabalística
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.expressao}</div>
                <div className="text-sm font-medium">Expressão</div>
                <div className="text-xs text-muted-foreground">
                  Soma: {result.detalhado.somas.todas}
                </div>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{result.motivacao}</div>
                <div className="text-sm font-medium">Motivação</div>
                <div className="text-xs text-muted-foreground">
                  Soma: {result.detalhado.somas.vogais}
                </div>
              </div>
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-accent">{result.impressao}</div>
                <div className="text-sm font-medium">Impressão</div>
                <div className="text-xs text-muted-foreground">
                  Soma: {result.detalhado.somas.consoantes}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{result.destino}</div>
                <div className="text-sm font-medium">Destino</div>
                <div className="text-xs text-muted-foreground">Data nascimento</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Detalhamento das Letras:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                {result.detalhado.letras.map((letra, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted/50 rounded text-center"
                  >
                    <div className="font-bold">{letra.char}</div>
                    <div className="text-muted-foreground">
                      {letra.base}
                      {letra.valor_final !== letra.base && (
                        <span> → {letra.valor_final}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={exportJSON}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};