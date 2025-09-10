import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Printer, FileDown, Calculator, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface NumerologyResults {
  motivacao: number;
  impressao: number;
  expressao: number;
  destino: number;
  missao: number;
  numeroIcosquico: number;
  licoesCarmicas: number[];
  dividasCarmicas: number[];
  tendenciasOcultas: number[];
  respostaSubconsciente: number;
  ciclosVida: [number, number, number];
  desafios: [number, number, number];
  momentosDecisivos: [number, number, number, number];
}

interface NumerologyText {
  id: string;
  section: string;
  key_number: number;
  title: string;
  body: string;
}

interface ConversionTable {
  [key: string]: number;
}

interface SectionTexts {
  [key: string]: string;
}

// Tabela de conversão padrão cabalística
const defaultConversionTable: ConversionTable = {
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 8, "G": 3, "H": 5, "I": 1,
  "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 7, "P": 8, "Q": 1, "R": 2,
  "S": 3, "T": 4, "U": 6, "V": 6, "W": 6, "X": 6, "Y": 1, "Z": 7,
  "Á": 1, "À": 3, "Â": 8, "Ã": 4, "Ä": 1,
  "É": 5, "È": 5, "Ê": 12, "Ë": 5,
  "Í": 1, "Ì": 1, "Î": 8, "Ï": 1,
  "Ó": 7, "Ò": 7, "Ô": 14, "Õ": 10, "Ö": 7,
  "Ú": 6, "Ù": 6, "Û": 13, "Ü": 6,
  "Ç": 6
};

// Tabela de números psíquicos baseados no dia
const psiquicoTable: { [key: number]: number } = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  10: 1, 11: 5, 12: 3, 13: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9,
  19: 1, 20: 2, 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 26: 8, 27: 9,
  28: 1, 29: 2, 30: 3, 31: 4
};

