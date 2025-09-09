import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MapaPDF from './MapaPDF';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birth: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  yearRef: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MapaData {
  header: {
    name: string;
    birth: string;
    anoReferencia: number;
    dataGeracao: string;
  };
  numeros: {
    expressao: number;
    motivacao: number;
    impressao: number;
    destino: number;
    ano_pessoal: number;
  };
  textos: {
    motivacao: { title: string; body: string };
    expressao: { title: string; body: string };
    impressao: { title: string; body: string };
    destino: { title: string; body: string };
    ano_pessoal: { title: string; body: string };
  };
  debug?: any;
}

export default function MapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [mapaData, setMapaData] = useState<MapaData | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearRef: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const birthString = format(data.birth, 'yyyy-MM-dd');
      
      const { data: result, error } = await supabase.functions.invoke('generate-map', {
        body: {
          name: data.name,
          birth: birthString,
          yearRef: data.yearRef,
        },
      });

      if (error) throw error;

      setMapaData(result);
      
      toast({
        title: 'Mapa gerado com sucesso!',
        description: 'Seu mapa numerológico está pronto.',
      });
    } catch (error: any) {
      console.error('Erro ao gerar mapa:', error);
      toast({
        title: 'Erro ao gerar mapa',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (!mapaData) return;
    
    setIsExportingPDF(true);
    try {
      const element = document.getElementById('mapa-pdf');
      if (!element) throw new Error('Elemento do mapa não encontrado');

      const opt = {
        margin: 0,
        filename: `mapa-numerologico-${mapaData.header.name.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: 'PDF exportado com sucesso!',
        description: 'O arquivo foi baixado para seu computador.',
      });
    } catch (error: any) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: 'Erro ao exportar PDF',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportToJSON = () => {
    if (!mapaData) return;
    
    const dataStr = JSON.stringify(mapaData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mapa-numerologico-${mapaData.header.name.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'JSON exportado com sucesso!',
      description: 'O arquivo foi baixado para seu computador.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Gerador de Mapa Numerológico</h1>
          <p className="text-muted-foreground text-lg">
            Sistema completo de geração de mapas cabalísticos profissionais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados para o Mapa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="Digite o nome completo"
                      className="w-full"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
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
                            !form.watch('birth') && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch('birth') ? (
                            format(form.watch('birth'), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            "Selecione a data"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.watch('birth')}
                          onSelect={(date) => form.setValue('birth', date!)}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.birth && (
                      <p className="text-sm text-destructive">{form.formState.errors.birth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearRef">Ano de Referência (opcional)</Label>
                    <Input
                      id="yearRef"
                      type="number"
                      {...form.register('yearRef', { valueAsNumber: true })}
                      placeholder={new Date().getFullYear().toString()}
                      min="1900"
                      max="2100"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Mapa...
                      </>
                    ) : (
                      'Gerar Mapa Numerológico'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Botões de Export */}
            {mapaData && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Exportar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={exportToPDF} 
                    className="w-full" 
                    variant="default"
                    disabled={isExportingPDF}
                  >
                    {isExportingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando PDF...
                      </>
                    ) : (
                      'Baixar PDF'
                    )}
                  </Button>
                  <Button 
                    onClick={exportToJSON} 
                    className="w-full" 
                    variant="outline"
                  >
                    Baixar JSON
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview do Mapa */}
          <div className="lg:col-span-2">
            {mapaData ? (
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Preview do Mapa</h3>
                  <p className="text-sm text-muted-foreground">
                    Role para ver o mapa completo ou exporte em PDF
                  </p>
                </div>
                <div className="max-h-[800px] overflow-y-auto">
                  <div className="transform scale-50 origin-top-left" style={{ width: '200%' }}>
                    <MapaPDF data={mapaData} />
                  </div>
                </div>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Preencha os dados e gere seu mapa</p>
                  <p className="text-sm">O preview aparecerá aqui após a geração</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}