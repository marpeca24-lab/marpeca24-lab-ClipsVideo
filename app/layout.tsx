import type {Metadata} from 'next';
import './globals.css';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ClipsVideo - Gana USDT viendo videos',
  description: 'Plataforma de micro-tareas de contenido viral de YouTube con recompensas en USDT.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className="dark">
      <body suppressHydrationWarning className="bg-black text-white selection:bg-red-600 selection:text-white">
        <FirebaseProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </FirebaseProvider>
      </body>
    </html>
  );
}
