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
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
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

// -------- Fallback de cálculo no cliente --------
const MASTER = new Set([11, 22]);
const VOWELS = new Set(['A','E','I','O','U','Y']);

function analyzeChar(raw: string) {
  if (!raw) return null;
  const nfd = raw.normalize('NFD');
  const m = nfd.toUpperCase().match(/[A-Z]|Ç/);
  if (!m) return null;
  const baseChar = m[0];
  return {
    baseChar,
    marks: {
      apostrophe: /['']/.test(raw),
      circumflex: /[\u0302]|\^/.test(nfd),
      ring: /[\u030A]|\u02DA/.test(nfd),
      tilde: /[\u0303]|~/.test(nfd),
      diaeresis: /[\u0308]|\u00A8/.test(nfd),
      grave: /[\u0300]|`/.test(nfd)
    }
  };
}

function applyMods(v: number, m: any) {
  let val = v;
  if (m.apostrophe) val += 2;
  if (m.circumflex) val += 7;
  if (m.ring) val += 7;
  if (m.tilde) val += 3;
  if (m.diaeresis) val *= 2;
  if (m.grave) val *= 2;
  return val;
}

function letterValue(ch: string, baseMap: Record<string, number>) {
  const info = analyzeChar(ch);
  if (!info) return null;
  const base = baseMap[info.baseChar as keyof typeof baseMap];
  if (!base) return null;
  return { ...info, base, value: applyMods(base, info.marks), raw: ch };
}

function sumLetters(str: string, baseMap: Record<string, number>, filter: (ch: string) => boolean = () => true) {
  let total = 0;
  for (const ch of [...str]) {
    const lv = letterValue(ch, baseMap);
    if (!lv) continue;
    if (filter(lv.baseChar)) total += lv.value;
  }
  return total;
}

function reduce(n: number): number {
  if (n <= 0) return 0;
  if (MASTER.has(n)) return n;
  while (n > 9 && !MASTER.has(n)) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
    if (MASTER.has(n)) return n;
  }
  return n;
}

function parseBirth(b: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(b)) { 
    const [y, m, d] = b.split('-').map(Number); 
    return { d, m, y }; 
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(b)) { 
    const [d, m, y] = b.split('/').map(Number); 
    return { d, m, y }; 
  }
  return null;
}

function sumBirth({ d, m, y }: { d: number, m: number, y: number }) {
  return (String(d) + String(m) + String(y)).split('').reduce((a, c) => a + Number(c), 0);
}

async function computeOnClient(name: string, birthStr: string, yearRef?: number): Promise<MapaData> {
  // Buscar tabela de conversão
  const { data: conv } = await supabase
    .from('conversion_tables')
    .select('mapping')
    .eq('is_default', true)
    .eq('locale', 'pt-BR')
    .maybeSingle();
  const FALLBACK: Record<string, number> = { A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1, J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2, S:3, T:4, U:6, V:6, W:6, X:6, Y:1, Z:7, 'Ç':8 };
  const baseMap = (conv?.mapping as Record<string, number>) || FALLBACK;

  const nm = String(name || '').trim();
  const b = parseBirth(birthStr);
  if (!b) throw new Error('Data de nascimento inválida');

  const all = sumLetters(nm, baseMap);
  const vow = sumLetters(nm, baseMap, (ch: string) => VOWELS.has(ch));
  const cons = sumLetters(nm, baseMap, (ch: string) => !VOWELS.has(ch));

  const expressao = reduce(all);
  const motivacao = reduce(vow);
  const impressao = reduce(cons);
  const destino = reduce(sumBirth(b));
  const numero_psiquico = reduce(b.d);
  const dia_nascimento_natural = b.d;
  const dia_nascimento_reduzido = reduce(b.d);
  const grau_ascensao = reduce(expressao + destino);

  const ano = yearRef ?? new Date().getFullYear();
  const ano_pessoal = reduce(b.d + b.m + ano);

  // Buscar todos os textos
  const { data: todosTextos } = await supabase
    .from('numerology_texts')
    .select('section, key_number, title, body')
    .eq('lang', 'pt-BR');
  const textosMap = (todosTextos || []).reduce((acc: any, t: any) => {
    acc[`${t.section}_${t.key_number}`] = t;
    return acc;
  }, {} as Record<string, any>);

  const getText = (section: string, key: number, fallbackTitle: string) =>
    textosMap[`${section}_${key}`] || { title: `${fallbackTitle} ${key}`, body: 'Conteúdo em desenvolvimento.' };

  const textos: any = {
    motivacao: getText('motivacao', motivacao, 'Motivação'),
    expressao: getText('expressao', expressao, 'Expressão'),
    impressao: getText('impressao', impressao, 'Impressão'),
    destino: getText('destino', destino, 'Destino'),
    ano_pessoal: getText('ano_pessoal', ano_pessoal, 'Ano Pessoal'),
    numero_psiquico: getText('Número Psíquico', numero_psiquico, 'Número Psíquico'),
    dia_nascimento: getText('Dia do Nascimento', dia_nascimento_natural, 'Dia do Nascimento'),
    grau_ascensao: getText('Grau de Ascensão', grau_ascensao, 'Grau de Ascensão'),
  };

  return {
    header: {
      name,
      birth: birthStr,
      anoReferencia: ano,
      dataGeracao: new Date().toISOString(),
    },
    numeros: {
      expressao, motivacao, impressao, destino, ano_pessoal,
      numero_psiquico, dia_nascimento_natural, dia_nascimento_reduzido, grau_ascensao,
    },
    textos,
  } as MapaData;
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
      
      // Timeout de 10s para a função edge
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao chamar a função')), 10000));

      let result: any = null;
      let error: any = null;
      try {
        const resp: any = await Promise.race([
          supabase.functions.invoke('generate-map', { body: requestBody }),
          timeoutPromise,
        ]);
        if (resp && 'data' in resp) {
          result = resp.data;
          error = resp.error;
        } else {
          error = resp;
        }
      } catch (e) {
        error = e;
      }

      console.log('📥 Resposta recebida:', { result, error });

      if (error || !result) {
        console.warn('⚠️ Falha na função edge, usando fallback no cliente...', error);
        const fallback = await computeOnClient(data.name, birthString, data.yearRef);
        setMapaData(fallback);
        setEditedTextos(fallback.textos || {});
        setIsEditing(false);
        toast({ title: 'Mapa gerado (modo offline)', description: 'Usamos cálculo local como fallback.' });
        return;
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Digite o nome completo"
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birth">Data de Nascimento</Label>
                  <EnhancedDatePicker
                    date={form.watch('birth')}
                    onDateChange={(date) => form.setValue('birth', date)}
                    placeholder="Selecione a data"
                    className="mt-1 w-full"
                  />
                  {form.formState.errors.birth && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.birth.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="yearRef">Ano de Referência (Opcional)</Label>
                  <Input
                    id="yearRef"
                    type="number"
                    {...form.register('yearRef', { valueAsNumber: true })}
                    placeholder={new Date().getFullYear().toString()}
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Gerando Mapa...' : 'Gerar Mapa Numerológico'}
                </Button>
              </form>
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