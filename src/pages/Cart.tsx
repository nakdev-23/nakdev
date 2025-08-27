import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const initialCartItems = [
  {
    id: "javascript-advanced",
    type: "course",
    title: "JavaScript ขั้นสูง",
    description: "เจาะลึก JavaScript ES6+ และเทคนิคขั้นสูงสำหรับนักพัฒนา",
    price: 1990,
    originalPrice: 2490,
    quantity: 1,
    image: "/placeholder.svg"
  },
  {
    id: "ui-components",
    type: "tool",
    title: "Modern UI Components",
    description: "ชุด UI Components สำเร็จรูปที่ออกแบบสวยงามและใช้งานง่าย",
    price: 990,
    quantity: 1,
    image: "/placeholder.svg"
  },
  {
    id: "react-patterns",
    type: "ebook",
    title: "React Design Patterns",
    description: "รูปแบบการออกแบบและเทคนิคขั้นสูงสำหรับ React Developers",
    price: 490,
    quantity: 1,
    image: "/placeholder.svg"
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === "newbie10") {
      setAppliedCoupon(couponCode);
      setDiscount(10); // 10% discount
      setCouponCode("");
    } else if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon(couponCode);
      setDiscount(20); // 20% discount
      setCouponCode("");
    } else {
      alert("รหัสส่วนลดไม่ถูกต้อง");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setDiscount(0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course": return "คอร์ส";
      case "tool": return "เครื่องมือ";
      case "ebook": return "eBook";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course": return "badge-paid";
      case "tool": return "badge-level";
      case "ebook": return "badge-free";
      default: return "badge-level";
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-4">ตะกร้าสินค้าว่าง</h1>
              <p className="text-muted-foreground mb-8">
                คุณยังไม่มีสินค้าในตะกร้า เริ่มเลือกคอร์ส เครื่องมือ หรือ eBook ที่คุณสนใจ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/courses">
                    ดูคอร์สเรียน
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/tools">
                    ดูเครื่องมือ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">ตะกร้าสินค้า</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0"></div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge 
                                variant="outline" 
                                className={`${getTypeColor(item.type)} text-xs mb-2`}
                              >
                                {getTypeLabel(item.type)}
                              </Badge>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              {item.type !== "ebook" && (
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ฿{item.originalPrice.toLocaleString()}
                                </div>
                              )}
                              <div className="font-semibold">
                                ฿{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="glass-card sticky top-24">
                  <CardHeader>
                    <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Coupon */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">รหัสส่วนลด</label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-success">
                              {appliedCoupon}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeCoupon}
                            className="text-success hover:text-success h-auto p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="ใส่รหัสส่วนลด"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            onClick={applyCoupon}
                            disabled={!couponCode}
                          >
                            ใช้
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ลอง: <code className="bg-muted px-1 rounded">NEWBIE10</code> หรือ <code className="bg-muted px-1 rounded">SAVE20</code>
                      </p>
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>ยอดรวม ({cartItems.length} รายการ)</span>
                        <span>฿{subtotal.toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-success">
                          <span>ส่วนลด ({discount}%)</span>
                          <span>-฿{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-semibold">
                        <span>ยอดรวมสุทธิ</span>
                        <span>฿{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button className="w-full glow-on-hover" size="lg" asChild>
                      <Link to="/checkout">
                        ดำเนินการชำระเงิน
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/courses">
                        เลือกซื้อเพิ่ม
                      </Link>
                    </Button>

                    {/* Trust Badges */}
                    <div className="pt-4 space-y-2 text-center text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <span>🔒</span>
                        <span>การชำระเงินปลอดภัย</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span>↩️</span>
                        <span>รับประกันคืนเงิน 30 วัน</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span>♾️</span>
                        <span>เข้าถึงได้ตลอดชีวิต</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}