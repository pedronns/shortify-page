import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shortify v2',
  description: 'Encurtador de links minimalista e veloz',
  icons: {
    icon: '/images/logo.png'
  }
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
      <p className='text-center text-[11px] mb-2 text-zinc-400 mt-8'>
        Shortify v2 • © Pedro Nunes
      </p>
    </html>
  );
}