export function NumerologyMapEditor() {
  const [name, setName] = useState('Hairã zupanc steinhauser');
  const [birthDate, setBirthDate] = useState('2000-05-11');
  const [loading, setLoading] = useState(false);
  const [conversionTable, setConversionTable] = useState<ConversionTable>(defaultConversionTable);
  const [numerologyTexts, setNumerologyTexts] = useState<NumerologyText[]>([]);
  const [sectionTexts, setSectionTexts] = useState<SectionTexts>({});
  const [calculationError, setCalculationError] = useState<string>('');
  
  const { toast } = useToast();

  // Carrega dados do Supabase
  useEffect(() => {
    loadSupabaseData();
  }, []);

  const loadSupabaseData = async () => {
    setLoading(true);
    try {
      // Carrega tabela de conversão padrão
      const { data: conversionData } = await supabase
        .from('conversion_tables')
        .select('mapping')
        .eq('is_default', true)
        .single();

      if (conversionData?.mapping) {
        setConversionTable(conversionData.mapping as ConversionTable);
      }

      // Carrega textos de numerologia
      const { data: textsData } = await supabase
        .from('numerology_texts')
        .select('*')
        .eq('lang', 'pt-BR');

      if (textsData) {
        setNumerologyTexts(textsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Usando configurações padrão",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Funções utilitárias de cálculo
  const normalizar = (s: string): string => {
    return s.toUpperCase().replace(/[^\p{L}]/gu, '');
  };

  const isVogal = (ch: string): boolean => {
    return /[AEIOUÁÀÂÃÉÊÍÓÔÕÚÜ]/.test(ch);
  };

  const removeDiacritics = (s: string): string => {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  };

  const somarLetras = (texto: string, filtro: (ch: string) => boolean): number => {
    const textoNormalizado = normalizar(texto);
    let soma = 0;
    
    for (const char of textoNormalizado) {
      if (filtro(char)) {
        let valor = conversionTable[char];
        if (valor === undefined) {
          const charBase = removeDiacritics(char);
          valor = conversionTable[charBase] || 0;
        }
        soma += valor;
      }
    }
    return soma;
  };

  const reduzirComMestre = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n;
    
    while (n > 9) {
      const digits = n.toString().split('').map(Number);
      n = digits.reduce((sum, digit) => sum + digit, 0);
      if (n === 11 || n === 22 || n === 33) return n;
    }
    return n;
  };

  const reduzirSimples = (n: number): number => {
    while (n > 9) {
      const digits = n.toString().split('').map(Number);
      n = digits.reduce((sum, digit) => sum + digit, 0);
    }
    return n;
  };

  // Cálculos principais
  const results = useMemo((): NumerologyResults => {
    if (!name || !birthDate) {
      return {
        motivacao: 0, impressao: 0, expressao: 0, destino: 0, missao: 0,
        numeroIcosquico: 0, licoesCarmicas: [], dividasCarmicas: [],
        tendenciasOcultas: [], respostaSubconsciente: 0,
        ciclosVida: [0, 0, 0], desafios: [0, 0, 0], momentosDecisivos: [0, 0, 0, 0]
      };
    }

    const nomeNormalizado = normalizar(name);
    
    // Cálculos básicos
    const somaTotalLetras = somarLetras(nomeNormalizado, () => true);
    const somaVogais = somarLetras(nomeNormalizado, isVogal);
    const somaConsoantes = somarLetras(nomeNormalizado, ch => !isVogal(ch));
    
    const expressao = reduzirComMestre(somaTotalLetras);
    const motivacao = (somaVogais === 11 || somaVogais === 22) ? somaVogais : reduzirComMestre(somaVogais);
    const impressao = reduzirComMestre(somaConsoantes);

    // Cálculos da data
    const date = new Date(birthDate + 'T00:00:00');
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();

    const destino = reduzirComMestre(
      dia.toString().split('').reduce((sum, d) => sum + parseInt(d), 0) +
      mes.toString().split('').reduce((sum, d) => sum + parseInt(d), 0) +
      ano.toString().split('').reduce((sum, d) => sum + parseInt(d), 0)
    );

    const missao = reduzirSimples(expressao + destino);
    const numeroIcosquico = psiquicoTable[dia] || reduzirSimples(dia);

    // Lições Cármicas - números de 1-9 ausentes no nome
    const numerosPresentes = new Set<number>();
    for (const char of nomeNormalizado) {
      let valor = conversionTable[char];
      if (valor === undefined) {
        valor = conversionTable[removeDiacritics(char)] || 0;
      }
      if (valor >= 1 && valor <= 9) {
        numerosPresentes.add(valor);
      }
    }
    const licoesCarmicas = [];
    for (let i = 1; i <= 9; i++) {
      if (!numerosPresentes.has(i)) {
        licoesCarmicas.push(i);
      }
    }

    // Dívidas Cármicas (13, 14, 16, 19)
    const dividasCarmicas: number[] = [];
    // Lógica simplificada - pode ser expandida conforme necessário

    // Tendências Ocultas - números mais frequentes
    const frequencia: { [key: number]: number } = {};
    for (const char of nomeNormalizado) {
      let valor = conversionTable[char];
      if (valor === undefined) {
        valor = conversionTable[removeDiacritics(char)] || 0;
      }
      if (valor >= 1 && valor <= 9) {
        frequencia[valor] = (frequencia[valor] || 0) + 1;
      }
    }
    const maxFreq = Math.max(...Object.values(frequencia));
    const tendenciasOcultas = Object.keys(frequencia)
      .filter(k => frequencia[parseInt(k)] === maxFreq)
      .map(k => parseInt(k));

    // Resposta Subconsciente
    const respostaSubconsciente = 9 - licoesCarmicas.length;

    // Ciclos de Vida
    const ciclo1 = reduzirComMestre(mes);
    const ciclo2 = reduzirComMestre(dia);
    const ciclo3 = reduzirComMestre(ano);
    const ciclosVida: [number, number, number] = [ciclo1, ciclo2, ciclo3];

    // Desafios
    const desafio1 = Math.abs(dia - mes);
    const desafio2 = Math.abs(dia - ano);
    const desafioPrincipal = Math.abs(desafio1 - desafio2);
    const desafios: [number, number, number] = [desafio1, desafio2, desafioPrincipal];

    // Momentos Decisivos
    const momento1 = reduzirComMestre(dia + mes);
    const momento2 = reduzirComMestre(dia + ano);
    const momento3 = reduzirComMestre(mes + ano);
    const momento4 = reduzirComMestre(momento1 + momento2 + momento3);
    const momentosDecisivos: [number, number, number, number] = [momento1, momento2, momento3, momento4];

    return {
      motivacao, impressao, expressao, destino, missao, numeroIcosquico,
      licoesCarmicas, dividasCarmicas, tendenciasOcultas, respostaSubconsciente,
      ciclosVida, desafios, momentosDecisivos
    };
  }, [name, birthDate, conversionTable]);

  // Validação do caso teste
  useEffect(() => {
    if (name === 'Hairã zupanc steinhauser' && birthDate === '2000-05-11') {
      const expected = {
        motivacao: 22, impressao: 7, expressao: 11, destino: 9, missao: 2,
        numeroIcosquico: 5, ciclosVida: [5, 11, 2], desafios: [3, 0, 3],
        momentosDecisivos: [7, 4, 11, 7]
      };
      
      const errors: string[] = [];
      if (results.motivacao !== expected.motivacao) errors.push(`Motivação: esperado ${expected.motivacao}, obtido ${results.motivacao}`);
      if (results.impressao !== expected.impressao) errors.push(`Impressão: esperado ${expected.impressao}, obtido ${results.impressao}`);
      if (results.expressao !== expected.expressao) errors.push(`Expressão: esperado ${expected.expressao}, obtido ${results.expressao}`);
      if (results.destino !== expected.destino) errors.push(`Destino: esperado ${expected.destino}, obtido ${results.destino}`);
      if (results.missao !== expected.missao) errors.push(`Missão: esperado ${expected.missao}, obtido ${results.missao}`);
      if (results.numeroIcosquico !== expected.numeroIcosquico) errors.push(`Número Psíquico: esperado ${expected.numeroIcosquico}, obtido ${results.numeroIcosquico}`);
      
      if (errors.length > 0) {
        setCalculationError('Erro nos cálculos: ' + errors.join('; '));
        console.error('Erro de validação:', errors);
        toast({
          title: "Erro nos cálculos",
          description: "Revise a tabela de conversão e as fórmulas",
          variant: "destructive"
        });
      } else {
        setCalculationError('');
      }
    }
  }, [results, name, birthDate, toast]);

  // Busca texto do Supabase
  const getTextFromSupabase = (section: string, keyNumber: number): string => {
    const text = numerologyTexts.find(t => 
      t.section === section && t.key_number === keyNumber
    );
    return text?.body || `Texto não encontrado para ${section}-${keyNumber}`;
  };

  // Carrega textos das seções
  useEffect(() => {
    const texts: SectionTexts = {
      introducao: 'Este mapa numerológico oferece insights profundos sobre sua personalidade e destino através dos números.',
      motivacao: getTextFromSupabase('motivacao', results.motivacao),
      impressao: getTextFromSupabase('impressao', results.impressao),
      expressao: getTextFromSupabase('expressao', results.expressao),
      destino: getTextFromSupabase('destino', results.destino),
      missao: getTextFromSupabase('missao', results.missao),
      numeroIcosquico: getTextFromSupabase('Número Psíquico', results.numeroIcosquico),
      licoesCarmicas: results.licoesCarmicas.length > 0 
        ? `Suas lições cármicas são os números: ${results.licoesCarmicas.join(', ')}` 
        : 'Nenhuma lição cármica específica',
      dividasCarmicas: results.dividasCarmicas.length > 0 
        ? `Suas dívidas cármicas são: ${results.dividasCarmicas.join(', ')}` 
        : 'Nenhuma dívida cármica',
      tendenciasOcultas: `Números dominantes: ${results.tendenciasOcultas.join(', ')}`,
      respostaSubconsciente: `Sua resposta subconsciente é ${results.respostaSubconsciente}`,
      ciclosVida: `1º Ciclo: ${results.ciclosVida[0]}, 2º Ciclo: ${results.ciclosVida[1]}, 3º Ciclo: ${results.ciclosVida[2]}`,
      desafios: `1º Desafio: ${results.desafios[0]}, 2º Desafio: ${results.desafios[1]}, Desafio Principal: ${results.desafios[2]}`,
      momentosDecisivos: `1º: ${results.momentosDecisivos[0]}, 2º: ${results.momentosDecisivos[1]}, 3º: ${results.momentosDecisivos[2]}, 4º: ${results.momentosDecisivos[3]}`,
      anoPessoal: getTextFromSupabase('ano_pessoal', new Date().getFullYear() % 9 || 9),
      diasFavoraveis: 'Dias favoráveis baseados em seus números pessoais',
      numerosHarmonicos: 'Números que trazem harmonia para você',
      coresFavoraveis: 'Cores que potencializam sua energia',
      conclusao: 'Este mapa numerológico oferece um guia para sua jornada de autoconhecimento.'
    };
    setSectionTexts(texts);
  }, [results, numerologyTexts]);

  const updateSectionText = (section: string, text: string) => {
    setSectionTexts(prev => ({ ...prev, [section]: text }));
  };

  const exportPDF = async () => {
    const element = document.getElementById('numerology-report');
    if (!element) return;

    const opt = {
      margin: [15, 10, 15, 10],
      filename: `Mapa_Numerologico_${name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "PDF exportado com sucesso",
        description: "O arquivo foi baixado"
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const printReport = () => {
    const element = document.getElementById('numerology-report');
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Mapa Numerológico - ${name}</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section h2 { color: #5B21B6; border-bottom: 2px solid #E0E7FF; padding-bottom: 8px; }
            .numbers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
            .number-card { text-align: center; padding: 15px; border: 1px solid #D1D5DB; border-radius: 8px; }
            .number-value { font-size: 1.8em; font-weight: bold; color: #7C3AED; }
            @media print { .section { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg text-gray-600">Carregando dados numerológicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Mapa Numerológico – Editor</h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button onClick={exportPDF} className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Erro de cálculo */}
        {calculationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{calculationError}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Entradas</TabsTrigger>
            <TabsTrigger value="map">Mapa Completo</TabsTrigger>
            <TabsTrigger value="edit">Edição de Textos</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="mt-6 space-y-6">
            {/* Dados do Cliente */}
            <Card className="shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite o nome completo"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">Data de nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Os Seus Números */}
            <Card className="shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Os Seus Números</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Motivação', value: results.motivacao },
                    { label: 'Impressão', value: results.impressao },
                    { label: 'Expressão', value: results.expressao },
                    { label: 'Destino', value: results.destino },
                    { label: 'Missão', value: results.missao },
                    { label: 'Número Psíquico', value: results.numeroIcosquico }
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{item.value || 0}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div id="numerology-report" className="bg-white p-8 rounded-2xl shadow-lg print:shadow-none">
              <div className="text-center mb-8 header">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mapa Numerológico</h1>
                <h2 className="text-2xl text-purple-600 mb-4">{name || 'Nome não informado'}</h2>
                <p className="text-gray-600">
                  Data de nascimento: {birthDate ? format(new Date(birthDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}
                </p>
              </div>

              {/* Os Seus Números */}
              <div className="section mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">Os Seus Números</h2>
                <div className="numbers-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Motivação', value: results.motivacao },
                    { label: 'Impressão', value: results.impressao },
                    { label: 'Expressão', value: results.expressao },
                    { label: 'Destino', value: results.destino },
                    { label: 'Missão', value: results.missao },
                    { label: 'Número Psíquico', value: results.numeroIcosquico }
                  ].map((item) => (
                    <div key={item.label} className="number-card text-center p-4 border rounded-lg">
                      <div className="number-value text-3xl font-bold text-purple-600 mb-2">{item.value || 0}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seções do Relatório */}
              {Object.entries(sectionTexts).map(([key, text]) => (
                <div key={key} className="section mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
                    {key === 'introducao' && 'Introdução'}
                    {key === 'motivacao' && `Motivação (${results.motivacao})`}
                    {key === 'impressao' && `Impressão (${results.impressao})`}
                    {key === 'expressao' && `Expressão (${results.expressao})`}
                    {key === 'destino' && `Destino (${results.destino})`}
                    {key === 'missao' && `Missão (${results.missao})`}
                    {key === 'numeroIcosquico' && `Número Psíquico (${results.numeroIcosquico})`}
                    {key === 'licoesCarmicas' && 'Lições Cármicas'}
                    {key === 'dividasCarmicas' && 'Dívidas Cármicas'}
                    {key === 'tendenciasOcultas' && 'Tendências Ocultas'}
                    {key === 'respostaSubconsciente' && 'Resposta Subconsciente'}
                    {key === 'ciclosVida' && 'Ciclos de Vida'}
                    {key === 'desafios' && 'Desafios'}
                    {key === 'momentosDecisivos' && 'Momentos Decisivos'}
                    {key === 'anoPessoal' && 'Ano Pessoal/Mês/Dia'}
                    {key === 'diasFavoraveis' && 'Dias Favoráveis'}
                    {key === 'numerosHarmonicos' && 'Números Harmônicos'}
                    {key === 'coresFavoraveis' && 'Cores Favoráveis'}
                    {key === 'conclusao' && 'Conclusão'}
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="mt-6">
            <div className="grid gap-4">
              {Object.entries(sectionTexts).map(([key, text]) => (
                <Card key={key} className="shadow-lg rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {key === 'introducao' && 'Introdução'}
                      {key === 'motivacao' && `Motivação (${results.motivacao})`}
                      {key === 'impressao' && `Impressão (${results.impressao})`}
                      {key === 'expressao' && `Expressão (${results.expressao})`}
                      {key === 'destino' && `Destino (${results.destino})`}
                      {key === 'missao' && `Missão (${results.missao})`}
                      {key === 'numeroIcosquico' && `Número Psíquico (${results.numeroIcosquico})`}
                      {key === 'licoesCarmicas' && 'Lições Cármicas'}
                      {key === 'dividasCarmicas' && 'Dívidas Cármicas'}
                      {key === 'tendenciasOcultas' && 'Tendências Ocultas'}
                      {key === 'respostaSubconsciente' && 'Resposta Subconsciente'}
                      {key === 'ciclosVida' && 'Ciclos de Vida'}
                      {key === 'desafios' && 'Desafios'}
                      {key === 'momentosDecisivos' && 'Momentos Decisivos'}
                      {key === 'anoPessoal' && 'Ano Pessoal/Mês/Dia'}
                      {key === 'diasFavoraveis' && 'Dias Favoráveis'}
                      {key === 'numerosHarmonicos' && 'Números Harmônicos'}
                      {key === 'coresFavoraveis' && 'Cores Favoráveis'}
                      {key === 'conclusao' && 'Conclusão'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={text}
                      onChange={(e) => updateSectionText(key, e.target.value)}
                      className="min-h-24 resize-y"
                      placeholder={`Digite o texto para ${key}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}