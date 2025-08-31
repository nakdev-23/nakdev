import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Building2, QrCode, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, loading, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'promptpay' | 'stripe'>('promptpay');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cartItems, loading, navigate]);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    setProcessingPayment(true);
    
    try {
      if (paymentMethod === 'stripe') {
        // Handle Stripe payment
        toast.info('กำลังเชื่อมต่อไปยัง Stripe...');
        // TODO: Implement Stripe checkout
      } else if (paymentMethod === 'promptpay') {
        // Show PromptPay QR code
        toast.success('กรุณาสแกน QR Code เพื่อชำระเงิน');
      } else if (paymentMethod === 'bank') {
        // Show bank transfer details
        toast.success('กรุณาโอนเงินตามรายละเอียดที่แสดง');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการชำระเงิน');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/cart')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปตะกร้า
          </Button>
          <div>
            <h1 className="text-3xl font-bold">ชำระเงิน</h1>
            <p className="text-muted-foreground">เลือกวิธีการชำระเงินที่สะดวกสำหรับคุณ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.item_type === 'course' ? 'คอร์ส' : 
                         item.item_type === 'ebook' ? 'อีบุ๊ก' : 'เครื่องมือ'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">฿{item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">จำนวน {item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>รวมทั้งหมด</span>
                  <span className="text-primary">฿{totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>เลือกวิธีการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                  <div className="space-y-4">
                    {/* PromptPay */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="promptpay" id="promptpay" />
                      <Label htmlFor="promptpay" className="flex items-center gap-3 cursor-pointer flex-1">
                        <QrCode className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">PromptPay QR Code</div>
                          <div className="text-sm text-muted-foreground">สแกน QR Code เพื่อชำระเงินผ่าน PromptPay</div>
                        </div>
                      </Label>
                    </div>

                    {/* Bank Transfer */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building2 className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">โอนผ่านธนาคาร</div>
                          <div className="text-sm text-muted-foreground">โอนเงินผ่านหมายเลขบัญชีธนาคาร</div>
                        </div>
                      </Label>
                    </div>

                    {/* Stripe */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-medium">บัตรเครดิต/เดบิต</div>
                          <div className="text-sm text-muted-foreground">ชำระด้วยบัตรเครดิตหรือเดบิตผ่าน Stripe</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Payment Details */}
                {paymentMethod === 'promptpay' && (
                  <Card className="mt-6 bg-muted/30">
                    <CardContent className="p-6 text-center">
                      <QrCode className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">สแกน QR Code นี้เพื่อชำระเงิน</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        จำนวนเงิน: ฿{totalAmount.toLocaleString()}
                      </p>
                      <Badge variant="outline">PromptPay: 0XX-XXX-XXXX</Badge>
                    </CardContent>
                  </Card>
                )}

                {paymentMethod === 'bank' && (
                  <Card className="mt-6 bg-muted/30">
                    <CardContent className="p-6">
                      <h3 className="font-medium mb-4">รายละเอียดการโอนเงิน</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>ธนาคาร:</span>
                          <span className="font-medium">ธนาคารกรุงเทพ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>เลขที่บัญชี:</span>
                          <span className="font-medium">XXX-X-XXXXX-X</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ชื่อบัญชี:</span>
                          <span className="font-medium">บริษัท เทค เอ็ดดูเคชั่น จำกัด</span>
                        </div>
                        <div className="flex justify-between">
                          <span>จำนวนเงิน:</span>
                          <span className="font-medium text-primary">฿{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="h-4 w-4 inline mr-2" />
                          กรุณาเก็บหลักฐานการโอนเงินไว้เป็นหลักฐาน
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {paymentMethod === 'stripe' && (
                  <Card className="mt-6 bg-muted/30">
                    <CardContent className="p-6 text-center">
                      <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">ชำระด้วยบัตรเครดิต/เดบิต</h3>
                      <p className="text-sm text-muted-foreground">
                        คุณจะถูกนำไปยังหน้าชำระเงินของ Stripe เพื่อกรอกข้อมูลบัตร
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Button */}
                <Button 
                  className="w-full mt-6 glow-on-hover" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={processingPayment}
                >
                  {processingPayment ? 'กำลังดำเนินการ...' : 
                   paymentMethod === 'stripe' ? 'ไปยังหน้าชำระเงิน' : 
                   paymentMethod === 'promptpay' ? 'ยืนยันการชำระเงิน' :
                   'ยืนยันการโอนเงิน'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}