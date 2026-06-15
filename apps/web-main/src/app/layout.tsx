import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/components/session-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Eldovia Group — Enterprise Ecosystem',
    template: '%s | Eldovia Group',
  },
  description:
    'Eldovia Group is a diversified enterprise ecosystem operating across automobile auctions and agribusiness investment. Building tomorrow\'s industries today.',
  keywords: ['Eldovia Group', 'Eldovia Automobile', 'Eldovia Agribusiness', 'investment', 'auction'],
  openGraph: {
    siteName: 'Eldovia Group',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
