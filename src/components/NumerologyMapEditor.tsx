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
import { Printer, FileDown, Calculator } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface NumerologyResults {
  motivacao: number;
  impressao: number;
  expressao: number;
  destino: number;
  missao: number;
  numeroIcosquico: number;
}

interface SectionText {
  introducao: string;
  motivacao: string;
  impressao: string;
  expressao: string;
  destino: string;
  missao: string;
  seuAnjo: string;
  licoesCarmicas: string;
  dividasCarmicas: string;
  tendenciasOcultas: string;
  respostaSubconsciente: string;
  ciclosVida: string;
  desafios: string;
  momentosDecisivos: string;
  numeroIcosquico: string;
  anoPessoal: string;
  diasFavoraveis: string;
  numerosHarmonicos: string;
  conclusao: string;
}

const defaultConversionTable = {
  "A":1,"B":2,"C":3,"D":4,"E":5,"F":6,"G":7,"H":8,"I":9,
  "J":1,"K":2,"L":3,"M":4,"N":5,"O":6,"P":7,"Q":8,"R":9,
  "S":1,"T":2,"U":3,"V":4,"W":5,"X":6,"Y":7,"Z":8,
  "Á":1,"À":1,"Â":1,"Ã":1,
  "É":5,"Ê":5,
  "Í":9,
  "Ó":6,"Ô":6,"Õ":6,
  "Ú":3,"Ü":3,
  "Ç":3
};

const defaultTexts: SectionText = {
  introducao: "Este mapa numerológico oferece insights profundos sobre sua personalidade e destino através dos números.",
  motivacao: "A Motivação revela seus desejos internos e o que realmente move sua alma.",
  impressao: "A Impressão mostra como os outros te veem e a primeira impressão que você causa.",
  expressao: "A Expressão representa seus talentos naturais e como você se manifesta no mundo.",
  destino: "O Destino indica o caminho que você veio trilhar nesta vida.",
  missao: "A Missão revela sua principal tarefa nesta encarnação.",
  seuAnjo: "Seu anjo protetor e as influências espirituais que te acompanham.",
  licoesCarmicas: "As lições que sua alma veio aprender nesta vida.",
  dividasCarmicas: "Débitos kármicos que precisam ser quitados.",
  tendenciasOcultas: "Aspectos ocultos de sua personalidade.",
  respostaSubconsciente: "Como você reage instintivamente às situações.",
  ciclosVida: "Os diferentes ciclos e fases de sua jornada.",
  desafios: "Os principais desafios que você enfrentará.",
  momentosDecisivos: "Períodos importantes e transformadores em sua vida.",
  numeroIcosquico: "Influência do seu dia de nascimento em sua personalidade.",
  anoPessoal: "Previsões para seu ano, mês e dia pessoal.",
  diasFavoraveis: "Os dias mais propícios para suas decisões importantes.",
  numerosHarmonicos: "Números que trazem harmonia e sorte para você.",
  conclusao: "Reflexões finais sobre seu mapa numerológico e orientações para o futuro."
};

