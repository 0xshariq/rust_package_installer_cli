import type { Metadata } from 'next'
import AuthProvider from "@/lib/auth-provider";
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {templateTitle},
  description: {templateDescription},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
        </AuthProvider>
      </body>
    </html>
  )
}
