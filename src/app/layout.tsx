import React from "react";
import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Head from "next/head";

const fontFamily = Roboto_Slab({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SisRef - RU Cedro",
  description: "Sistema de Refeitório do RU Cedro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          async
        ></script>
      </Head>
      <body className={`bg-cinza-400 min-w-80 ${fontFamily.className}`}>
        {children}
      </body>
    </html>
  );
}
