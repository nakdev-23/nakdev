import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home,
  BookOpen,
  Users,
  Wrench,
  FileText,
  BarChart3,
  Bell,
  CreditCard,
  GraduationCap
} from 'lucide-react';

const navigationItems = [
  { name: 'แดชบอร์ด', href: '/admin', icon: Home },
  { name: 'จัดการคอร์ส', href: '/admin/courses', icon: BookOpen },
  { name: 'จัดการบทเรียน', href: '/admin/lessons', icon: GraduationCap },
  { name: 'จัดการ E-books', href: '/admin/ebooks', icon: FileText },
  { name: 'จัดการเครื่องมือ', href: '/admin/tools', icon: Wrench },
  { name: 'จัดการผู้ใช้', href: '/admin/users', icon: Users },
  { name: 'ข้อมูลการชำระเงิน', href: '/admin/payment-methods', icon: CreditCard },
  { name: 'คำสั่งซื้อ', href: '/admin/orders', icon: Bell },
  { name: 'รายงาน', href: '/admin/reports', icon: BarChart3 },
];

export default function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={collapsed ? 'w-16' : 'w-64'}
      collapsible="icon"
    >
      <SidebarContent className="glass-card border-r">
        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className={collapsed ? 'hidden' : 'text-base font-semibold text-gradient px-4'}>
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.href)}
                      className={`
                        group relative flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${active 
                          ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-4 border-primary' 
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                        }
                      `}
                      tooltip={collapsed ? item.name : undefined}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : ''}`} />
                      {!collapsed && (
                        <span className={`text-sm font-medium ${active ? 'text-primary' : ''}`}>
                          {item.name}
                        </span>
                      )}
                      {active && !collapsed && (
                        <div className="absolute right-4 h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                      )}
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
