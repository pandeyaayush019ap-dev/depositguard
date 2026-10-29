import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DepositGuard | Rental Deposit Documentation & Settlement Platform',
  description:
    'Your deposit deserves proof, not promises. Shared condition records, tamper-evident move-in/out inspections, and transparent settlement tracking for tenants and landlords.',
  keywords: [
    'rental deposit',
    'security deposit protection',
    'move in inspection',
    'move out inspection',
    'tenant landlord agreement',
    'rental condition report',
    'deposit settlement',
  ],
  authors: [{ name: 'DepositGuard' }],
  openGraph: {
    title: 'DepositGuard | Your deposit deserves proof, not promises',
    description:
      'Document property conditions together, record agreed terms, and track deposit settlements with a shared digital record.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#07111F] text-[#F7FAFC] antialiased flex flex-col font-sans selection:bg-[#16C784]/30 selection:text-[#9BF5CC]`}
      >
        {children}
      </body>
    </html>
  );
}
