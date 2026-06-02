import type { Metadata } from "next";
import { Cinzel, Noto_Serif_KR } from "next/font/google";
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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
