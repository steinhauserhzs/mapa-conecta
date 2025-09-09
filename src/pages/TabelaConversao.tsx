import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, Calculator } from "lucide-react";

// Dados da tabela de conversão baseados na imagem compartilhada
const conversionData = [
  {
    numero: 1,
    letras: ['A', 'I', 'Q', 'J', 'Y'],
    observacao: ''
  },
  {
    numero: 2,
    letras: ['B', 'K', 'R'],
    observacao: "' +2 (APÓSTROFO), .. x2"
  },
  {
    numero: 3,
    letras: ['C', 'G', 'L', 'S'],
    observacao: '~ +3'
  },
  {
    numero: 4,
    letras: ['D', 'M', 'T'],
    observacao: ''
  },
  {
    numero: 5,
    letras: ['E', 'H', 'N'],
    observacao: ''
  },
  {
    numero: 6,
    letras: ['U', 'V', 'W', 'X', 'Ç'],
    observacao: ''
  },
  {
    numero: 7,
    letras: ['O', 'Z'],
    observacao: '^ +7, ° +7'
  },
  {
    numero: 8,
    letras: ['F', 'P'],
    observacao: ''
  }
];

// Alfabeto completo para referência rápida
const alphabetMapping = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5, 'I': 1,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8, 'Q': 1, 'R': 2,
  'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 6, 'Y': 1, 'Z': 7, 'Ç': 6
};

export default function TabelaConversao() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabela de Conversão</h1>
          <p className="text-muted-foreground">
            Conversão de letras para números na numerologia
          </p>
        </div>
      </div>

      {/* Explicação */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Como Usar a Tabela
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Conversão Básica:</strong> Cada letra do alfabeto corresponde a um número de 1 a 8</p>
            <p><strong>Símbolos Especiais:</strong> Apóstrofo (') = +2, Til (~) = +3, Circunflexo (^) e Grau (°) = +7</p>
            <p><strong>Multiplicadores:</strong> Dois pontos (..) = x2 para o número anterior</p>
            <p className="mt-4 p-3 bg-muted/50 rounded-lg">
              <strong>Exemplo:</strong> MARIA = M(4) + A(1) + R(2) + I(1) + A(1) = 9
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Principal de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Conversão Numerológica</CardTitle>
          <CardDescription>
            Correspondência entre letras e números
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Versão Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold bg-primary/10">Número</TableHead>
                  <TableHead className="text-center font-bold">Letras</TableHead>
                  <TableHead className="text-center font-bold">Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversionData.map((item) => (
                  <TableRow key={item.numero} className="hover:bg-muted/50">
                    <TableCell className="text-center font-bold text-2xl text-primary bg-primary/5">
                      {item.numero}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        {item.letras.map((letra, index) => (
                          <span 
                            key={index}
                            className="bg-accent text-accent-foreground px-3 py-1 rounded-md font-medium"
                          >
                            {letra}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {item.observacao || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Versão Mobile */}
          <div className="md:hidden space-y-4">
            {conversionData.map((item) => (
              <Card key={item.numero} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-center">
                    <div className="text-3xl font-bold text-primary bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      {item.numero}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Letras:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.letras.map((letra, index) => (
                        <span 
                          key={index}
                          className="bg-accent text-accent-foreground px-3 py-1 rounded-md font-medium"
                        >
                          {letra}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.observacao && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Observações:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        {item.observacao}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alfabeto Completo de Referência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Referência Rápida - Alfabeto Completo
          </CardTitle>
          <CardDescription>
            Visualização rápida de todas as letras e seus números correspondentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {Object.entries(alphabetMapping).map(([letra, numero]) => (
              <div 
                key={letra}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border rounded-lg p-3 text-center hover:shadow-md transition-all"
              >
                <div className="text-xl font-bold text-primary mb-1">{letra}</div>
                <div className="text-sm text-muted-foreground">→ {numero}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculadora de Nome (Em breve) */}
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Nome</CardTitle>
          <CardDescription>
            Em breve: ferramenta para calcular automaticamente o valor numerológico de nomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Funcionalidade em desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  );
}