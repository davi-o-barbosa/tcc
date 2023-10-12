import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';

const opensans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buscar - Periódicos',
  description: 'Busque por artigos de uma maneira acessível.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={`${opensans.className} flex justify-center`}>{children}</body>
    </html>
  )
}
