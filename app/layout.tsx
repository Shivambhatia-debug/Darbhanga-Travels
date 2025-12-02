import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Darbhanga Travels - Dil Toh Mushafir Hai",
  description:
    "Book train tickets, bus tickets, flight tickets, and cab services with Darbhanga Travels. Your trusted travel partner for over 15 years.",
  keywords: "travel agency, train booking, bus booking, flight booking, cab services, Darbhanga, Bihar, travel",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
