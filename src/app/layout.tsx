import type {Metadata} from 'next';
import { Inter, Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { DataProvider } from '@/providers/data-provider';
import { TranslationProvider } from '@/providers/translation-provider';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto' });


export const metadata: Metadata = {
  title: 'GSN_GESTOR',
  description: 'Sistema de gestão de vendas e estoque para mercearia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${roboto.variable}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AuthProvider>
                <DataProvider>
                    <TranslationProvider>
                        {children}
                    </TranslationProvider>
                </DataProvider>
            </AuthProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
