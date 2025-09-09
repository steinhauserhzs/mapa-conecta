import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import MapaPDF from './MapaPDF';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/hooks/use-toast';

// Schema de validação
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
    numero_psiquico?: number;
    dia_nascimento_natural?: number;
    dia_nascimento_reduzido?: number;
    grau_ascensao?: number;
  };
  textos: Record<string, {
    title: string;
    body: string;
  }>;
  debug?: any;
}

export default function MapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [mapaData, setMapaData] = useState<MapaData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTextos, setEditedTextos] = useState<Record<string, { title: string; body: string }>>({});

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
      setEditedTextos(result.textos || {});
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
      const element = document.getElementById('mapa-para-pdf');
      if (!element) throw new Error('Elemento do mapa não encontrado');

      const opt = {
        margin: 0.5,
        filename: `mapa-numerologico-${mapaData.header.name.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: 'PDF exportado com sucesso!',
        description: 'O arquivo foi baixado para seu computador.',
      });
    } catch (error) {
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
      description: 'Os dados foram salvos em formato JSON.',
    });
  };

  const startEditing = () => {
    if (mapaData?.textos) {
      setEditedTextos({ ...mapaData.textos });
      setIsEditing(true);
    }
  };

  const saveChanges = () => {
    if (mapaData && editedTextos) {
      setMapaData({ ...mapaData, textos: editedTextos });
      setIsEditing(false);
      toast({
        title: 'Alterações salvas',
        description: 'Seus textos foram atualizados com sucesso.',
      });
    }
  };

  const restoreOriginals = () => {
    if (mapaData?.textos) {
      setEditedTextos({ ...mapaData.textos });
      toast({
        title: 'Textos restaurados',
        description: 'Os textos originais foram restaurados.',
      });
    }
  };

  const updateEditedText = (section: string, field: 'title' | 'body', value: string) => {
    setEditedTextos(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Get current texts (edited if available, otherwise original)
  const currentTextos = mapaData ? { ...mapaData.textos, ...editedTextos } : {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Gerador de Mapas Numerológicos</h1>
          <p className="text-muted-foreground">
            Crie mapas numerológicos completos com cálculos baseados na numerologia cabalística
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Dados para o Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome completo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione a data de nascimento</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano de Referência (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={new Date().getFullYear().toString()}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? 'Gerando Mapa...' : 'Gerar Mapa Numerológico'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Controles de Edição e Exportação */}
          {mapaData && (
            <Card>
              <CardHeader>
                <CardTitle>Controles do Mapa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <Button onClick={startEditing} variant="outline" className="w-full">
                    Editar Textos
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={saveChanges} className="w-full">
                      Salvar Alterações
                    </Button>
                    <Button onClick={restoreOriginals} variant="outline" className="w-full">
                      Restaurar Originais
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" className="w-full">
                      Cancelar Edição
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={exportToPDF} 
                    disabled={isExportingPDF}
                    variant="secondary"
                    className="flex-1"
                  >
                    {isExportingPDF ? 'Exportando...' : 'Exportar PDF'}
                  </Button>
                  <Button 
                    onClick={exportToJSON} 
                    variant="outline"
                    className="flex-1"
                  >
                    Exportar JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview/Editor */}
        <div className="mt-8">
          {mapaData ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <MapaPDF data={{ ...mapaData, textos: currentTextos }} />
              </div>

              {isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editor de Textos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={Object.keys(currentTextos)[0]} className="w-full">
                      <TabsList className="grid grid-cols-5 mb-4">
                        {Object.keys(currentTextos).slice(0, 5).map((section) => (
                          <TabsTrigger key={section} value={section} className="capitalize">
                            {section.replace('_', ' ')}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {Object.entries(currentTextos).slice(0, 5).map(([section, content]) => (
                        <TabsContent key={section} value={section} className="space-y-4">
                          <div>
                            <Label htmlFor={`title-${section}`}>Título</Label>
                            <Input
                              id={`title-${section}`}
                              value={editedTextos[section]?.title || content.title}
                              onChange={(e) => updateEditedText(section, 'title', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`body-${section}`}>Conteúdo</Label>
                            <Textarea
                              id={`body-${section}`}
                              value={editedTextos[section]?.body || content.body}
                              onChange={(e) => updateEditedText(section, 'body', e.target.value)}
                              className="mt-1 min-h-[200px]"
                              placeholder={`Edite o conteúdo da seção ${section}...`}
                            />
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                    
                    {/* Additional sections if more than 5 */}
                    {Object.keys(currentTextos).length > 5 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Seções Adicionais</h3>
                        {Object.entries(currentTextos).slice(5).map(([section, content]) => (
                          <div key={section} className="mb-6 p-4 border rounded-lg">
                            <h4 className="font-medium capitalize mb-2">{section.replace('_', ' ')}</h4>
                            <div className="space-y-2">
                              <div>
                                <Label htmlFor={`title-${section}`}>Título</Label>
                                <Input
                                  id={`title-${section}`}
                                  value={editedTextos[section]?.title || content.title}
                                  onChange={(e) => updateEditedText(section, 'title', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`body-${section}`}>Conteúdo</Label>
                                <Textarea
                                  id={`body-${section}`}
                                  value={editedTextos[section]?.body || content.body}
                                  onChange={(e) => updateEditedText(section, 'body', e.target.value)}
                                  className="mt-1 min-h-[150px]"
                                  placeholder={`Edite o conteúdo da seção ${section}...`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">Preencha os dados acima para gerar seu mapa numerológico</p>
                  <p className="text-sm">O mapa será exibido aqui assim que for gerado</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}