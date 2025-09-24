import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { DataProvider } from '@/providers/data-provider';
import { TranslationProvider } from '@/providers/translation-provider';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <DataProvider>
                    <TranslationProvider>
                        {children}
                    </TranslationProvider>
                </DataProvider>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

    