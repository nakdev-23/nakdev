import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("เข้าสู่ระบบสำเร็จ!");
      navigate(nextUrl);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="gradient-blob"></div>
        <div className="gradient-blob"></div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับหน้าหลัก
            </Link>
          </Button>

          <Card className="glass-card">
            <CardHeader className="text-center pb-8">
              {/* Logo */}
              <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">Dev</span>
                </div>
                <span className="text-xl font-bold text-gradient">นัก dev ฝึกหัด</span>
              </Link>
              
              <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับกลับ</h1>
              <p className="text-muted-foreground">
                เข้าสู่ระบบเพื่อเข้าถึงคอร์สและเครื่องมือของคุณ
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="รหัสผ่านของคุณ"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-on-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    หรือ
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" disabled>
                  เข้าสู่ระบบด้วย Google
                  <span className="ml-2 text-xs text-muted-foreground">(เร็วๆ นี้)</span>
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  เข้าสู่ระบบด้วย Facebook
                  <span className="ml-2 text-xs text-muted-foreground">(เร็วๆ นี้)</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">ยังไม่มีบัญชี? </span>
                <Link 
                  to="/auth/signup" 
                  className="text-primary hover:underline font-medium"
                >
                  สมัครสมาชิกฟรี
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm mb-4">
              เข้าสู่ระบบเพื่อเข้าถึง:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full">
                คอร์สฟรี
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full">
                เครื่องมือฟรี
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full">
                eBook ฟรี
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full">
                ชุมชนนักพัฒนา
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}