import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, FileText, Calculator, Printer } from "lucide-react";
import { useNumerologia } from "@/hooks/useNumerologia";
import { NumerologyText } from "@/lib/numerologia";
import html2pdf from 'html2pdf.js';

interface EditableTexts {
  [key: string]: string;
}

const NumerologyMapEditor: React.FC = () => {
  const [name, setName] = useState("Hairã zupanc steinhauser");
  const [birthDate, setBirthDate] = useState("11/05/2000");
  const [editableTexts, setEditableTexts] = useState<EditableTexts>({});
  const { toast } = useToast();
  
  // Use the numerology hook
  const { result, texts, loading, error, isValidTestCase } = useNumerologia({
    nome: name,
    data: birthDate
  });

  // Initialize editable texts when texts change
  useEffect(() => {
    if (Object.keys(texts).length > 0) {
      const initialTexts: EditableTexts = {};
      Object.entries(texts).forEach(([key, text]) => {
        initialTexts[key] = text.body;
      });
      setEditableTexts(initialTexts);
    }
  }, [texts]);

  // Call validation when results change
  useEffect(() => {
    if (result) {
      showValidationAlert();
    }
  }, [result, name, birthDate]);

  // Show validation alert for test case
  const showValidationAlert = () => {
    if (name.toLowerCase().includes('hairã') && birthDate === '11/05/2000') {
      if (!isValidTestCase) {
        toast({
          title: "⚠️ Erro nos cálculos",
          description: "Os resultados não coincidem com o caso teste. Revise as fórmulas.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "✅ Validação OK",
          description: "Cálculos conferem com o caso teste esperado!",
          variant: "default"
        });
      }
    }
  };

  // Handle text changes
  const updateText = (key: string, value: string) => {
    setEditableTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get display text for a key
  const getDisplayText = (key: string): string => {
    return editableTexts[key] || texts[key]?.body || `Texto não encontrado para: ${key}`;
  };

  // Export PDF function
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

  // Print function
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
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; margin: 0; line-height: 1.6; color: #333; }
            .page { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #7C3AED; padding-bottom: 20px; }
            .header h1 { font-size: 2.5em; color: #7C3AED; margin-bottom: 10px; }
            .header h2 { font-size: 1.8em; color: #4B5563; margin-bottom: 5px; }
            .header p { font-size: 1.1em; color: #6B7280; }
            .section { margin: 30px 0; page-break-inside: avoid; }
            .section-title { font-size: 1.4em; color: #7C3AED; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 15px; }
            .numbers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 25px 0; }
            .number-card { text-align: center; padding: 20px; border: 2px solid #E5E7EB; border-radius: 12px; background: #F8FAFC; }
            .number-value { font-size: 2.2em; font-weight: bold; color: #7C3AED; margin-bottom: 8px; }
            .number-label { font-size: 0.9em; color: #4B5563; font-weight: 600; }
            .content-text { text-align: justify; line-height: 1.8; color: #374151; margin: 15px 0; }
            .subsection { margin: 20px 0; padding: 15px; background: #F9FAFB; border-left: 4px solid #7C3AED; }
            .subsection-title { font-size: 1.1em; color: #7C3AED; margin-bottom: 10px; font-weight: 600; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            .highlight-box { background: linear-gradient(135deg, #EDE9FE, #F3F4F6); padding: 20px; border-radius: 10px; margin: 15px 0; }
            @media print { 
              .section { page-break-inside: avoid; }
              .page { margin: 0; padding: 15mm; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Mapa Numerológico – Editor</h1>
          <div className="flex items-center justify-center gap-2">
            <Calculator className="animate-spin h-5 w-5" />
            <p>Carregando dados do Supabase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mapa Numerológico – Editor</h1>
          <div className="flex gap-2">
            <Button onClick={printReport} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Error/Success Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar dados: {error}
            </AlertDescription>
          </Alert>
        )}

        {name.toLowerCase().includes('hairã') && birthDate === '11/05/2000' && (
          <Alert variant={isValidTestCase ? "default" : "destructive"} className="mb-4">
            {isValidTestCase ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              {isValidTestCase 
                ? "✅ Caso teste validado com sucesso!"
                : "⚠️ Erro nos cálculos - valores não coincidem com o caso teste"
              }
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inputs">Entradas</TabsTrigger>
            <TabsTrigger value="map">Mapa Completo</TabsTrigger>  
            <TabsTrigger value="edit">Edição de Textos</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
          </TabsList>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
                <CardDescription>Insira o nome completo e data de nascimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento (DD/MM/AAAA)</Label>
                  <Input
                    id="birthDate"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complete Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div id="numerology-report" className="space-y-8 bg-background p-8 rounded-lg">
              {/* Header/Cover */}
              <div className="text-center space-y-4 pb-8 border-b-2 border-primary/20">
                <h1 className="text-5xl font-bold text-primary">Mapa Numerológico</h1>
                <h2 className="text-3xl font-semibold text-muted-foreground">{name}</h2>
                <p className="text-xl text-muted-foreground">
                  Data de Nascimento: {birthDate}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Conheça os números que regem sua personalidade e destino"
                </p>
              </div>

              {result && (
                <>
                  {/* Os Seus Números - Main Grid */}
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary text-center">Os Seus Números</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.motivation}</div>
                        <div className="font-semibold text-sm">MOTIVAÇÃO</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.impression}</div>
                        <div className="font-semibold text-sm">IMPRESSÃO</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.expression}</div>
                        <div className="font-semibold text-sm">EXPRESSÃO</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.destiny}</div>
                        <div className="font-semibold text-sm">DESTINO</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.mission}</div>
                        <div className="font-semibold text-sm">MISSÃO</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="text-4xl font-bold text-primary mb-2">{result.psychic}</div>
                        <div className="font-semibold text-sm">PSÍQUICO</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Sections */}
                  {/* Motivação */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Motivação ({result.motivation})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`motivacao-${result.motivation}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Impressão */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Impressão ({result.impression})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`impressao-${result.impression}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Expressão */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Expressão ({result.expression})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`expressao-${result.expression}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Destino */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Destino ({result.destiny})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`destino-${result.destiny}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Missão */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Missão ({result.mission})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`missao-${result.mission}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Número Psíquico */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Número Psíquico ({result.psychic})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`psiquico-${result.psychic}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Lições Cármicas */}
                  <Card className="border-l-4 border-l-secondary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-secondary-foreground">Lições Cármicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {result.karmicLessons.map(lesson => (
                          <div key={lesson} className="text-center p-4 bg-secondary/10 rounded-lg border">
                            <div className="text-2xl font-bold text-secondary">{lesson}</div>
                          </div>
                        ))}
                      </div>
                      {result.karmicLessons.length === 0 ? (
                        <p className="text-muted-foreground">Nenhuma lição cármica identificada.</p>
                      ) : (
                        result.karmicLessons.map(lesson => (
                          <div key={lesson} className="mb-4">
                            <h4 className="font-semibold mb-2">Lição Cármica {lesson}</h4>
                            <p className="text-muted-foreground text-justify">
                              {getDisplayText(`licao-carmica-${lesson}`)}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  {/* Dívidas Cármicas */}
                  <Card className="border-l-4 border-l-destructive">
                    <CardHeader>
                      <CardTitle className="text-2xl text-destructive">Dívidas Cármicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.karmicDebts.length === 0 ? (
                        <p className="text-muted-foreground">Nenhuma dívida cármica identificada.</p>
                      ) : (
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {result.karmicDebts.map(debt => (
                              <div key={debt} className="text-center p-4 bg-destructive/10 rounded-lg border">
                                <div className="text-2xl font-bold text-destructive">{debt}</div>
                              </div>
                            ))}
                          </div>
                          {result.karmicDebts.map(debt => (
                            <div key={debt} className="mb-4">
                              <h4 className="font-semibold mb-2">Dívida Cármica {debt}</h4>
                              <p className="text-muted-foreground text-justify">
                                {getDisplayText(`divida-carmica-${debt}`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tendências Ocultas */}
                  <Card className="border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="text-2xl text-accent-foreground">Tendências Ocultas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {result.hiddenTendencies.map(tendency => (
                          <div key={tendency} className="text-center p-4 bg-accent/10 rounded-lg border">
                            <div className="text-2xl font-bold text-accent">{tendency}</div>
                          </div>
                        ))}
                      </div>
                      {result.hiddenTendencies.map(tendency => (
                        <div key={tendency} className="mb-4">
                          <h4 className="font-semibold mb-2">Tendência Oculta {tendency}</h4>
                          <p className="text-muted-foreground text-justify">
                            {getDisplayText(`tendencia-oculta-${tendency}`)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Resposta Subconsciente */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Resposta Subconsciente ({result.subconsciousResponse})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {getDisplayText(`resposta-subconsciente-${result.subconsciousResponse}`)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ciclos de Vida */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Ciclos de Vida</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-primary/5 rounded-lg border">
                          <div className="text-2xl font-bold text-primary">{result.lifeCycles[0]}</div>
                          <div className="text-sm font-medium">1º CICLO</div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg border">
                          <div className="text-2xl font-bold text-primary">{result.lifeCycles[1]}</div>
                          <div className="text-sm font-medium">2º CICLO</div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg border">
                          <div className="text-2xl font-bold text-primary">{result.lifeCycles[2]}</div>
                          <div className="text-sm font-medium">3º CICLO</div>
                        </div>
                      </div>
                      {result.lifeCycles.map((cycle, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold mb-2">{index + 1}º Ciclo de Vida ({cycle})</h4>
                          <p className="text-muted-foreground text-justify">
                            {getDisplayText(`ciclo-vida-${index + 1}-${cycle}`)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Desafios */}
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-2xl text-orange-600">Desafios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-2xl font-bold text-orange-600">{result.challenges[0]}</div>
                          <div className="text-sm font-medium">1º DESAFIO</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-2xl font-bold text-orange-600">{result.challenges[1]}</div>
                          <div className="text-sm font-medium">2º DESAFIO</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-2xl font-bold text-orange-600">{result.challenges[2]}</div>
                          <div className="text-sm font-medium">PRINCIPAL</div>
                        </div>
                      </div>
                      {result.challenges.map((challenge, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold mb-2">
                            {index === 2 ? 'Desafio Principal' : `${index + 1}º Desafio`} ({challenge})
                          </h4>
                          <p className="text-muted-foreground text-justify">
                            {getDisplayText(index === 2 ? `desafio-principal-${challenge}` : `desafio-${index + 1}-${challenge}`)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Momentos Decisivos */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-2xl text-blue-600">Momentos Decisivos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {result.decisiveMoments.map((moment, index) => (
                          <div key={index} className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{moment}</div>
                            <div className="text-sm font-medium">{index + 1}º MOMENTO</div>
                          </div>
                        ))}
                      </div>
                      {result.decisiveMoments.map((moment, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold mb-2">{index + 1}º Momento Decisivo ({moment})</h4>
                          <p className="text-muted-foreground text-justify">
                            {getDisplayText(`momento-${index + 1}-${moment}`)}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Conclusão */}
                  <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Conclusão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-justify italic">
                        Este mapa numerológico revela as principais características e tendências que regem sua personalidade e destino. 
                        Use essas informações como um guia para o autoconhecimento e crescimento pessoal. 
                        Lembre-se de que os números são ferramentas de compreensão, mas o livre arbítrio sempre prevalece em suas escolhas.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edição de Textos</CardTitle>
                <CardDescription>Personalize os textos antes da exportação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result && Object.keys(texts).map(key => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`${key}-text`} className="font-medium">{key}</Label>
                      <Textarea
                        id={`${key}-text`}
                        value={editableTexts[key] || texts[key]?.body || ''}
                        onChange={(e) => updateText(key, e.target.value)}
                        rows={3}
                        className="min-h-20"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Debug Tab */}
          <TabsContent value="debug" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Painel de Debug</CardTitle>
              </CardHeader>
              <CardContent>
                {result && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Números Principais:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>Motivação: <span className="font-mono">{result.motivation}</span></p>
                        <p>Impressão: <span className="font-mono">{result.impression}</span></p>
                        <p>Expressão: <span className="font-mono">{result.expression}</span></p>
                        <p>Destino: <span className="font-mono">{result.destiny}</span></p>
                        <p>Missão: <span className="font-mono">{result.mission}</span></p>
                        <p>Psíquico: <span className="font-mono">{result.psychic}</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Arrays:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>Ciclos: <span className="font-mono">[{result.lifeCycles.join(', ')}]</span></p>
                        <p>Desafios: <span className="font-mono">[{result.challenges.join(', ')}]</span></p>
                        <p>Momentos: <span className="font-mono">[{result.decisiveMoments.join(', ')}]</span></p>
                        <p>Lições: <span className="font-mono">[{result.karmicLessons.join(', ')}]</span></p>
                        <p>Dívidas: <span className="font-mono">[{result.karmicDebts.join(', ')}]</span></p>
                        <p>Tendências: <span className="font-mono">[{result.hiddenTendencies.join(', ')}]</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Validação:</h4>
                      <p className={isValidTestCase ? 'text-green-600' : 'text-red-600'}>
                        {isValidTestCase ? '✅ Caso teste validado' : '❌ Erro na validação'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Textos Carregados:</h4>
                      <p className="text-sm">Total: {Object.keys(texts).length} textos do Supabase</p>
                      <div className="max-h-32 overflow-y-auto text-xs bg-muted p-2 rounded">
                        {Object.keys(texts).map(key => (
                          <div key={key}>{key}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NumerologyMapEditor;