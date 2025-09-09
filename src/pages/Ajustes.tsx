import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Ajustes() {
  const { profile, signOut } = useAuth();
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Ajustes
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure sua conta e preferências do sistema
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Conta
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              value={profile?.name || ''}
            />
          </div>
          
          <Button className="w-full">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja ser notificado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email de notificações</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações por email
              </p>
            </div>
            <Switch
              checked={notificacoes}
              onCheckedChange={setNotificacoes}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize a interface do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema escuro</Label>
              <p className="text-sm text-muted-foreground">
                Usar tema escuro para a interface
              </p>
            </div>
            <Switch
              checked={temaEscuro}
              onCheckedChange={setTemaEscuro}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>
            Gerencie a segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Alterar Senha
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={signOut}
          >
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}