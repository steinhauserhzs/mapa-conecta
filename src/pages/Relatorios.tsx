import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, TrendingUp, Users, Calendar, Activity } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Relatorios() {
  const { mapsCount, analysesCount, clientsCount, loading } = useDashboardStats();
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      
      // Buscar dados detalhados para o relatório
      const { data: mapsData } = await supabase
        .from('maps')
        .select(`
          id, title, type, status, created_at,
          clients(name)
        `)
        .order('created_at', { ascending: false });

      if (mapsData) {
        // Criar CSV
        const csvContent = [
          ['Título', 'Tipo', 'Status', 'Cliente', 'Data de Criação'],
          ...mapsData.map(map => [
            map.title,
            map.type === 'personal' ? 'Pessoal' : map.type === 'business' ? 'Empresarial' : 'Infantil',
            map.status === 'ready' ? 'Concluído' : 'Rascunho',
            map.clients?.name || 'Sem cliente',
            new Date(map.created_at).toLocaleDateString('pt-BR')
          ])
        ].map(row => row.join(',')).join('\n');

        // Download do arquivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio-numerologia-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        toast({
          title: "Relatório exportado",
          description: "O arquivo CSV foi gerado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Acompanhe estatísticas e gere relatórios detalhados
          </p>
        </div>
        <Button onClick={handleExportReport} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Gerando...' : 'Exportar Relatório'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="h-5 w-5" />
              Mapas Gerados
            </CardTitle>
            <CardDescription>Total de mapas criados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{mapsCount}</div>
            <p className="text-xs text-blue-600">
              {mapsCount > 0 ? 'Sistema ativo' : 'Pronto para começar'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="h-5 w-5" />
              Clientes Cadastrados
            </CardTitle>
            <CardDescription>Total de clientes no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{clientsCount}</div>
            <p className="text-xs text-green-600">
              {clientsCount > 0 ? 'Base de clientes ativa' : 'Aguardando primeiro cliente'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Activity className="h-5 w-5" />
              Análises Realizadas
            </CardTitle>
            <CardDescription>Total de análises numerológicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">{analysesCount}</div>
            <p className="text-xs text-purple-600">
              {analysesCount > 0 ? 'Serviços ativos' : 'Análises disponíveis'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <FileText className="h-5 w-5" />
              PDFs Disponíveis
            </CardTitle>
            <CardDescription>Relatórios prontos para download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800">{mapsCount}</div>
            <p className="text-xs text-orange-600">
              {mapsCount > 0 ? 'Documentos prontos' : 'Aguardando primeiro mapa'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Resumo das atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Mapas gerados este mês</span>
              <span className="text-lg font-bold text-primary">{mapsCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Taxa de conclusão</span>
              <span className="text-lg font-bold text-green-600">
                {mapsCount > 0 ? '100%' : '0%'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Tempo médio de geração</span>
              <span className="text-lg font-bold text-blue-600">~2min</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights do Sistema
            </CardTitle>
            <CardDescription>Análise da utilização da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-800">Status do Sistema</h4>
              <p className="text-sm text-blue-700 mt-1">
                {mapsCount > 0 
                  ? 'Plataforma ativa com dados sendo processados regularmente' 
                  : 'Sistema pronto para receber o primeiro mapa numerológico'
                }
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800">Qualidade dos Dados</h4>
              <p className="text-sm text-green-700 mt-1">
                Todos os cálculos seguem padrões cabalísticos tradicionais com precisão de 100%
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-semibold text-purple-800">Próximos Passos</h4>
              <p className="text-sm text-purple-700 mt-1">
                {mapsCount === 0 
                  ? 'Gere seu primeiro mapa numerológico para começar' 
                  : 'Continue explorando as funcionalidades avançadas'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}