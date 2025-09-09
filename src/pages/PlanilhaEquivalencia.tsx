import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Dados da planilha de equivalência baseados na imagem compartilhada
const equivalenceData = [
  {
    destino: 1,
    favoraveis: [1, 5, 7],
    desfavoraveis: [2, 4, 6, 8, 9],
    neutros: [3]
  },
  {
    destino: 2,
    favoraveis: [2, 4, 6, 8],
    desfavoraveis: [1, 5, 7, 9],
    neutros: [3]
  },
  {
    destino: 3,
    favoraveis: [3, 6, 9],
    desfavoraveis: [1, 2, 4, 5, 7, 8],
    neutros: []
  },
  {
    destino: 4,
    favoraveis: [2, 4, 6, 8],
    desfavoraveis: [1, 3, 5, 7, 9],
    neutros: []
  },
  {
    destino: 5,
    favoraveis: [1, 5, 7],
    desfavoraveis: [2, 4, 6, 8, 9],
    neutros: [3]
  },
  {
    destino: 6,
    favoraveis: [2, 3, 4, 6, 8, 9],
    desfavoraveis: [1, 5, 7],
    neutros: []
  },
  {
    destino: 7,
    favoraveis: [1, 5, 7],
    desfavoraveis: [2, 4, 6, 8, 9],
    neutros: [3]
  },
  {
    destino: 8,
    favoraveis: [2, 4, 6, 8],
    desfavoraveis: [1, 3, 5, 7, 9],
    neutros: []
  },
  {
    destino: 9,
    favoraveis: [3, 6, 9],
    desfavoraveis: [1, 2, 4, 5, 7, 8],
    neutros: []
  },
  {
    destino: 11,
    favoraveis: [2, 4, 6, 8, 11],
    desfavoraveis: [1, 3, 5, 7, 9],
    neutros: []
  },
  {
    destino: 22,
    favoraveis: [2, 4, 6, 8, 11, 22],
    desfavoraveis: [1, 3, 5, 7, 9],
    neutros: []
  }
];

export default function PlanilhaEquivalencia() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = equivalenceData.filter(item => 
    item.destino.toString().includes(searchTerm)
  );

  const handleExportPDF = () => {
    // Implementação futura para export PDF
    console.log('Export PDF functionality to be implemented');
  };

  const getCellClass = (type: 'favoravel' | 'desfavoravel' | 'neutro') => {
    const variants = {
      favoravel: 'bg-green-50 text-green-800 border-green-200',
      desfavoravel: 'bg-red-50 text-red-800 border-red-200',
      neutro: 'bg-blue-50 text-blue-800 border-blue-200'
    };
    return variants[type];
  };

  const renderNumbersInCell = (numbers: number[], type: 'favoravel' | 'desfavoravel' | 'neutro') => {
    if (numbers.length === 0) return '-';
    return numbers.join(', ');
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planilha de Equivalência</h1>
            <p className="text-muted-foreground">
              Tabela de compatibilidade numerológica para análise de relacionamentos
            </p>
          </div>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Explicação */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Como Usar a Planilha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Números Favoráveis (Verde):</strong> Compatibilidade alta, relacionamentos harmoniosos</p>
              <p><strong>Números Desfavoráveis (Vermelho):</strong> Possíveis conflitos, requer mais esforço</p>
              <p><strong>Números Neutros (Azul):</strong> Compatibilidade moderada, neutros</p>
              <p className="mt-4 p-3 bg-muted/50 rounded-lg">
                <strong>Regra do Número de Missão:</strong> Quando ambos os parceiros têm o mesmo número de missão/destino, 
                a compatibilidade é automaticamente favorável, independente da tabela.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filtro de busca */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar número de destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-sm font-medium">Números Favoráveis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-sm font-medium">Números Desfavoráveis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-sm font-medium">Números Neutros</span>
          </div>
        </div>

        {/* Tabela Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Planilha de Equivalência Numerológica</CardTitle>
            <CardDescription>
              Tabela completa de compatibilidade entre números de destino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center font-bold">Número de Destino</TableHead>
                    <TableHead className="text-center font-bold">Números Favoráveis</TableHead>
                    <TableHead className="text-center font-bold">Números Desfavoráveis</TableHead>
                    <TableHead className="text-center font-bold">Números Neutros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.destino} className="hover:bg-muted/50">
                      <TableCell className="text-center font-bold text-lg bg-primary/10">
                        {item.destino}
                      </TableCell>
                      <TableCell className={`text-center ${getCellClass('favoravel')} border`}>
                        {renderNumbersInCell(item.favoraveis, 'favoravel')}
                      </TableCell>
                      <TableCell className={`text-center ${getCellClass('desfavoravel')} border`}>
                        {renderNumbersInCell(item.desfavoraveis, 'desfavoravel')}
                      </TableCell>
                      <TableCell className={`text-center ${getCellClass('neutro')} border`}>
                        {renderNumbersInCell(item.neutros, 'neutro')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum resultado encontrado para "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}