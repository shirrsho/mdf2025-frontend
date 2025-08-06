import { AdminLayoutContextProvider } from '@/contexts';
import { RouteGuard } from '@/providers';
import Companylayout from './Companylayout';
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutContextProvider>
      <RouteGuard>
        <Companylayout>{children}</Companylayout>
      </RouteGuard>
    </AdminLayoutContextProvider>
  );
}
