import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (!agreeToTerms) {
      alert("กรุณายอมรับข้อกำหนดการใช้งาน");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
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
              
              <h1 className="text-3xl font-bold mb-2">เริ่มต้นเส้นทางใหม่</h1>
              <p className="text-muted-foreground">
                สมัครสมาชิกฟรีเพื่อเข้าถึงคอร์สและเครื่องมือที่จะเปลี่ยนอนาคตคุณ
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="ชื่อของคุณ"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
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
                      placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      minLength={8}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="ยืนยันรหัสผ่าน"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    ฉันได้อ่านและยอมรับ{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      ข้อกำหนดการใช้งาน
                    </Link>{" "}
                    และ{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </Link>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-on-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิกฟรี"}
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
                  สมัครด้วย Google
                  <span className="ml-2 text-xs text-muted-foreground">(เร็วๆ นี้)</span>
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  สมัครด้วย Facebook
                  <span className="ml-2 text-xs text-muted-foreground">(เร็วๆ นี้)</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">มีบัญชีอยู่แล้ว? </span>
                <Link 
                  to="/auth/signin" 
                  className="text-primary hover:underline font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm mb-4">
              สมาชิกใหม่จะได้รับ:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 text-white px-3 py-2 rounded-lg">
                ✨ คอร์สฟรี 5+ คอร์ส
              </div>
              <div className="bg-white/10 text-white px-3 py-2 rounded-lg">  
                🛠️ เครื่องมือฟรี
              </div>
              <div className="bg-white/10 text-white px-3 py-2 rounded-lg">
                📚 eBook ฟรี
              </div>
              <div className="bg-white/10 text-white px-3 py-2 rounded-lg">
                👥 เข้าร่วมชุมชน
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}