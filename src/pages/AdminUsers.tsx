import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Shield, ShieldOff, User, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at: string | null;
  banned_until: string | null;
  last_sign_in_at: string | null;
  profile: {
    id: string;
    name: string | null;
    role: string;
    auth_user_id: string;
  } | null;
}

const AdminUsers = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'GET'
      });

      if (error) throw error;
      
      setUsers(data.users || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const handleUserAction = async (userId: string, action: 'ban' | 'unban') => {
    try {
      setActionLoading(userId);
      
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'PUT',
        body: { userId, action }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: data.message,
        variant: "default",
      });

      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error performing user action:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao executar ação",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const isUserBanned = (user: AdminUser) => {
    return user.banned_until && new Date(user.banned_until) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mystical flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-mystical">
      {/* Background Stars Animation */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="bg-background/50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Gerenciar Usuários
              </h1>
              <p className="text-muted-foreground">
                Administrar contas de usuário do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {users.filter(u => !isUserBanned(u)).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
              <ShieldOff className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {users.filter(u => isUserBanned(u)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((adminUser) => (
                      <TableRow key={adminUser.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {adminUser.profile?.name || 'Sem nome'}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {adminUser.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={adminUser.profile?.role === 'admin' ? 'default' : 'secondary'}
                            className={adminUser.profile?.role === 'admin' ? 'bg-accent-gold text-black' : ''}
                          >
                            {adminUser.profile?.role === 'admin' ? 'Admin' : 'Usuário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isUserBanned(adminUser) ? 'destructive' : 'default'}
                            className={!isUserBanned(adminUser) ? 'bg-green-500 text-white' : ''}
                          >
                            {isUserBanned(adminUser) ? 'Bloqueado' : 'Ativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(adminUser.last_sign_in_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(adminUser.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {adminUser.profile?.role !== 'admin' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant={isUserBanned(adminUser) ? "default" : "destructive"}
                                  size="sm"
                                  disabled={actionLoading === adminUser.id}
                                >
                                  {actionLoading === adminUser.id ? (
                                    "Carregando..."
                                  ) : isUserBanned(adminUser) ? (
                                    <>
                                      <Shield className="h-3 w-3 mr-1" />
                                      Ativar
                                    </>
                                  ) : (
                                    <>
                                      <ShieldOff className="h-3 w-3 mr-1" />
                                      Bloquear
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {isUserBanned(adminUser) ? 'Ativar Usuário' : 'Bloquear Usuário'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja {isUserBanned(adminUser) ? 'ativar' : 'bloquear'} o usuário {adminUser.email}?
                                    {!isUserBanned(adminUser) && ' Esta ação impedirá o usuário de acessar o sistema.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleUserAction(
                                      adminUser.id, 
                                      isUserBanned(adminUser) ? 'unban' : 'ban'
                                    )}
                                    className={isUserBanned(adminUser) ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                                  >
                                    {isUserBanned(adminUser) ? 'Ativar' : 'Bloquear'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;