import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar";


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
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossOrigin="use-credentials" href="https://fonts.gstatic.com" rel="preconnect" />
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"/>
      </head>
      <body className={`bg-orange-300 w-full font-roboto ${inter.className}`}>
        <Navbar />
          <main className="flex-1 overflow-y-auto bg-indigo-100">{children}</main>
      </body>
    </html>
  );
}
