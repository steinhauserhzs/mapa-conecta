import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, FileText, Calculator } from "lucide-react";
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
    return editableTexts[key] || texts[key]?.body || `Texto não encontrado: ${key}`;
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mapa Numerológico – Editor</h1>
          <div className="flex gap-2">
            <Button onClick={printReport} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
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

            {/* Os Seus Números */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Os Seus Números</CardTitle>
                  <CardDescription>Números fundamentais da sua personalidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.motivation}</div>
                      <div className="text-sm text-muted-foreground">Motivação</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.impression}</div>
                      <div className="text-sm text-muted-foreground">Impressão</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.expression}</div>
                      <div className="text-sm text-muted-foreground">Expressão</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.destiny}</div>
                      <div className="text-sm text-muted-foreground">Destino</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.mission}</div>
                      <div className="text-sm text-muted-foreground">Missão</div>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.psychic}</div>
                      <div className="text-sm text-muted-foreground">Psíquico</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Map Tab - Complete Report */}
          <TabsContent value="map" className="space-y-6">
            <div id="numerology-report" className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Mapa Numerológico</h1>
                <h2 className="text-2xl">{name}</h2>
                <p className="text-lg text-muted-foreground">
                  Data de Nascimento: {birthDate}
                </p>
              </div>

              {result && (
                <div className="space-y-6">
                  {/* Os Seus Números Grid */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Os Seus Números</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.motivation}</div>
                          <div className="font-medium">Motivação</div>
                        </div>
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.impression}</div>
                          <div className="font-medium">Impressão</div>
                        </div>
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.expression}</div>
                          <div className="font-medium">Expressão</div>
                        </div>
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.destiny}</div>
                          <div className="font-medium">Destino</div>
                        </div>
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.mission}</div>
                          <div className="font-medium">Missão</div>
                        </div>
                        <div className="text-center p-6 bg-primary/5 rounded-2xl">
                          <div className="text-3xl font-bold text-primary mb-2">{result.psychic}</div>
                          <div className="font-medium">Número Psíquico</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Sections */}
                  {[
                    { key: `motivacao-${result.motivation}`, title: `Motivação (${result.motivation})` },
                    { key: `impressao-${result.impression}`, title: `Impressão (${result.impression})` },
                    { key: `expressao-${result.expression}`, title: `Expressão (${result.expression})` },
                    { key: `destino-${result.destiny}`, title: `Destino (${result.destiny})` },
                    { key: `missao-${result.mission}`, title: `Missão (${result.mission})` },
                    { key: `psiquico-${result.psychic}`, title: `Número Psíquico (${result.psychic})` }
                  ].map(section => (
                    <Card key={section.key}>
                      <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {getDisplayText(section.key)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                {result && Object.keys(texts).map(key => (
                  <div key={key} className="mb-4">
                    <Label htmlFor={`${key}-text`}>{key}</Label>
                    <Textarea
                      id={`${key}-text`}
                      value={editableTexts[key] || texts[key]?.body || ''}
                      onChange={(e) => updateText(key, e.target.value)}
                      rows={4}
                    />
                  </div>
                ))}
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
                      <h4 className="font-semibold">Números Calculados:</h4>
                      <p>Motivação: {result.motivation} | Impressão: {result.impression} | Expressão: {result.expression}</p>
                      <p>Destino: {result.destiny} | Missão: {result.mission} | Psíquico: {result.psychic}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Validação:</h4>
                      <p className={isValidTestCase ? 'text-green-600' : 'text-red-600'}>
                        {isValidTestCase ? '✅ Caso teste validado' : '❌ Erro na validação'}
                      </p>
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