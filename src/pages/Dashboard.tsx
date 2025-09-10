import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Crown,
  Plus,
  AlertCircle,
  User,
  Building2,
  Heart,
  Baby,
  Phone,
  MapPin,
  Car,
  PenTool
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile, isAdmin } = useAuth();
  const { demoFlag } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {demoFlag && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está no modo demonstração. Todos os dados são fictícios e nenhuma alteração será salva no banco.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-muted-foreground">
              Bem-vindo, {profile?.name || profile?.email || 'Usuário'}
            </p>
            {isAdmin && (
              <Badge variant="default" className="bg-accent-gold text-black w-fit">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {!demoFlag && (
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border text-sm">
              <Crown className="h-4 w-4 text-accent-gold" />
              <span className="font-semibold">Plano Premium</span>
            </div>
          )}
          <Button 
            onClick={() => navigate('/mapas')}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Mapa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapas Criados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoFlag ? '12' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              Total de mapas numerológicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoFlag ? '8' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              Telefones, endereços e placas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoFlag ? '5' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-gold">
              {demoFlag ? 'Demo' : 'Ativo'}
            </div>
            <p className="text-xs text-muted-foreground">
              Modo atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acesso Rápido */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mapas Pessoais */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/mapas')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Mapas Pessoais</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Análise da personalidade, destino e números cabalísticos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mapas Empresariais */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/mapas-empresariais')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Mapas Empresariais</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Energia de marcas e nomes comerciais para negócios
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Harmonia Conjugal */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/harmonia-conjugal')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Harmonia Conjugal</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Compatibilidade entre casais e análise de relacionamento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mapas Infantis */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/mapas-infantis')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Mapas Infantis</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Escolha o melhor nome para bebês analisando potenciais
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Telefones */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/analise-telefone')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Análise de Telefones</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Verifique se seu número traz energias positivas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Endereços */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/analise-endereco')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Análise de Endereços</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Como seu endereço influencia sua vida e relacionamentos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Placas */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/analise-placa')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Análise de Placas</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Harmonia da placa do veículo com sua numerologia pessoal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Correção de Assinatura */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary/40"
            onClick={() => navigate('/correcao-assinatura')}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Correção de Assinatura</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  Otimize sua assinatura para atrair sucesso e prosperidade
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/mapas')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Mapas
            </CardTitle>
            <CardDescription>
              Visualize e gerencie seus mapas numerológicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Acessar Mapas
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/clientes')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
            </CardTitle>
            <CardDescription>
              Gerencie seu cadastro de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerenciar Clientes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas ações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demoFlag ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mapa de Maria Silva criado</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cliente João Santos adicionado</p>
                  <p className="text-xs text-muted-foreground">Há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <BarChart3 className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Análise de telefone concluída</p>
                  <p className="text-xs text-muted-foreground">Há 6 horas</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma atividade ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro mapa numerológico
              </p>
              <Button 
                onClick={() => navigate('/mapas')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Mapa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;