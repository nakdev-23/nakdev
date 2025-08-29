import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}