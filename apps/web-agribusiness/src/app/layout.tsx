import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/components/session-provider'; // custom JWT auth context

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Eldovia Agribusiness — Agricultural Investment & Innovation',
    template: '%s | Eldovia Agribusiness',
  },
  description:
    'An investment-focused agribusiness platform showcasing agricultural projects and attracting global investors to transform food systems across Africa.',
  keywords: ['agribusiness', 'agricultural investment', 'Africa', 'impact investing', 'ESG', 'food systems'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
