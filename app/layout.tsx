import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

const siteUrl = "https://magnify.vercel.app"
const siteName = "Magnify"
const siteTitle = "Magnify | Let Houston See Heaven"
const siteDescription = "Join the movement to let Houston see heaven. Text 'JOIN' to 832-895-2125 to get involved."
const ogImageUrl = `${siteUrl}/api/og`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Magnify",
  },
  description: siteDescription,
  keywords: ["Magnify", "Houston", "Heaven", "Community", "Movement", "Faith", "Texas"],
  authors: [{ name: "Magnify" }],
  creator: "Magnify",
  publisher: "Magnify",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Magnify - Let Houston See Heaven",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
    creator: "@magnify",
    site: "@magnify",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
