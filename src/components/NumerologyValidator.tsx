import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runValidationTests, ValidationResult } from '@/lib/validationTests';

export const NumerologyValidator: React.FC = () => {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    const testResults = runValidationTests();
    setResults(testResults);
    setIsRunning(false);
  };

  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Validação dos Cálculos Numerológicos
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? 'Executando...' : 'Executar Testes'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {results.length > 0 && (
          <>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <strong>Resumo:</strong> {passedTests}/{totalTests} testes passaram ({passRate}%)
              </div>
              <Badge variant={passedTests === totalTests ? "default" : "destructive"}>
                {passedTests === totalTests ? "✅ Todos os testes passaram" : "⚠️ Alguns testes falharam"}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.passed 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.test}</span>
                    <Badge variant={result.passed ? "default" : "destructive"}>
                      {result.passed ? "✅ PASSOU" : "❌ FALHOU"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Esperado: <span className="font-mono">{result.expected}</span> | 
                    Obtido: <span className="font-mono">{result.actual}</span>
                  </div>
                  
                  {!result.passed && result.details && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Ver detalhes</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        {results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Clique no botão "Executar Testes" para validar os cálculos numerológicos.
          </div>
        )}
      </CardContent>
    </Card>
  );
};