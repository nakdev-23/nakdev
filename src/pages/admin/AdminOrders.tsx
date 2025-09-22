import { useState } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  CreditCard,
  Package,
  FileText
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  useOrders,
  useConfirmOrder,
  useCancelOrder,
  useUpdateOrderNotes,
  type OrderWithDetails
} from '@/hooks/useOrders';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const { data: orders = [], isLoading } = useOrders();
  const confirmMutation = useConfirmOrder();
  const cancelMutation = useCancelOrder();
  const updateNotesMutation = useUpdateOrderNotes();

  const handleViewOrder = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setNotes(order.notes || '');
    setIsViewDialogOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (selectedOrder) {
      await confirmMutation.mutateAsync(selectedOrder.id);
      setIsConfirmDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      await cancelMutation.mutateAsync(selectedOrder.id);
      setIsCancelDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleUpdateNotes = async () => {
    if (selectedOrder) {
      await updateNotesMutation.mutateAsync({
        orderId: selectedOrder.id,
        notes: notes
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />รอยืนยัน</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />ยืนยันแล้ว</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />ยกเลิก</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'course':
        return 'คอร์ส';
      case 'ebook':
        return 'อีบุ๊ก';
      case 'tool':
        return 'เครื่องมือ';
      default:
        return type;
    }
  };

  const getItemTitle = (item: any) => {
    if (item.courses) return item.courses.title;
    if (item.ebooks) return item.ebooks.title;
    if (item.tools) return item.tools.title;
    return 'ไม่ระบุ';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">จัดการคำสั่งซื้อ</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการคำสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">กำลังโหลด...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>วิธีชำระเงิน</TableHead>
                    <TableHead>จำนวนเงิน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่สั่งซื้อ</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{order.profiles?.full_name || 'ไม่ระบุ'}</div>
                            <div className="text-sm text-muted-foreground">{order.profiles?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {order.payment_methods?.display_name || 'ไม่ระบุ'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ฿{order.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsConfirmDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsCancelDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        ไม่มีคำสั่งซื้อ
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>รายละเอียดคำสั่งซื้อ</DialogTitle>
              <DialogDescription>
                คำสั่งซื้อ #{selectedOrder?.id.slice(0, 8)}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      ข้อมูลลูกค้า
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ชื่อ</Label>
                        <p className="font-medium">{selectedOrder.profiles?.full_name || 'ไม่ระบุ'}</p>
                      </div>
                      <div>
                        <Label>อีเมล</Label>
                        <p className="font-medium">{selectedOrder.profiles?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      ข้อมูลการชำระเงิน
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>วิธีการชำระเงิน</Label>
                        <p className="font-medium">{selectedOrder.payment_methods?.display_name || 'ไม่ระบุ'}</p>
                      </div>
                      <div>
                        <Label>จำนวนเงินรวม</Label>
                        <p className="font-medium text-primary">฿{selectedOrder.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>สถานะ</Label>
                        <div>{getStatusBadge(selectedOrder.status)}</div>
                      </div>
                      <div>
                        <Label>วันที่สั่งซื้อ</Label>
                        <p className="font-medium">
                          {format(new Date(selectedOrder.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      รายการสินค้า
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ประเภท</TableHead>
                          <TableHead>ชื่อสินค้า</TableHead>
                          <TableHead>จำนวน</TableHead>
                          <TableHead>ราคา</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.order_items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant="outline">{getItemTypeLabel(item.item_type)}</Badge>
                            </TableCell>
                            <TableCell>{getItemTitle(item)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>฿{item.price.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      หมายเหตุ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="เพิ่มหมายเหตุสำหรับคำสั่งซื้อนี้..."
                      rows={3}
                    />
                    <Button 
                      onClick={handleUpdateNotes} 
                      className="mt-2"
                      disabled={updateNotesMutation.isPending}
                    >
                      บันทึกหมายเหตุ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                ปิด
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Order Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันคำสั่งซื้อ</DialogTitle>
              <DialogDescription>
                คุณแน่ใจหรือว่าต้องการยืนยันคำสั่งซื้อนี้? ลูกค้าจะได้รับสิทธิ์ในการเข้าถึงสินค้าที่สั่งซื้อทันที
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button 
                onClick={handleConfirmOrder}
                disabled={confirmMutation.isPending}
              >
                ยืนยัน
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยกเลิกคำสั่งซื้อ</DialogTitle>
              <DialogDescription>
                คุณแน่ใจหรือว่าต้องการยกเลิกคำสั่งซื้อนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                ไม่ยกเลิก
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelOrder}
                disabled={cancelMutation.isPending}
              >
                ยกเลิก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}