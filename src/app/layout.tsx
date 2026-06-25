import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shortify v2',
  description: 'Encurtador de links minimalista e veloz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-50 text-zinc-900 antialiased min-h-screen flex flex-col justify-between`}>
        {children}
      </body>
    </html>
  );
}