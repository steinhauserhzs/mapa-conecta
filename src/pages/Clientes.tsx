import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Edit, Trash2, Phone, Mail, Calendar, FileText, MapPin, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

interface ClientMap {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

interface ClientService {
  id: string;
  service_type: string;
  service_data: any;
  created_at: string;
  map_id?: string;
}

interface ClientStats {
  totalMaps: number;
  totalServices: number;
  lastService?: string;
}

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientMaps, setClientMaps] = useState<ClientMap[]>([]);
  const [clientServices, setClientServices] = useState<ClientService[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats>({ totalMaps: 0, totalServices: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    address: "",
    notes: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientDetails = async (client: Client) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) return;

      // Buscar mapas do cliente
      const { data: mapsData } = await supabase
        .from('maps')
        .select('id, title, type, status, created_at')
        .eq('client_id', client.id)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // Buscar serviços do cliente
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('client_id', client.id)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      setClientMaps(mapsData || []);
      setClientServices(servicesData || []);
      setClientStats({
        totalMaps: mapsData?.length || 0,
        totalServices: servicesData?.length || 0,
        lastService: servicesData?.[0]?.created_at
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) throw new Error('Perfil não encontrado');

      const clientData = {
        ...formData,
        user_id: profile.id,
        birth_date: formData.birth_date || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        notes: formData.notes || null
      };

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id);
        if (error) throw error;
        
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([clientData]);
        if (error) throw error;
        
        toast({
          title: "Cliente adicionado",
          description: "Novo cliente adicionado com sucesso.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      birth_date: client.birth_date || "",
      address: client.address || "",
      notes: client.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Todos os mapas e serviços serão removidos.')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Cliente excluído",
        description: "Cliente e todos os dados relacionados foram removidos.",
      });
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao excluir cliente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      birth_date: "",
      address: "",
      notes: ""
    });
    setEditingClient(null);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    fetchClientDetails(client);
  };

  const handleGenerateMapForClient = (client: Client) => {
    // Navigate to map generator with client pre-selected
    navigate('/mapas/gerador', { state: { selectedClient: client } });
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'map_generation': 'Mapa Numerológico',
      'phone_analysis': 'Análise de Telefone',
      'address_analysis': 'Análise de Endereço',
      'plate_analysis': 'Análise de Placa',
      'signature_correction': 'Correção de Assinatura'
    };
    return labels[type] || type;
  };

  const getMapTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'personal': 'Pessoal',
      'business': 'Empresarial',
      'child': 'Infantil'
    };
    return labels[type] || type;
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes e histórico completo de serviços
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                {editingClient ? "Altere os dados do cliente" : "Preencha os dados do novo cliente"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingClient ? "Atualizar" : "Adicionar"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedClient ? (
        // Visualização detalhada do cliente
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              ← Voltar
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
              <p className="text-muted-foreground">
                Cliente desde {new Date(selectedClient.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{clientStats.totalMaps}</p>
                    <p className="text-sm text-muted-foreground">Mapas Gerados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{clientStats.totalServices}</p>
                    <p className="text-sm text-muted-foreground">Serviços Prestados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleGenerateMapForClient(selectedClient)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Mapa
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleEdit(selectedClient)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Cliente
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="maps" className="space-y-4">
            <TabsList>
              <TabsTrigger value="maps">Mapas ({clientStats.totalMaps})</TabsTrigger>
              <TabsTrigger value="services">Histórico ({clientStats.totalServices})</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            <TabsContent value="maps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mapas Numerológicos</CardTitle>
                  <CardDescription>
                    Todos os mapas gerados para este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientMaps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum mapa gerado ainda.
                      <br />
                      <Button 
                        className="mt-4" 
                        onClick={() => handleGenerateMapForClient(selectedClient)}
                      >
                        Gerar Primeiro Mapa
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientMaps.map((map) => (
                          <TableRow key={map.id}>
                            <TableCell className="font-medium">{map.title}</TableCell>
                            <TableCell>{getMapTypeLabel(map.type)}</TableCell>
                            <TableCell>
                              <Badge variant={map.status === 'completed' ? 'default' : 'secondary'}>
                                {map.status === 'completed' ? 'Concluído' : 'Rascunho'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(map.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Serviços</CardTitle>
                  <CardDescription>
                    Todos os serviços prestados para este cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientServices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum serviço registrado ainda.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Detalhes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              {getServiceTypeLabel(service.service_type)}
                            </TableCell>
                            <TableCell>
                              {new Date(service.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {service.map_id && (
                                <Badge variant="outline">Mapa Associado</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="text-sm">{selectedClient.name}</p>
                    </div>
                    {selectedClient.email && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                        <p className="text-sm">{selectedClient.email}</p>
                      </div>
                    )}
                    {selectedClient.phone && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                        <p className="text-sm">{selectedClient.phone}</p>
                      </div>
                    )}
                    {selectedClient.birth_date && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                        <p className="text-sm">
                          {new Date(selectedClient.birth_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                        <p className="text-sm">{selectedClient.address}</p>
                      </div>
                    )}
                    {selectedClient.notes && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                        <p className="text-sm">{selectedClient.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Lista de clientes
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Clientes ({filteredClients.length})
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os seus clientes cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
                  <br />
                  {!searchTerm && 'Clique em "Novo Cliente" para começar.'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Data de Nascimento</TableHead>
                      <TableHead>Cadastrado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.birth_date && (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(client.birth_date).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClient(client)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(client.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}