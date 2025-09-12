import { Search, Moon, Sun, Download, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const { theme, toggleTheme, demoFlag } = useAppStore();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleInstallPWA = () => {
    // PWA install logic will be implemented later
    console.log('Install PWA');
  };

  const handleSearch = () => {
    // Global search logic will be implemented later
    console.log('Global search (Cmd/Ctrl+K)');
  };

  const handleProfileClick = () => {
    navigate('/ajustes/perfil');
  };

  const handleSettingsClick = () => {
    navigate('/ajustes');
  };

  return (
    <header className="h-12 sm:h-14 lg:h-16 border-b border-border/40 backdrop-blur-sm bg-background/80 flex items-center justify-between px-2 sm:px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-4">
        <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
        
        {demoFlag && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
            DEMO
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-40 lg:w-56 bg-background/50 text-sm h-8 sm:h-9"
            onClick={handleSearch}
            readOnly
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          title="Alternar tema"
        >
          {theme === 'light' ? (
            <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleInstallPWA}
          className="w-8 h-8 sm:w-9 sm:h-9 p-0"
          title="Instalar App"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className="text-xs sm:text-sm bg-primary/10">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : profile?.email?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className="text-xs sm:text-sm">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : profile?.email?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-xs sm:text-sm font-medium leading-none">
                  {profile?.name || 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Ajustes</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}