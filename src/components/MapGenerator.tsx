import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Download, FileText, Loader2, Edit3, RotateCcw, Save } from 'lucide-react';
import { format } from 'date-fns';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTextos, setEditedTextos] = useState<MapaData['textos'] | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearRef: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    console.log('🔄 Iniciando geração do mapa no cliente...', data);
    
    try {
      const birthString = format(data.birth, 'yyyy-MM-dd');
      console.log('📅 Data formatada:', birthString);
      
      const requestBody = {
        name: data.name,
        birth: birthString,
        yearRef: data.yearRef,
      };
      console.log('📤 Enviando request:', requestBody);
      
      const { data: result, error } = await supabase.functions.invoke('generate-map', {
        body: requestBody,
      });

      console.log('📥 Resposta recebida:', { result, error });

      if (error) {
        console.error('❌ Erro da função:', error);
        throw error;
      }

      if (!result) {
        console.error('❌ Resultado vazio');
        throw new Error('Nenhum resultado retornado');
      }

      console.log('✅ Mapa gerado com sucesso:', result);
      setMapaData(result);
      setEditedTextos(result.textos);
      setIsEditing(false);
      
      toast({
        title: 'Mapa gerado com sucesso!',
        description: 'Seu mapa numerológico está pronto.',
      });
    } catch (error: any) {
      console.error('💥 Erro completo ao gerar mapa:', error);
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
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          scrollX: 0,
          scrollY: 0
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

  const startEditing = () => {
    setIsEditing(true);
  };

  const endEditing = () => {
    setIsEditing(false);
  };

  const restoreOriginals = () => {
    if (mapaData) {
      setEditedTextos(mapaData.textos);
      toast({
        title: 'Textos restaurados',
        description: 'Os textos originais foram restaurados.',
      });
    }
  };

  const saveChanges = () => {
    toast({
      title: 'Alterações salvas',
      description: 'As modificações foram aplicadas no preview.',
    });
  };

  const updateEditedText = (section: keyof MapaData['textos'], field: 'title' | 'body', value: string) => {
    if (editedTextos) {
      setEditedTextos({
        ...editedTextos,
        [section]: {
          ...editedTextos[section],
          [field]: value
        }
      });
    }
  };

  const currentTextos = editedTextos || mapaData?.textos;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mapas Numerológicos</h1>
          <p className="text-muted-foreground">
            Gere e edite mapas numerológicos personalizados
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
                    <EnhancedDatePicker
                      date={form.watch('birth')}
                      onDateChange={(date) => form.setValue('birth', date!)}
                      placeholder="Selecione a data de nascimento"
                      className="w-full"
                    />
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

            {/* Controles de Edição e Export */}
            {mapaData && (
              <>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Edição de Conteúdo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!isEditing ? (
                      <Button 
                        onClick={startEditing} 
                        className="w-full" 
                        variant="outline"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Ativar Edição
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={saveChanges} 
                          className="w-full"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </Button>        
                        <Button 
                          onClick={restoreOriginals} 
                          className="w-full" 
                          variant="outline"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restaurar Originais
                        </Button>
                        <Button 
                          onClick={endEditing} 
                          className="w-full" 
                          variant="secondary"
                        >
                          Finalizar Edição
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

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
              </>
            )}
          </div>

          {/* Preview do Mapa e Editor */}
          <div className="lg:col-span-2">
            {mapaData ? (
              <div className="space-y-6">
                {/* Editor de Textos */}
                {isEditing && currentTextos && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit3 className="w-5 h-5" />
                        Editor de Conteúdo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="motivacao" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="motivacao">Motivação</TabsTrigger>
                          <TabsTrigger value="expressao">Expressão</TabsTrigger>
                          <TabsTrigger value="impressao">Impressão</TabsTrigger>
                          <TabsTrigger value="destino">Destino</TabsTrigger>
                          <TabsTrigger value="ano_pessoal">Ano Pessoal</TabsTrigger>
                        </TabsList>
                        
                        {Object.entries(currentTextos).map(([key, value]) => (
                          <TabsContent key={key} value={key} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${key}-title`}>Título</Label>
                              <Input
                                id={`${key}-title`}
                                value={value.title}
                                onChange={(e) => updateEditedText(key as keyof MapaData['textos'], 'title', e.target.value)}
                                placeholder="Título da seção"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${key}-body`}>Conteúdo</Label>
                              <Textarea
                                id={`${key}-body`}
                                value={value.body}
                                onChange={(e) => updateEditedText(key as keyof MapaData['textos'], 'body', e.target.value)}
                                placeholder="Conteúdo da seção"
                                rows={8}
                                className="resize-none"
                              />
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

                {/* Preview */}
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Preview do Mapa</h3>
                    <p className="text-sm text-muted-foreground">
                      {isEditing ? 'Modo de edição ativo - alterações são refletidas em tempo real' : 'Role para ver o mapa completo ou exporte em PDF'}
                    </p>
                  </div>
                  <div className="max-h-[800px] overflow-y-auto">
                    <div className="transform scale-50 origin-top-left" style={{ width: '200%' }}>
                      <MapaPDF 
                        data={{
                          ...mapaData,
                          textos: currentTextos || mapaData.textos
                        }} 
                      />
                    </div>
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