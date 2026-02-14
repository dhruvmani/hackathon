import type { Metadata, Viewport } from "next"
import { Playfair_Display_SC, PT_Serif } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const playfairDisplaySC = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display-sc",
})

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
})

export const metadata: Metadata = {
  title: "CompareHub - Smart Product Comparison",
  description:
    "Enterprise-grade product comparison platform. Compare prices, ratings, and features across products.",
}

export const viewport: Viewport = {
  themeColor: "#063737",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplaySC.variable} ${ptSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
