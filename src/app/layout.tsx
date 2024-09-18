import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca Basqüadé",
  description: "Biblioteca ambientalista",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" id="app" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="use-credentials" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-green-50 dark:bg-slate-900 w-full flex flex-col min-h-screen font-roboto ${inter.className}`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Navbar />
          <main className="flex-1 overflow-y-auto w-full bg-slate-50 dark:bg-slate-900 container pt-24 pb-24">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
