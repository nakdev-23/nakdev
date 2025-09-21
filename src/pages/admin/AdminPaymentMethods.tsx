import { useState } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  QrCode, 
  Building2, 
  Smartphone,
  Eye
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  useUploadQRCode,
  type PaymentMethodInsert,
  type PaymentMethod
} from '@/hooks/usePaymentMethods';

const formSchema = z.object({
  method_type: z.string().min(1, 'กรุณาเลือกประเภทการชำระเงิน'),
  display_name: z.string().min(1, 'กรุณาใส่ชื่อที่แสดง'),
  account_number: z.string().optional(),
  account_name: z.string().optional(),
  bank_name: z.string().optional(),
  qr_code_url: z.string().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().default(0),
});

type FormData = z.infer<typeof formSchema>;

const methodTypeOptions = [
  { value: 'bank_transfer', label: 'โอนเงินผ่านธนาคาร', icon: Building2 },
  { value: 'promptpay', label: 'พร้อมเพย์', icon: Smartphone },
  { value: 'qr_code', label: 'QR Code', icon: QrCode },
];

export default function AdminPaymentMethods() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const { data: paymentMethods = [], isLoading } = usePaymentMethods();
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();
  const uploadQRMutation = useUploadQRCode();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method_type: '',
      display_name: '',
      account_number: '',
      account_name: '',
      bank_name: '',
      qr_code_url: '',
      is_active: true,
      sort_order: 0,
    },
  });

  const selectedMethodType = form.watch('method_type');

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      form.reset({
        method_type: method.method_type,
        display_name: method.display_name,
        account_number: method.account_number || '',
        account_name: method.account_name || '',
        bank_name: method.bank_name || '',
        qr_code_url: method.qr_code_url || '',
        is_active: method.is_active,
        sort_order: method.sort_order,
      });
      if (method.qr_code_url) {
        setPreviewImage(method.qr_code_url);
      }
    } else {
      setEditingMethod(null);
      form.reset();
      setPreviewImage('');
      setQrFile(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMethod(null);
    setPreviewImage('');
    setQrFile(null);
    form.reset();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let qrCodeData = {};
      
      if (qrFile) {
        const uploadResult = await uploadQRMutation.mutateAsync(qrFile);
        qrCodeData = {
          qr_code_url: uploadResult.url,
          qr_code_file_path: uploadResult.file_path,
        };
      } else if (editingMethod) {
        qrCodeData = {
          qr_code_url: editingMethod.qr_code_url,
          qr_code_file_path: editingMethod.qr_code_file_path,
        };
      }

      const paymentMethodData = {
        method_type: data.method_type,
        display_name: data.display_name,
        account_number: data.account_number,
        account_name: data.account_name,
        bank_name: data.bank_name,
        is_active: data.is_active,
        sort_order: data.sort_order,
        ...qrCodeData,
      };

      if (editingMethod) {
        await updateMutation.mutateAsync({
          id: editingMethod.id,
          ...paymentMethodData,
        });
      } else {
        await createMutation.mutateAsync(paymentMethodData);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleDelete = async () => {
    if (deletingMethodId) {
      await deleteMutation.mutateAsync(deletingMethodId);
      setIsDeleteDialogOpen(false);
      setDeletingMethodId(null);
    }
  };

  const getMethodTypeIcon = (type: string) => {
    const option = methodTypeOptions.find(opt => opt.value === type);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">จัดการข้อมูลการชำระเงิน</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มข้อมูลการชำระเงิน
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการข้อมูลการชำระเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">กำลังโหลด...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>ชื่อที่แสดง</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>ลำดับ</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodTypeIcon(method.method_type)}
                          {methodTypeOptions.find(opt => opt.value === method.method_type)?.label}
                        </div>
                      </TableCell>
                      <TableCell>{method.display_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {method.account_number && (
                            <div>เลขที่: {method.account_number}</div>
                          )}
                          {method.account_name && (
                            <div>ชื่อบัญชี: {method.account_name}</div>
                          )}
                          {method.bank_name && (
                            <div>ธนาคาร: {method.bank_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={method.is_active ? "default" : "secondary"}>
                          {method.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell>{method.sort_order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(method)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingMethodId(method.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paymentMethods.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        ไม่มีข้อมูลการชำระเงิน
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'แก้ไขข้อมูลการชำระเงิน' : 'เพิ่มข้อมูลการชำระเงิน'}
              </DialogTitle>
              <DialogDescription>
                กรอกข้อมูลการชำระเงินที่ต้องการเพิ่มหรือแก้ไข
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="method_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ประเภทการชำระเงิน</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกประเภท" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {methodTypeOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อที่แสดง</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="เช่น ธนาคารกสิกรไทย" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(selectedMethodType === 'bank_transfer' || selectedMethodType === 'promptpay') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="account_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {selectedMethodType === 'promptpay' ? 'หมายเลขพร้อมเพย์' : 'เลขที่บัญชี'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123-4-56789-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="account_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อบัญชี</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="นาย/นาง ชื่อ นามสกุล" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedMethodType === 'bank_transfer' && (
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อธนาคาร</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ธนาคารกสิกรไทย" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(selectedMethodType === 'qr_code' || selectedMethodType === 'promptpay') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">QR Code</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                      />
                    </div>
                    
                    {previewImage && (
                      <div className="flex justify-center">
                        <img 
                          src={previewImage} 
                          alt="QR Code Preview" 
                          className="max-w-48 max-h-48 object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ลำดับการแสดง</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>เปิดใช้งาน</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    ยกเลิก
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending || uploadQRMutation.isPending}
                  >
                    {editingMethod ? 'อัปเดต' : 'เพิ่ม'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันการลบ</DialogTitle>
              <DialogDescription>
                คุณแน่ใจหรือว่าต้องการลบข้อมูลการชำระเงินนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                ลบ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}