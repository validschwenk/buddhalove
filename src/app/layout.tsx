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
  title: "BuddhaLove",
  description: "Find peace and let go of your burdens.",
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
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
