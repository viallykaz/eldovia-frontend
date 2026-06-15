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
    default: 'Eldovia Automobile — Premier Auto Auction Marketplace',
    template: '%s | Eldovia Automobile',
  },
  description:
    'Buy and sell vehicles through live auctions, timed bidding, and direct listings. Real-time bidding, VIN verification, and cross-border logistics.',
  keywords: ['auto auction', 'vehicle marketplace', 'car auction', 'live bidding', 'Eldovia'],
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
