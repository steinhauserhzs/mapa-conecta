import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    item.destino.toString().includes(searchTerm) ||
    item.favoraveis.some(num => num.toString().includes(searchTerm)) ||
    item.desfavoraveis.some(num => num.toString().includes(searchTerm)) ||
    item.neutros.some(num => num.toString().includes(searchTerm))
  );

  const handleExportPDF = () => {
    // Implementação futura para export PDF
    console.log('Export PDF functionality to be implemented');
  };

  const renderNumberBadge = (number: number, type: 'favoravel' | 'desfavoravel' | 'neutro') => {
    const variants = {
      favoravel: 'bg-green-100 text-green-800 border-green-200',
      desfavoravel: 'bg-red-100 text-red-800 border-red-200',
      neutro: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge key={number} variant="outline" className={`${variants[type]} m-1`}>
        {number}
      </Badge>
    );
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
            placeholder="Buscar por número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">Exemplo</Badge>
            <span className="text-sm">Favoráveis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800 border-red-200">Exemplo</Badge>
            <span className="text-sm">Desfavoráveis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Exemplo</Badge>
            <span className="text-sm">Neutros</span>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.destino} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center">
                  <div className="text-2xl font-bold text-primary bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    {item.destino}
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  Número de Destino {item.destino}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Números Favoráveis */}
                <div>
                  <h4 className="text-sm font-semibold text-green-700 mb-2">
                    Favoráveis ({item.favoraveis.length})
                  </h4>
                  <div className="flex flex-wrap min-h-[2rem]">
                    {item.favoraveis.map(num => renderNumberBadge(num, 'favoravel'))}
                  </div>
                </div>

                {/* Números Desfavoráveis */}
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2">
                    Desfavoráveis ({item.desfavoraveis.length})
                  </h4>
                  <div className="flex flex-wrap min-h-[2rem]">
                    {item.desfavoraveis.map(num => renderNumberBadge(num, 'desfavoravel'))}
                  </div>
                </div>

                {/* Números Neutros */}
                {item.neutros.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">
                      Neutros ({item.neutros.length})
                    </h4>
                    <div className="flex flex-wrap min-h-[2rem]">
                      {item.neutros.map(num => renderNumberBadge(num, 'neutro'))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum resultado encontrado para "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Calculadora rápida de compatibilidade */}
        <Card>
          <CardHeader>
            <CardTitle>Calculadora Rápida de Compatibilidade</CardTitle>
            <CardDescription>
              Em breve: ferramenta para calcular compatibilidade entre dois números de destino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Funcionalidade em desenvolvimento
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}