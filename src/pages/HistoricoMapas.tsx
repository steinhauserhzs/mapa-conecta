import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Edit, FileText, Filter, Calendar, User, Download, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MapaPDF from "@/components/MapaPDF";

interface MapHistory {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  client_name?: string;
  client_id?: string;
  input: any;
  result: any;
  pdf_url?: string;
}

export default function HistoricoMapas() {
  const [maps, setMaps] = useState<MapHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedMap, setSelectedMap] = useState<MapHistory | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('maps')
        .select(`
          id,
          title,
          type,
          status,
          created_at,
          input,
          result,
          client_id,
          pdf_url,
          clients (
            name
          )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMaps = data?.map(map => ({
        ...map,
        client_name: map.clients?.name || undefined
      })) || [];

      setMaps(formattedMaps);
    } catch (error) {
      console.error('Erro ao buscar mapas:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'personal': 'Pessoal',
      'business': 'Empresarial',
      'child': 'Infantil'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default">Concluído</Badge>;
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'processing':
        return <Badge variant="outline">Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDateFilterLabel = (date: string) => {
    const now = new Date();
    const mapDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - mapDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays <= 7) return 'Última semana';
    if (diffDays <= 30) return 'Último mês';
    if (diffDays <= 90) return 'Últimos 3 meses';
    return 'Mais antigo';
  };

  const filteredMaps = maps.filter(map => {
    const matchesSearch = 
      map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.input?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || map.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || map.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const mapDate = new Date(map.created_at);
      const diffDays = Math.floor((now.getTime() - mapDate.getTime()) / (1000 * 3600 * 24));

      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays === 0;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
        case '3months':
          matchesDate = diffDays <= 90;
          break;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleViewMap = (map: MapHistory) => {
    setSelectedMap(map);
    setIsViewDialogOpen(true);
  };

  const handleEditMap = (mapId: string) => {
    window.location.href = `/mapas/editar/${mapId}`;
  };

  const handleDownloadPDF = async (map: MapHistory) => {
    try {
      setIsGeneratingPDF(map.id);

      // Se já tem PDF, fazer download direto
      if (map.pdf_url) {
        const link = document.createElement('a');
        link.href = map.pdf_url;
        link.download = `${map.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        link.click();
        
        toast({
          title: "Download iniciado",
          description: "O PDF está sendo baixado.",
        });
        return;
      }

      // Gerar PDF se não existir
      const { data, error } = await supabase.functions.invoke('generate-professional-pdf', {
        body: { mapId: map.id }
      });

      if (error) throw error;

      if (data?.pdf_url) {
        // Atualizar o mapa local com a nova URL
        setMaps(prev => prev.map(m => 
          m.id === map.id ? { ...m, pdf_url: data.pdf_url } : m
        ));

        // Fazer download
        const link = document.createElement('a');
        link.href = data.pdf_url;
        link.download = `${map.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        link.click();

        toast({
          title: "PDF gerado com sucesso",
          description: "O download foi iniciado automaticamente.",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar/baixar PDF:', error);
      toast({
        title: "Erro no download",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  const getPDFStatus = (map: MapHistory) => {
    if (map.pdf_url) {
      return <Badge variant="default" className="bg-green-500">PDF Pronto</Badge>;
    }
    return <Badge variant="outline">Gerar PDF</Badge>;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Mapas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os mapas numerológicos gerados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, cliente ou título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="business">Empresarial</SelectItem>
                  <SelectItem value="child">Infantil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ready">Concluído</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mapas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mapas Gerados ({filteredMaps.length})
          </CardTitle>
          <CardDescription>
            Histórico completo de todos os mapas numerológicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMaps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {maps.length === 0 ? (
                <>
                  Nenhum mapa gerado ainda.
                  <br />
                  <Button className="mt-4" onClick={() => window.location.href = '/mapas/gerador'}>
                    Gerar Primeiro Mapa
                  </Button>
                </>
              ) : (
                'Nenhum mapa encontrado com os filtros aplicados.'
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título / Nome</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaps.map((map) => (
                  <TableRow key={map.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{map.title}</div>
                        {map.input?.name && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {map.input.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {map.client_name ? (
                        <div className="text-sm">{map.client_name}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Sem cliente</div>
                      )}
                    </TableCell>
                    <TableCell>{getTypeLabel(map.type)}</TableCell>
                    <TableCell>{getStatusBadge(map.status)}</TableCell>
                    <TableCell>{getPDFStatus(map)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(map.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDateFilterLabel(map.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMap(map)}
                          title="Visualizar mapa"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditMap(map.id)}
                          title="Editar mapa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleDownloadPDF(map)}
                          disabled={isGeneratingPDF === map.id}
                          title={map.pdf_url ? "Download PDF" : "Gerar e baixar PDF"}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isGeneratingPDF === map.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        {map.pdf_url && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(map.pdf_url, '_blank')}
                            title="Abrir PDF em nova aba"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Mapa Numerológico</DialogTitle>
            <DialogDescription>
              {selectedMap?.title} - {selectedMap && getTypeLabel(selectedMap.type)}
            </DialogDescription>
          </DialogHeader>
          {selectedMap && (
            <div className="mt-4">
              <MapaPDF data={selectedMap.result || {}} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}