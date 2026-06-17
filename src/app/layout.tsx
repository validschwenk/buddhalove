import type { Metadata } from "next";
import { Cinzel, Noto_Serif_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const notoSerifKR = Noto_Serif_KR({
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "BuddhaLove — A Digital Buddhist Sanctuary",
  description: "Talk to Buddha and receive ancient wisdom for your modern worries. Explore community wisdom, light a lantern, and find peace in a digital sanctuary inspired by Buddhist teachings.",
  keywords: ["buddhism", "meditation", "wisdom", "mindfulness", "buddha", "peace", "spiritual", "zen"],
  openGraph: {
    title: "BuddhaLove — A Digital Buddhist Sanctuary",
    description: "Talk to Buddha and receive ancient wisdom for your modern worries.",
    url: "https://buddhashareslove.vercel.app",
    siteName: "BuddhaLove",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${notoSerifKR.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8630891672218717"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
