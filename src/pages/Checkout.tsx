import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Building2, QrCode, ArrowLeft, CheckCircle, Smartphone, Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useCreateOrder } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, loading, clearCart } = useCart();
  const { user } = useAuth();
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = usePaymentMethods();
  const createOrderMutation = useCreateOrder();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cartItems, loading, navigate]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      // Auto-select first active payment method
      const firstActive = paymentMethods.find(method => method.is_active);
      if (firstActive) {
        setSelectedPaymentMethod(firstActive.id);
      }
    }
  }, [paymentMethods, selectedPaymentMethod]);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  const uploadPaymentSlip = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      setUploadingSlip(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('payment-slips')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        toast.error('เกิดข้อผิดพลาดในการอัปโหลดสลิป');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payment-slips')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading payment slip:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      return null;
    } finally {
      setUploadingSlip(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WEBP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      setPaymentSlip(file);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod || !user) {
      toast.error('กรุณาเลือกวิธีการชำระเงินและเข้าสู่ระบบ');
      return;
    }

    // Check if payment slip is required for bank transfer or promptpay
    const requiresSlip = selectedMethod.method_type === 'bank_transfer' || selectedMethod.method_type === 'promptpay';
    if (requiresSlip && !paymentSlip) {
      toast.error('กรุณาแนบสลิปการโอนเงิน');
      return;
    }

    setProcessingPayment(true);
    
    try {
      let paymentProofUrl = null;
      
      // Upload payment slip if provided
      if (paymentSlip) {
        paymentProofUrl = await uploadPaymentSlip(paymentSlip);
        if (!paymentProofUrl && requiresSlip) {
          return; // Error already shown in uploadPaymentSlip
        }
      }

      // Create order
      const orderItems = cartItems.map(item => ({
        item_id: item.item_id,
        item_type: item.item_type,
        quantity: item.quantity,
        price: item.price
      }));

      await createOrderMutation.mutateAsync({
        user_id: user.id,
        payment_method_id: selectedMethod.id,
        total_amount: totalAmount,
        payment_proof_url: paymentProofUrl,
        items: orderItems
      });
      
      // Clear cart after successful order creation
      clearCart();
      
      // Show appropriate success message
      if (requiresSlip) {
        toast.success('คำสั่งซื้อถูกสร้างแล้ว รอการตรวจสอบการชำระเงิน');
      } else {
        toast.success('สั่งซื้อสำเร็จแล้ว');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading || paymentMethodsLoading) {
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
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>ไม่มีวิธีการชำระเงินที่ใช้งานได้</p>
                    <p className="text-sm mt-2">กรุณาติดต่อผู้ดูแลระบบ</p>
                  </div>
                ) : (
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <div className="space-y-4">
                      {paymentMethods
                        .filter(method => method.is_active)
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((method) => {
                          const getMethodIcon = () => {
                            switch (method.method_type) {
                              case 'promptpay':
                                return <Smartphone className="h-6 w-6 text-primary" />;
                              case 'bank_transfer':
                                return <Building2 className="h-6 w-6 text-primary" />;
                              case 'qr_code':
                                return <QrCode className="h-6 w-6 text-primary" />;
                              default:
                                return <CreditCard className="h-6 w-6 text-primary" />;
                            }
                          };

                          const getMethodDescription = () => {
                            switch (method.method_type) {
                              case 'promptpay':
                                return 'สแกน QR Code เพื่อชำระเงินผ่าน PromptPay';
                              case 'bank_transfer':
                                return 'โอนเงินผ่านหมายเลขบัญชีธนาคาร';
                              case 'qr_code':
                                return 'สแกน QR Code เพื่อชำระเงิน';
                              default:
                                return 'ชำระด้วยบัตรเครดิตหรือเดบิต';
                            }
                          };

                          return (
                            <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <RadioGroupItem value={method.id} id={method.id} />
                              <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                                {getMethodIcon()}
                                <div>
                                  <div className="font-medium">{method.display_name}</div>
                                  <div className="text-sm text-muted-foreground">{getMethodDescription()}</div>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                    </div>
                  </RadioGroup>
                )}

                {/* Payment Details */}
                {selectedMethod && (
                  <>
                    {(selectedMethod.method_type === 'promptpay' || selectedMethod.method_type === 'qr_code') && (
                      <Card className="mt-6 bg-muted/30">
                        <CardContent className="p-6 text-center">
                          {selectedMethod.qr_code_url ? (
                            <img 
                              src={selectedMethod.qr_code_url} 
                              alt="QR Code for payment" 
                              className="h-48 w-48 mx-auto mb-4 object-contain border rounded"
                            />
                          ) : (
                            <QrCode className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                          )}
                          <h3 className="font-medium mb-2">สแกน QR Code นี้เพื่อชำระเงิน</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            จำนวนเงิน: ฿{totalAmount.toLocaleString()}
                          </p>
                          {selectedMethod.account_number && (
                            <Badge variant="outline">
                              {selectedMethod.method_type === 'promptpay' ? 'PromptPay' : 'QR Code'}: {selectedMethod.account_number}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {selectedMethod.method_type === 'bank_transfer' && (
                      <Card className="mt-6 bg-muted/30">
                        <CardContent className="p-6">
                          <h3 className="font-medium mb-4">รายละเอียดการโอนเงิน</h3>
                          <div className="space-y-3 text-sm">
                            {selectedMethod.bank_name && (
                              <div className="flex justify-between">
                                <span>ธนาคาร:</span>
                                <span className="font-medium">{selectedMethod.bank_name}</span>
                              </div>
                            )}
                            {selectedMethod.account_number && (
                              <div className="flex justify-between">
                                <span>เลขที่บัญชี:</span>
                                <span className="font-medium">{selectedMethod.account_number}</span>
                              </div>
                            )}
                            {selectedMethod.account_name && (
                              <div className="flex justify-between">
                                <span>ชื่อบัญชี:</span>
                                <span className="font-medium">{selectedMethod.account_name}</span>
                              </div>
                            )}
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

                    {/* Payment Slip Upload */}
                    {(selectedMethod.method_type === 'bank_transfer' || selectedMethod.method_type === 'promptpay') && (
                      <Card className="mt-6">
                        <CardContent className="p-6">
                          <h3 className="font-medium mb-4 flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            แนบสลิปการโอนเงิน
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <Input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                                id="payment-slip"
                              />
                              <Label htmlFor="payment-slip" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                  <FileImage className="h-8 w-8 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">คลิกเพื่อเลือกไฟล์สลิป</p>
                                    <p className="text-xs text-muted-foreground">รองรับไฟล์ JPG, PNG, WEBP (ขนาดไม่เกิน 5MB)</p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                            
                            {paymentSlip && (
                              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    ไฟล์ที่เลือก: {paymentSlip.name}
                                  </p>
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    ขนาด: {(paymentSlip.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setPaymentSlip(null)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  ลบ
                                </Button>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>• กรุณาแนบสลิปการโอนเงินที่ชัดเจน</p>
                              <p>• ตรวจสอบให้แน่ใจว่าจำนวนเงินตรงกับคำสั่งซื้อ</p>
                              <p>• สลิปจะถูกตรวจสอบและยืนยันภายใน 24 ชั่วโมง</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Payment Button */}
                <Button 
                  className="w-full mt-6 glow-on-hover" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={processingPayment || uploadingSlip || !selectedMethod || 
                    ((selectedMethod?.method_type === 'bank_transfer' || selectedMethod?.method_type === 'promptpay') && !paymentSlip)}
                >
                  {processingPayment ? 'กำลังดำเนินการ...' : 
                   uploadingSlip ? 'กำลังอัปโหลดสลิป...' :
                   !selectedMethod ? 'เลือกวิธีการชำระเงิน' :
                   ((selectedMethod.method_type === 'bank_transfer' || selectedMethod.method_type === 'promptpay') && !paymentSlip) ? 'กรุณาแนบสลิป' :
                   selectedMethod.method_type === 'stripe' ? 'ไปยังหน้าชำระเงิน' : 
                   selectedMethod.method_type === 'bank_transfer' ? 'ยืนยันการโอนเงิน' :
                   selectedMethod.method_type === 'promptpay' ? 'ยืนยันการชำระเงิน' :
                   'ยืนยันการชำระเงิน'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}