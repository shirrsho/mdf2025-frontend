import { AdminLayoutContextProvider } from '@/contexts';
import { RouteGuard } from '@/providers';
import Participantlayout from './Participantlayout';
export default function ParticipantRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutContextProvider>
      <RouteGuard>
        <Participantlayout>{children}</Participantlayout>
      </RouteGuard>
    </AdminLayoutContextProvider>
  );
}
