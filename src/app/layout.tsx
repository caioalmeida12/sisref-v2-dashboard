import React from "react";
import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

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
      <body className={`bg-cinza-400 min-w-80 ${fontFamily.className}`}>
        {children}
      </body>
    </html>
  );
}
