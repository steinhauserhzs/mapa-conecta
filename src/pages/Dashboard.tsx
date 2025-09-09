import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  Phone, 
  MapPin, 
  Car, 
  Settings, 
  Users, 
  BarChart3, 
  Crown,
  Star,
  Coins
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateMapModal } from '@/components/CreateMapModal';

interface Map {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Analysis {
  id: string;
  type: string;
  input: any;
  result: any;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [maps, setMaps] = useState<Map[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchUserData();
    }
  }, [user, profile]);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch user maps
      const { data: mapsData, error: mapsError } = await supabase
        .from('maps')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (mapsError) throw mapsError;
      setMaps(mapsData || []);

      // Fetch user analyses
      const { data: analysesData, error: analysesError } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (analysesError) throw analysesError;
      setAnalyses(analysesData || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const getMapTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      personal: 'Pessoal',
      business: 'Empresarial',
      baby: 'Bebê/Criança',
      marriage: 'Casamento',
      phone: 'Telefone',
      address: 'Endereço',
      license_plate: 'Placa'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'secondary',
      ready: 'default',
      archived: 'outline'
    };
    
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      ready: 'Pronto',
      archived: 'Arquivado'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mystical">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-primary-light">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-mystical">
      {/* Background Stars Animation */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">
                  Bem-vindo, {profile?.name || user.email}
                </p>
                {isAdmin && (
                  <Badge variant="default" className="bg-accent-gold text-black">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20">
                <Coins className="h-4 w-4 text-accent-gold" />
                <span className="font-semibold">{profile?.credits || 0} créditos</span>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Mapa
              </Button>
        </div>
      </div>

      <CreateMapModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onMapCreated={fetchUserData}
      />
    </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mapas Criados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maps.length}</div>
              <p className="text-xs text-muted-foreground">
                Total de mapas numerológicos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Análises</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyses.length}</div>
              <p className="text-xs text-muted-foreground">
                Telefones, endereços e placas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-gold">Ativo</div>
              <p className="text-xs text-muted-foreground">
                Plano atual
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.credits || 0}</div>
              <p className="text-xs text-muted-foreground">
                Mapas disponíveis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="maps" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full lg:w-auto bg-background/80 backdrop-blur-sm">
            <TabsTrigger value="maps">Mapas</TabsTrigger>
            <TabsTrigger value="analyses">Análises</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          <TabsContent value="maps" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Meus Mapas Numerológicos</h2>
                <p className="text-muted-foreground">
                  Gerencie e crie novos mapas numerológicos
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-background/50">
                  <FileText className="h-4 w-4 mr-2" />
                  Pessoal
                </Button>
                <Button variant="outline" className="bg-background/50">
                  <Users className="h-4 w-4 mr-2" />
                  Empresarial
                </Button>
              </div>
            </div>

            {maps.length === 0 ? (
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum mapa criado ainda</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Comece criando seu primeiro mapa numerológico para desvendar os mistérios dos números
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Mapa
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {maps.map((map) => (
                  <Card key={map.id} className="bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{map.title}</h3>
                          {getStatusBadge(map.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Tipo: {getMapTypeLabel(map.type)}</span>
                          <span>Criado: {new Date(map.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="default" size="sm">
                          Ver Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analyses" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Análises Rápidas</h2>
                <p className="text-muted-foreground">
                  Análises de telefones, endereços e placas de veículos
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-background/50">
                  <Phone className="h-4 w-4 mr-2" />
                  Telefone
                </Button>
                <Button variant="outline" className="bg-background/50">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereço
                </Button>
                <Button variant="outline" className="bg-background/50">
                  <Car className="h-4 w-4 mr-2" />
                  Placa
                </Button>
              </div>
            </div>

            {analyses.length === 0 ? (
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma análise criada ainda</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Faça análises rápidas de telefones, endereços e placas de veículos
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-background/50">
                      <Phone className="h-4 w-4 mr-2" />
                      Analisar Telefone
                    </Button>
                    <Button variant="outline" className="bg-background/50">
                      <MapPin className="h-4 w-4 mr-2" />
                      Analisar Endereço
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="bg-background/80 backdrop-blur-sm border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{getMapTypeLabel(analysis.type)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Resultado
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Minha Assinatura</h2>
              <p className="text-muted-foreground">
                Gerencie sua assinatura e créditos
              </p>
            </div>

            <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Status da Assinatura</CardTitle>
                <CardDescription>
                  Informações sobre seu plano atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Plano Atual:</span>
                    <Badge variant="default" className="bg-accent-gold text-black">
                      Gratuito
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Créditos Disponíveis:</span>
                    <span className="font-semibold">{profile?.credits || 0}</span>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                      Upgrade para Pro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Painel Administrativo</h2>
                <p className="text-muted-foreground">
                  Gerencie usuários, planos e configurações do sistema
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Usuários</CardTitle>
                    <CardDescription>Gerenciar usuários do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Gerenciar Usuários
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle>Configurações</CardTitle>
                    <CardDescription>Tabelas de conversão e regras</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar Sistema
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;