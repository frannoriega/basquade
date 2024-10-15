import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes";
import NextAuthProvider from "@/components/next-auth-provider";
import * as Toast from "@radix-ui/react-toast"
import { Toaster } from "@/components/ui/toaster";


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
      <body className={`bg-gray-50 dark:bg-gray-950 w-full h-full flex flex-col min-h-screen font-roboto ${inter.className}`}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <Navbar />
            <main className="flex-1 flex overflow-y-auto h-full w-full">
              {children}
            </main>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