export function NumerologyMapEditor() {
  const [name, setName] = useState('Hairã zupanc steinhauser');
  const [birthDate, setBirthDate] = useState('2000-05-11');
  const [conversionJson, setConversionJson] = useState(JSON.stringify(defaultConversionTable, null, 2));
  const [sectionTexts, setSectionTexts] = useState<SectionText>(defaultTexts);
  const [jsonError, setJsonError] = useState(false);

  // Utility functions
  const onlyLetters = (s: string): string => {
    return s.toUpperCase().replace(/[^\p{L}]/gu, '');
  };

  const onlyVowels = (s: string): string => {
    const vowels = /[AEIOUÁÀÂÃÉÊÍÓÔÕÚÜ]/g;
    return s.match(vowels)?.join('') || '';
  };

  const onlyConsonants = (s: string): string => {
    const vowels = /[AEIOUÁÀÂÃÉÊÍÓÔÕÚÜ]/g;
    return s.replace(vowels, '');
  };

  const removeDiacritics = (s: string): string => {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  };

  const sumByTable = (text: string, table: Record<string, number>): number => {
    let sum = 0;
    for (const char of text) {
      let value = table[char];
      if (value === undefined) {
        const baseChar = removeDiacritics(char);
        value = table[baseChar] || 0;
      }
      sum += value;
    }
    return sum;
  };

  const reduceNumber = (n: number): number => {
    if (n === 11 || n === 22) return n;
    
    while (n > 9) {
      const digits = n.toString().split('').map(Number);
      n = digits.reduce((sum, digit) => sum + digit, 0);
      if (n === 11 || n === 22) return n;
    }
    return n;
  };

  // Parse conversion table
  const conversionTable = useMemo(() => {
    try {
      const parsed = JSON.parse(conversionJson);
      setJsonError(false);
      return parsed;
    } catch {
      setJsonError(true);
      return defaultConversionTable;
    }
  }, [conversionJson]);

  // Calculate numerology results
  const results = useMemo((): NumerologyResults => {
    if (!name || !birthDate) {
      return {
        motivacao: 0,
        impressao: 0,
        expressao: 0,
        destino: 0,
        missao: 0,
        numeroIcosquico: 0
      };
    }

    const cleanName = onlyLetters(name);
    const vowels = onlyVowels(cleanName);
    const consonants = onlyConsonants(cleanName);

    const motivacao = reduceNumber(sumByTable(vowels, conversionTable));
    const impressao = reduceNumber(sumByTable(consonants, conversionTable));
    const expressao = reduceNumber(sumByTable(cleanName, conversionTable));

    // Date calculations
    const date = new Date(birthDate + 'T00:00:00');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const allDigits = `${day}${month}${year}`.split('').map(Number);
    const destino = reduceNumber(allDigits.reduce((sum, digit) => sum + digit, 0));
    const missao = reduceNumber(day + month);
    const numeroIcosquico = reduceNumber(day);

    return {
      motivacao,
      impressao,
      expressao,
      destino,
      missao,
      numeroIcosquico
    };
  }, [name, birthDate, conversionTable]);

  const updateSectionText = (section: keyof SectionText, text: string) => {
    setSectionTexts(prev => ({ ...prev, [section]: text }));
  };

  const exportPDF = async () => {
    const element = document.getElementById('numerology-report');
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `Mapa_Numerologico_${name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
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
            body { font-family: Arial, sans-serif; margin: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
            .numbers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .number-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .number-value { font-size: 2em; font-weight: bold; color: #8B5CF6; }
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

        {/* Input Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Data */}
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

          {/* Conversion Table */}
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Conversão (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={conversionJson}
                onChange={(e) => setConversionJson(e.target.value)}
                className="font-mono text-sm h-36 resize-none"
                placeholder="Tabela de conversão em formato JSON"
              />
              {jsonError && (
                <Alert className="mt-2">
                  <AlertDescription>
                    Tabela inválida — usando padrão
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Configure os valores numéricos para cada letra, incluindo acentos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Numbers Display */}
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

        {/* Tabs */}
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
            <TabsTrigger value="edit">Editar Textos</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <div id="numerology-report" className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mapa Numerológico</h1>
                <h2 className="text-2xl text-purple-600 mb-4">{name || 'Nome não informado'}</h2>
                <p className="text-gray-600">
                  Data de nascimento: {birthDate ? format(new Date(birthDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada'}
                </p>
              </div>

              {/* Numbers Summary */}
              <div className="numbers-grid grid grid-cols-3 gap-4 mb-8">
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

              {/* Report Sections */}
              {Object.entries(sectionTexts).map(([key, text]) => (
                <div key={key} className="section mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
                    {key === 'introducao' && 'Introdução'}
                    {key === 'motivacao' && `Motivação (${results.motivacao})`}
                    {key === 'impressao' && `Impressão (${results.impressao})`}
                    {key === 'expressao' && `Expressão (${results.expressao})`}
                    {key === 'destino' && `Destino (${results.destino})`}
                    {key === 'missao' && `Missão (${results.missao})`}
                    {key === 'seuAnjo' && 'Seu Anjo'}
                    {key === 'licoesCarmicas' && 'Lições Cármicas'}
                    {key === 'dividasCarmicas' && 'Dívidas Cármicas'}
                    {key === 'tendenciasOcultas' && 'Tendências Ocultas'}
                    {key === 'respostaSubconsciente' && 'Resposta Subconsciente'}
                    {key === 'ciclosVida' && 'Ciclos de Vida'}
                    {key === 'desafios' && 'Desafios'}
                    {key === 'momentosDecisivos' && 'Momentos Decisivos'}
                    {key === 'numeroIcosquico' && `Número Psíquico (${results.numeroIcosquico})`}
                    {key === 'anoPessoal' && 'Ano Pessoal/Mês/Dia'}
                    {key === 'diasFavoraveis' && 'Dias Favoráveis'}
                    {key === 'numerosHarmonicos' && 'Números Harmônicos'}
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
                      {key === 'seuAnjo' && 'Seu Anjo'}
                      {key === 'licoesCarmicas' && 'Lições Cármicas'}
                      {key === 'dividasCarmicas' && 'Dívidas Cármicas'}
                      {key === 'tendenciasOcultas' && 'Tendências Ocultas'}
                      {key === 'respostaSubconsciente' && 'Resposta Subconsciente'}
                      {key === 'ciclosVida' && 'Ciclos de Vida'}
                      {key === 'desafios' && 'Desafios'}
                      {key === 'momentosDecisivos' && 'Momentos Decisivos'}
                      {key === 'numeroIcosquico' && `Número Psíquico (${results.numeroIcosquico})`}
                      {key === 'anoPessoal' && 'Ano Pessoal/Mês/Dia'}
                      {key === 'diasFavoraveis' && 'Dias Favoráveis'}
                      {key === 'numerosHarmonicos' && 'Números Harmônicos'}
                      {key === 'conclusao' && 'Conclusão'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={text}
                      onChange={(e) => updateSectionText(key as keyof SectionText, e.target.value)}
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