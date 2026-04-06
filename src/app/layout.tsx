import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SafeCheck AI - Loan & Scam Detector",
  description: "AI-powered scam detection for SMS, messages, and links. Stay safe from loan scams, OTP fraud, and phishing attempts.",
  keywords: ["scam detector", "loan scam", "fraud detection", "SMS safety", "phishing prevention"],
  authors: [{ name: "SafeCheck AI" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}