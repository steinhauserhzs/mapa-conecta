import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNumerologia } from '@/hooks/useNumerologia';
import { validateTestCase } from '@/lib/numerologia';

const TestNumerologia = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Test case: Hairã Zupanc Steinhauser (11/05/2000)
  const { result: testResult, loading, error, isValidTestCase } = useNumerologia({
    nome: 'Hairã Zupanc Steinhauser',
    data: '2000-05-11'
  });

  const expectedResults = {
    motivation: 22,
    impression: 7,
    expression: 11,
    destiny: 9,
    mission: 2,
    karmicLessons: [9],
    karmicDebts: [13],
    hiddenTendencies: [1, 5],
    subconsciousResponse: 8,
    lifeCycles: [5, 11, 2],
    challenges: [6, 9, 3],
    decisiveMoments: [7, 4, 7, 9]
  };

  const runTests = () => {
    setIsRunning(true);
    
    const tests = [];
    
    if (testResult) {
      // Individual number tests
      tests.push({
        name: 'Motivação',
        expected: expectedResults.motivation,
        actual: testResult.motivation,
        passed: testResult.motivation === expectedResults.motivation
      });
      
      tests.push({
        name: 'Impressão',
        expected: expectedResults.impression,
        actual: testResult.impression,
        passed: testResult.impression === expectedResults.impression
      });
      
      tests.push({
        name: 'Expressão',
        expected: expectedResults.expression,
        actual: testResult.expression,
        passed: testResult.expression === expectedResults.expression
      });
      
      tests.push({
        name: 'Destino',
        expected: expectedResults.destiny,
        actual: testResult.destiny,
        passed: testResult.destiny === expectedResults.destiny
      });
      
      tests.push({
        name: 'Missão',
        expected: expectedResults.mission,
        actual: testResult.mission,
        passed: testResult.mission === expectedResults.mission
      });
      
      tests.push({
        name: 'Lições Cármicas',
        expected: expectedResults.karmicLessons,
        actual: testResult.karmicLessons,
        passed: JSON.stringify(testResult.karmicLessons) === JSON.stringify(expectedResults.karmicLessons)
      });
      
      tests.push({
        name: 'Dívidas Cármicas',
        expected: expectedResults.karmicDebts,
        actual: testResult.karmicDebts,
        passed: JSON.stringify(testResult.karmicDebts) === JSON.stringify(expectedResults.karmicDebts)
      });
      
      tests.push({
        name: 'Tendências Ocultas',
        expected: expectedResults.hiddenTendencies,
        actual: testResult.hiddenTendencies,
        passed: JSON.stringify(testResult.hiddenTendencies) === JSON.stringify(expectedResults.hiddenTendencies)
      });
      
      tests.push({
        name: 'Resposta Subconsciente',
        expected: expectedResults.subconsciousResponse,
        actual: testResult.subconsciousResponse,
        passed: testResult.subconsciousResponse === expectedResults.subconsciousResponse
      });
      
      tests.push({
        name: 'Ciclos de Vida',
        expected: expectedResults.lifeCycles,
        actual: testResult.lifeCycles,
        passed: JSON.stringify(testResult.lifeCycles) === JSON.stringify(expectedResults.lifeCycles)
      });
      
      tests.push({
        name: 'Desafios',
        expected: expectedResults.challenges,
        actual: testResult.challenges,
        passed: JSON.stringify(testResult.challenges) === JSON.stringify(expectedResults.challenges)
      });
      
      tests.push({
        name: 'Momentos Decisivos',
        expected: expectedResults.decisiveMoments,
        actual: testResult.decisiveMoments,
        passed: JSON.stringify(testResult.decisiveMoments) === JSON.stringify(expectedResults.decisiveMoments)
      });
    }
    
    setTestResults(tests);
    setIsRunning(false);
  };

  useEffect(() => {
    if (testResult && !loading) {
      runTests();
    }
  }, [testResult, loading]);

  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;
  const allPassed = passedTests === totalTests && totalTests > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Teste do Sistema Numerológico</h1>
          <p className="text-muted-foreground">
            Validação do caso de ouro: Hairã Zupanc Steinhauser (11/05/2000)
          </p>
        </div>

        {/* Status Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {loading ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : allPassed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Resultado da validação automática
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando e calculando...</p>
            ) : error ? (
              <p className="text-red-500">Erro: {error}</p>
            ) : (
              <div className="space-y-2">
                <p>
                  <Badge variant={allPassed ? "default" : "destructive"}>
                    {passedTests}/{totalTests} testes passaram
                  </Badge>
                </p>
                <p>
                  Sistema de validação integrado: {' '}
                  <Badge variant={isValidTestCase ? "default" : "destructive"}>
                    {isValidTestCase ? "✅ Válido" : "❌ Inválido"}
                  </Badge>
                </p>
                {allPassed && (
                  <p className="text-green-600 font-medium">
                    🎉 Parabéns! O sistema numerológico está funcionando corretamente!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados Detalhados */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados Detalhados</CardTitle>
              <CardDescription>
                Comparação entre valores esperados e calculados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        {test.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{test.name}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>
                        <span className="text-muted-foreground">Esperado: </span>
                        <span className="font-mono">
                          {Array.isArray(test.expected) 
                            ? `[${test.expected.join(', ')}]` 
                            : test.expected}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Calculado: </span>
                        <span className={`font-mono ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {Array.isArray(test.actual) 
                            ? `[${test.actual.join(', ')}]` 
                            : test.actual}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Números Calculados */}
        {testResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Números Calculados Completos</CardTitle>
              <CardDescription>
                Todos os números calculados para Hairã Zupanc Steinhauser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.motivation}</div>
                  <div className="text-sm text-muted-foreground">Motivação</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.impression}</div>
                  <div className="text-sm text-muted-foreground">Impressão</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.expression}</div>
                  <div className="text-sm text-muted-foreground">Expressão</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.destiny}</div>
                  <div className="text-sm text-muted-foreground">Destino</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.mission}</div>
                  <div className="text-sm text-muted-foreground">Missão</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.psychic}</div>
                  <div className="text-sm text-muted-foreground">Psíquico</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold">{testResult.subconsciousResponse}</div>
                  <div className="text-sm text-muted-foreground">Resp. Subcons.</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-sm font-bold">[{testResult.lifeCycles.join(', ')}]</div>
                  <div className="text-sm text-muted-foreground">Ciclos de Vida</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-sm font-bold">[{testResult.challenges.join(', ')}]</div>
                  <div className="text-sm text-muted-foreground">Desafios</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-sm font-bold">[{testResult.decisiveMoments.join(', ')}]</div>
                  <div className="text-sm text-muted-foreground">Momentos Decisivos</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-sm font-bold">[{testResult.karmicLessons.join(', ')}]</div>
                  <div className="text-sm text-muted-foreground">Lições Cármicas</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-sm font-bold">[{testResult.karmicDebts.join(', ')}]</div>
                  <div className="text-sm text-muted-foreground">Dívidas Cármicas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Button onClick={runTests} disabled={isRunning || loading}>
            {isRunning ? 'Executando Testes...' : 'Executar Testes Novamente'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestNumerologia;