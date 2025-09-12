import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  Map, 
  Users, 
  BarChart3, 
  Phone, 
  MapPin, 
  Car, 
  Settings, 
  HelpCircle,
  Edit3,
  ChevronDown,
  Sparkles,
  Download,
  Crown,
  FileText,
  Table,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';

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
        icon: Edit3,
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
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { profile } = useAuth();
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const isCollapsed = state === 'collapsed';

  // Auto-close sidebar on mobile after navigation
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
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
      className="border-r border-sidebar-border bg-sidebar-background shadow-sm"
      variant={isMobile ? "floating" : "sidebar"}
      collapsible="icon"
    >
      <SidebarContent className="px-0">
        <SidebarHeader className="border-b border-sidebar-border/50 pb-3 mb-2">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-sidebar-foreground">NumApp</span>
                <span className="text-xs text-sidebar-muted-foreground">Numerologia</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-3 sm:px-4 text-xs sm:text-sm font-semibold text-sidebar-foreground uppercase tracking-wider">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-1 sm:px-2">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="group relative rounded-xl mx-1 my-0.5 min-h-[44px] transition-all duration-200 text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-muted hover:text-sidebar-foreground hover:shadow-sm"
                        >
                          {item.icon && (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <item.icon className="text-sidebar-foreground transition-colors group-hover:text-primary" />
                            </div>
                          )}
                          {!isCollapsed && (
                            <>
                              <span className="font-medium text-sm sm:text-base">{item.title}</span>
                              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-sidebar-foreground" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent>
                          <div className="ml-6 mt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                              <div key={subItem.title}>
                                <NavLink
                                  to={subItem.url}
                                  className={({ isActive }) =>
                                    `group relative rounded-lg min-h-[40px] px-3 py-2 flex items-center gap-2 transition-all duration-200 ${
                                      isActive
                                        ? 'bg-gradient-to-r from-primary/15 to-primary/10 text-primary font-semibold border-l-3 border-primary shadow-sm'
                                        : 'text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/70 hover:to-sidebar-muted/70 hover:text-sidebar-foreground'
                                    }`
                                  }
                                >
                                  {subItem.icon && (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                      <subItem.icon className={`transition-colors ${
                                        location.pathname === subItem.url ? 'text-primary' : 'text-sidebar-muted-foreground group-hover:text-primary'
                                      }`} />
                                    </div>
                                  )}
                                  <span className="text-xs sm:text-sm font-medium">{subItem.title}</span>
                                </NavLink>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `group relative rounded-xl mx-1 my-0.5 min-h-[44px] px-3 py-2 flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary to-primary-glow text-white font-semibold shadow-lg shadow-primary/25 scale-[1.02]'
                              : 'text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-muted hover:text-sidebar-foreground hover:shadow-sm hover:scale-[1.01]'
                          }`
                        }
                      >
                        {item.icon && (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <item.icon className={`transition-colors ${
                              location.pathname === item.url ? 'text-white' : 'text-sidebar-foreground group-hover:text-primary'
                            }`} />
                          </div>
                        )}
                        {!isCollapsed && (
                          <span className="font-medium text-sm sm:text-base">{item.title}</span>
                        )}
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
            <SidebarGroupContent className="px-1 sm:px-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleInstallPWA} 
                    tooltip="Instalar Aplicativo"
                    className="group relative rounded-xl mx-1 my-0.5 min-h-[44px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-500/30 transition-all duration-200"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Download className="text-green-600 group-hover:text-green-700 transition-colors" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm sm:text-base text-green-700 group-hover:text-green-800">Instalar App</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* User info at bottom */}
        {profile && !isCollapsed && (
          <SidebarFooter className="mt-auto p-3 sm:p-4 border-t border-sidebar-border bg-gradient-to-r from-sidebar-muted/50 to-sidebar-background">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {profile.name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-sidebar-foreground truncate">
                  {profile.name || 'Usuário'}
                </p>
                <p className="text-xs text-sidebar-muted-foreground truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          </SidebarFooter>
        )}
      </SidebarContent>
    </Sidebar>
  );
}