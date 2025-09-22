import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  LogOut, 
  User, 
  Menu,
  Home,
  BookOpen,
  Users,
  Wrench,
  FileText,
  BarChart3,
  Bell,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const navigation = [
  { name: 'แดชบอร์ด', href: '/admin', icon: Home },
  { name: 'จัดการคอร์ส', href: '/admin/courses', icon: BookOpen },
  { name: 'จัดการผู้ใช้', href: '/admin/users', icon: Users },
  { name: 'จัดการเครื่องมือ', href: '/admin/tools', icon: Wrench },
  { name: 'จัดการ E-books', href: '/admin/ebooks', icon: FileText },
  { name: 'ข้อมูลการชำระเงิน', href: '/admin/payment-methods', icon: CreditCard },
  { name: 'คำสั่งซื้อ', href: '/admin/orders', icon: Bell },
  { name: 'รายงาน', href: '/admin/reports', icon: BarChart3 },
];

export default function AdminHeader() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-2 pt-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant={isActivePath(item.href) ? "secondary" : "ghost"}
                      className="justify-start gap-2"
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo and title */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-semibold">ระบบจัดการ</h1>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={isActivePath(item.href) ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => navigate(item.href)}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={profile?.full_name || 'Admin'} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || 'ผู้ดูแลระบบ'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {profile?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                โปรไฟล์ของฉัน
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                ตั้งค่าระบบ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}