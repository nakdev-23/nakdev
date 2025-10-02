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
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Settings, 
  LogOut, 
  User, 
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AdminHeader() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b glass-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section with trigger and logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-muted/50" />
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gradient">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">ระบบจัดการ</p>
            </div>
          </div>
        </div>

        {/* Right section with notifications and user menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-muted/50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] bg-red-500 border-0 shadow-glow">
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-all hover:ring-2 hover:ring-primary/20"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src="" alt={profile?.full_name || 'Admin'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src="" alt={profile?.full_name || 'Admin'} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 flex-1">
                    <p className="text-sm font-semibold leading-none">
                      {profile?.full_name || 'ผู้ดูแลระบบ'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {profile?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {profile?.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                โปรไฟล์ของฉัน
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/settings')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                ตั้งค่าระบบ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
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