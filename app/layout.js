import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata = {
  title: 'FundedTechStreet — Get Funded. Trade Bigger. Build Your Edge.',
  description:
    'FundedTechStreet is a modern funded trading platform. Pass a one-step evaluation, trade a funded account up to $200K, and keep up to 80% of your profits.',
  keywords: ['funded trading', 'prop firm', 'trading challenge', 'FundedTechStreet', 'funded account'],
  authors: [{ name: 'FundedTechStreet' }],
  openGraph: {
    title: 'FundedTechStreet — Funded Trading Platform',
    description: 'Trade bigger. Build your edge. Get funded with FundedTechStreet.',
    type: 'website',
    siteName: 'FundedTechStreet',
  },
  icons: { icon: '/favicon.svg' },
}

export const viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
