import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User,
  ChevronDown,
  LogOut,
  Settings,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const navigation = [
  { name: "คอร์สเรียน", href: "/courses" },
  { name: "เครื่องมือ", href: "/tools" },
  { name: "eBooks", href: "/ebooks" },
  { name: "เกี่ยวกับเรา", href: "/about" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b backdrop-blur-2xl bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Enhanced */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all group"
          >
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-base">Dev</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                นัก dev ฝึกหัด
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all relative group",
                  location.pathname.startsWith(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
                {location.pathname.startsWith(item.href) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Enhanced */}
          <div className="flex items-center space-x-2">
            {/* Cart - Enhanced */}
            <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 rounded-lg" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-secondary text-white border-0 animate-pulse-glow"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Auth Buttons - Enhanced */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted/50 rounded-lg px-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="max-w-[150px] truncate">{profile?.full_name || user.email}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card backdrop-blur-xl">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/dashboard">
                        <Settings className="h-4 w-4 mr-2" />
                        แดชบอร์ด
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/admin">
                          <Crown className="h-4 w-4 mr-2" />
                          ผู้ดูแลระบบ
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      ออกจากระบบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="hover:bg-muted/50 rounded-lg" asChild>
                    <Link to="/auth/signin">เข้าสู่ระบบ</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="glow-on-hover bg-gradient-to-r from-primary via-secondary to-accent rounded-lg px-6" 
                    asChild
                  >
                    <Link to="/auth/signup">สมัครสมาชิก</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  location.pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border/50">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="h-4 w-4 mr-2" />
                      แดชบอร์ด
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Crown className="h-4 w-4 mr-2" />
                        ผู้ดูแลระบบ
                      </Link>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link to="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      เข้าสู่ระบบ
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      สมัครสมาชิก
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};