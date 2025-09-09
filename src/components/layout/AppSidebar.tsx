import {
  BarChart3,
  FileText,
  Users,
  PlusCircle,
  Trash2,
  Settings,
  HelpCircle,
  Map,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

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
    icon: Map,
    items: [
      {
        title: 'Lista',
        url: '/mapas',
        icon: FileText,
      },
      {
        title: 'Criar',
        url: '/mapas/criar',
        icon: PlusCircle,
      },
      {
        title: 'Lixeira',
        url: '/mapas/lixeira',
        icon: Trash2,
      },
    ],
  },
  {
    title: 'Clientes',
    icon: Users,
    items: [
      {
        title: 'Lista',
        url: '/clientes',
        icon: Users,
      },
      {
        title: 'Criar',
        url: '/clientes/criar',
        icon: PlusCircle,
      },
    ],
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
  },
  {
    title: 'Ajustes',
    icon: Settings,
    items: [
      {
        title: 'Perfil',
        url: '/ajustes/perfil',
        icon: Settings,
      },
      {
        title: 'Equipe & Papéis',
        url: '/ajustes/equipe',
        icon: Users,
      },
      {
        title: 'Integrações',
        url: '/ajustes/integracoes',
        icon: Settings,
      },
      {
        title: 'Preferências',
        url: '/ajustes/preferencias',
        icon: Settings,
      },
    ],
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

  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (items: any[]) => {
    return items?.some(item => isActive(item.url));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isParentActive(item.items)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={isParentActive(item.items) ? 'bg-accent' : ''}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={subItem.url}
                                    className={({ isActive }) =>
                                      isActive
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'hover:bg-accent/50'
                                    }
                                  >
                                    {subItem.icon && <subItem.icon />}
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'hover:bg-accent/50'
                        }
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}