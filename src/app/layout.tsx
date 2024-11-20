import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PITSTOP",
  description: "A FORMULA 1 TOOL ASSISTING IN VISUALIZING HISTORICAL DATA RANGING ALL THE WAY FROM THE BEGINNING OF THE SPORT’S HISTORY - 1950.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Script src="https://unpkg.com/lenis@1.1.16/dist/lenis.min.js" strategy="beforeInteractive"></Script> 
      </body>
    </html>
  );
}
