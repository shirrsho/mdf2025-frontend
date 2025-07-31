import { AdminLayoutContextProvider } from '@/contexts';
import { AdminLayout } from './Adminlayout';
import { RouteGuard } from '@/providers';
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutContextProvider>
      <RouteGuard>
        <AdminLayout>{children}</AdminLayout>
      </RouteGuard>
    </AdminLayoutContextProvider>
  );
}
