import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rory",
  description: "Beautiful restaurant menu browsing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-vazirmatn)] antialiased">
        {children}
      </body>
    </html>
  );
}
