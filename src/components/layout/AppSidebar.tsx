import {
  BarChart3,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Map,
  Phone,
  MapPin,
  Car,
  Edit,
  TrendingUp,
  Table,
  Calculator,
  Briefcase,
  Download,
  Sparkles,
  Crown,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navigation = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Mapas',
    url: '/mapas',
    icon: Map,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: FileText,
  },
  {
    title: 'Planilha de Equivalência',
    url: '/planilha-equivalencia',
    icon: Table,
  },
  {
    title: 'Tabela de Conversão',
    url: '/tabela-conversao',
    icon: Calculator,
  },
  {
    title: 'Tabela de Profissões',
    url: '/tabela-profissoes',
    icon: Briefcase,
  },
  {
    title: 'Análises',
    url: '/analises',
    icon: TrendingUp,
    subItems: [
      {
        title: 'Telefones',
        url: '/analises/telefone',
        icon: Phone,
      },
      {
        title: 'Endereços',
        url: '/analises/endereco',
        icon: MapPin,
      },
      {
        title: 'Placas',
        url: '/analises/placa',
        icon: Car,
      },
      {
        title: 'Correção de Assinatura',
        url: '/analises/assinatura',
        icon: Edit,
      },
    ],
  },
  {
    title: 'Ajustes',
    url: '/ajustes',
    icon: Settings,
  },
  {
    title: 'Ajuda',
    url: '/ajuda',
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAppStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  const isCollapsed = state === 'collapsed';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r-2 border-sidebar-border bg-gradient-to-b from-sidebar-background to-sidebar-muted shadow-lg"
    >
      <SidebarContent className="relative">
        {/* Header/Logo Section */}
        <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/10 to-primary/5">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">NumApp</h2>
                <p className="text-xs text-sidebar-muted-foreground">Numerologia Cabalística</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-4 text-sm font-semibold text-sidebar-muted-foreground uppercase tracking-wider">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="group relative rounded-xl mx-1 my-0.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-muted hover:shadow-sm"
                        >
                          {item.icon && (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <item.icon className="transition-colors group-hover:text-primary" />
                            </div>
                          )}
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="ml-auto transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 group-hover:text-primary" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={subItem.url}
                                  className={({ isActive }) =>
                                    `group relative rounded-lg transition-all duration-200 ${
                                      isActive
                                        ? 'bg-gradient-to-r from-primary/15 to-primary/10 text-primary font-semibold border-l-3 border-primary shadow-sm'
                                        : 'hover:bg-gradient-to-r hover:from-sidebar-accent/70 hover:to-sidebar-muted/70 hover:text-sidebar-foreground'
                                    }`
                                  }
                                >
                                  {subItem.icon && (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                      <subItem.icon className="transition-colors" />
                                    </div>
                                  )}
                                  <span className="text-sm">{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `group relative rounded-xl mx-1 my-0.5 transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary to-primary-glow text-white font-semibold shadow-lg shadow-primary/25 scale-[1.02]'
                              : 'hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-muted hover:shadow-sm hover:scale-[1.01]'
                          }`
                        }
                      >
                        {item.icon && (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <item.icon className={`transition-colors ${
                              location.pathname === item.url ? 'text-white' : 'group-hover:text-primary'
                            }`} />
                          </div>
                        )}
                        <span className="font-medium">{item.title}</span>
                        {location.pathname === item.url && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {canInstall && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleInstallPWA} 
                    tooltip="Instalar Aplicativo"
                    className="group relative rounded-xl mx-1 my-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-500/30 transition-all duration-200"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Download className="text-green-600 group-hover:text-green-700 transition-colors" />
                    </div>
                    <span className="font-medium text-green-700 group-hover:text-green-800">Instalar App</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* User info at bottom */}
        {user && !isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border bg-gradient-to-r from-sidebar-muted/50 to-sidebar-background">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-sm font-semibold text-primary">
                  {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name || 'Usuário'}
                </p>
                <p className="text-xs text-sidebar-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}