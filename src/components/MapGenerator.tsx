import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
import MapaPDF from './MapaPDF';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

// Schema de validação
const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birth: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  clientId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
}

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

function letterValue(raw: string, baseMap: Record<string, number>) {
  const analyzed = analyzeChar(raw);
  if (!analyzed) return null;
  // Tratamento especial para 'ç'/'Ç'
  const isCedilla = raw.toLowerCase() === 'ç';
  const base = isCedilla ? 8 : baseMap[analyzed.baseChar];
  if (base === undefined) return null;
  const value = applyMods(base, analyzed.marks);
  return { baseChar: analyzed.baseChar, marks: analyzed.marks, base, value, raw };
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

function reduceSimple(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
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
  // Usar tabela cabalística correta (1-8)
  const CABALISTIC_TABLE: Record<string, number> = {
    A: 1, I: 1, Q: 1, Y: 1, J: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5,
    U: 6, V: 6, W: 6, X: 6,
    O: 7, Z: 7,
    F: 8, P: 8, Ç: 8
  };
  const baseMap = CABALISTIC_TABLE;

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
  // Ano Pessoal correto: reduce(soma_dígitos(ano_ref) + destino)
  const anoDigitos = String(ano).split('').reduce((a, d) => a + Number(d), 0);
  const ano_pessoal = reduce(anoDigitos + destino);

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
    numero_psiquico: getText('psiquico', numero_psiquico, 'Número Psíquico'),
    dia_nascimento: getText('dia_nascimento', dia_nascimento_natural, 'Dia do Nascimento'),
    grau_ascensao: getText('grau_ascensao', grau_ascensao, 'Grau de Ascensão'),
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
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTextos, setEditedTextos] = useState<Record<string, { title: string; body: string }>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { toast } = useToast();
  const location = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      clientId: '',
    },
  });

  useEffect(() => {
    fetchClients();
    // Check if client was pre-selected from navigation
    const preSelectedClient = location.state?.selectedClient;
    if (preSelectedClient) {
      setSelectedClient(preSelectedClient);
      form.setValue('clientId', preSelectedClient.id);
      form.setValue('name', preSelectedClient.name);
      if (preSelectedClient.birth_date) {
        form.setValue('birth', new Date(preSelectedClient.birth_date));
      }
    }
  }, [location.state]);

  const fetchClients = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, birth_date')
        .eq('user_id', profile.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      form.setValue('name', client.name);
      if (client.birth_date) {
        form.setValue('birth', new Date(client.birth_date));
      }
    } else {
      setSelectedClient(null);
      form.setValue('name', '');
    }
  };

  const saveMapToDatabase = async (mapData: MapaData, clientId?: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      // Save map
      const { data: mapResult, error: mapError } = await supabase
        .from('maps')
        .insert({
          user_id: profile.id,
          client_id: clientId || null,
          title: `Mapa de ${mapData.header.name}`,
          type: 'personal' as const,
          status: 'ready' as const,
          input: {
            name: mapData.header.name,
            birth: mapData.header.birth,
            yearRef: mapData.header.anoReferencia
          } as any,
          result: mapData as any
        })
        .select('id')
        .single();

      if (mapError) throw mapError;

      // Store the map ID for PDF generation
      setCurrentMapId(mapResult.id);

      // Save service record
      if (clientId && mapResult) {
        await supabase
          .from('services')
          .insert({
            user_id: profile.id,
            client_id: clientId,
            map_id: mapResult.id,
            service_type: 'map_generation',
            service_data: {
              mapTitle: `Mapa de ${mapData.header.name}`,
              mapType: 'personal'
            }
          });
      }

      toast({
        title: "Mapa salvo automaticamente",
        description: clientId ? "Mapa vinculado ao cliente e registrado no histórico." : "Mapa salvo no seu histórico.",
      });
    } catch (error) {
      console.error('Erro ao salvar mapa:', error);
      // Don't show error toast as this is automatic saving
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    console.log('🔄 Iniciando geração do mapa no cliente...', data);
    
    try {
      const birthString = format(data.birth, 'yyyy-MM-dd');
      console.log('📅 Data formatada:', birthString);
      
      const requestBody = {
        name: data.name,
        birth: birthString,
        anoReferencia: new Date().getFullYear(),
      };
      console.log('📤 Enviando request para generate-map:', requestBody);
      
      // Timeout de 20s para a função edge (funções podem demorar mais ao buscar textos)
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao chamar a função')), 20000));

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

      console.log('📥 Resposta da edge function recebida:', { 
        hasResult: !!result, 
        hasError: !!error, 
        error: error ? (error.message || error) : null,
        resultKeys: result ? Object.keys(result) : [],
        resultHeader: result?.header,
        resultNumbers: result?.numeros ? {
          motivacao: result.numeros.motivacao,
          impressao: result.numeros.impressao,
          expressao: result.numeros.expressao,
          destino: result.numeros.destino,
          arrays: {
            licoesCarmicas: result.numeros.licoesCarmicas,
            ciclosVida: result.numeros.ciclosVida,
            desafios: result.numeros.desafios,
            momentos: result.numeros.momentos
          }
        } : null,
        firstTextoKeys: result?.textos ? Object.keys(result.textos).slice(0, 5) : []
      });

      if (error || !result) {
        console.warn('⚠️ Falha na função edge, usando fallback no cliente...', error);
        const fallback = await computeOnClient(data.name, birthString, new Date().getFullYear());
        
        // Normalize fallback result to match edge function format
        const normalizedFallback = {
          ...fallback,
          // Ensure texts are always in normalized format for editing  
          texts: fallback.textos ? Object.fromEntries(
            Object.entries(fallback.textos).map(([key, content]: [string, any]) => [
              key,
              {
                title: content.title || key.replace(/[-_]/g, ' '),
                body: content.body || 'Conteúdo em desenvolvimento'
              }
            ])
          ) : {}
        };
        
        setMapaData(normalizedFallback);
        setEditedTextos(normalizedFallback.texts || {});
        setIsEditing(false);
        toast({ title: 'Mapa gerado (modo offline)', description: 'Usamos cálculo local como fallback.' });
        return;
      }

      console.log('✅ Mapa gerado com sucesso:', result);
      
      // Normalize the result to ensure consistent format for MapaPDF
      const normalizedResult = {
        ...result,
        // Ensure metadata compatibility
        metadata: result.metadata ?? (result.metadados ? {
          version: result.metadados.versaoConteudo,
          totalTexts: result.metadados.totalTextos,
          angelFound: result.metadados.angeloEncontrado,
          calculationsComplete: result.metadados.calculosCompletos,
          generatedAt: result.metadados.dataProcessamento,
        } : undefined),
        // Ensure texts are always in normalized format for editing
        texts: result.textos ? Object.fromEntries(
          Object.entries(result.textos).map(([key, content]: [string, any]) => {
            // Handle structured sections specially
            if (['licoesCarmicas', 'dividasCarmicas', 'tendenciasOcultas', 'ciclosVida', 'desafios', 'momentos'].includes(key)) {
              // For structured sections, create a summary text for editing
              const arrays = result.numeros?.[key];
              if (Array.isArray(arrays)) {
                return [key, {
                  title: content.titulo || content.title || key.replace(/[-_]/g, ' '),
                  body: content.conteudo || content.body || `Análise estruturada baseada nos números: ${arrays.join(', ')}`
                }];
              }
            }
            
            // Handle angel section
            if (key === 'anjoEspecial' && result.cabalisticAngel) {
              return [key, {
                title: 'Anjo Cabalístico Pessoal',
                body: content.conteudo || content.body || `Anjo: ${result.cabalisticAngel.name}\nCategoria: ${result.cabalisticAngel.category || ''}\nDescrição: ${result.cabalisticAngel.description || ''}`
              }];
            }
            
            // Regular text sections
            return [key, {
              title: content.titulo || content.title || key.replace(/[-_]/g, ' '),
              body: content.conteudo || content.body || content.text || 'Conteúdo em desenvolvimento'
            }];
          })
        ) : (result.texts || {})
      };
      
      console.log('🔄 Resultado normalizado:', {
        hasTextos: !!normalizedResult.textos,
        hasTexts: !!normalizedResult.texts,
        textKeys: Object.keys(normalizedResult.texts || {})
      });
      
      setMapaData(normalizedResult);
      setEditedTextos(normalizedResult.texts || {});
      setIsEditing(false);

      // Save automatically to database
      const actualClientId = data.clientId === "none" ? null : data.clientId;
      await saveMapToDatabase(result, actualClientId);

      toast({
        title: 'Mapa gerado com sucesso!',
        description: actualClientId ? "Mapa salvo e vinculado ao cliente." : "Mapa gerado e salvo automaticamente.",
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
    if (!currentMapId) {
      toast({
        title: 'Erro ao exportar PDF',
        description: 'É necessário gerar o mapa primeiro.',
        variant: 'destructive',
      });
      return;
    }

    setIsExportingPDF(true);
    try {
      toast({
        title: 'Gerando PDF...',
        description: 'Estamos criando seu PDF profissional com Gamma AI. Isso pode levar alguns minutos.',
      });

      const { data: response, error } = await supabase.functions.invoke('generate-gamma-pdf', {
        body: { map_id: currentMapId }
      });

      if (error) throw error;

      if (response?.ok && response?.pdf_url) {
        // Open PDF in new tab for download
        window.open(response.pdf_url, '_blank');
        
        toast({
          title: 'PDF gerado com sucesso!',
          description: 'Seu PDF profissional foi criado com Gamma AI.',
        });
      } else {
        throw new Error(response?.error || 'Falha na geração do PDF');
      }
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao exportar PDF',
        description: error.message || 'Erro na geração do PDF via Gamma API. Tente novamente.',
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
                  <Label htmlFor="clientId" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente (opcional)
                  </Label>
                  <Select 
                    value={form.watch('clientId')} 
                    onValueChange={(value) => {
                      form.setValue('clientId', value);
                      handleClientSelect(value);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um cliente ou deixe em branco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum cliente selecionado</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecione um cliente para vincular o mapa automaticamente
                  </p>
                </div>

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

                <Button
                  type="submit" 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Gerando Mapa...' : (
                    selectedClient ? `Gerar Mapa para ${selectedClient.name}` : 'Gerar Mapa Numerológico'
                  )}
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
                <MapaPDF data={{ ...mapaData, texts: currentTextos }} />
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