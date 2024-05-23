import React from "react";
import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const fontFamily = Roboto_Slab({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

process.env.TZ = "America/Sao_Paulo";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.AUTENTICACAO_ATIVA = 'true'
process.env.URL_BASE = 'http://localhost:3000'


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
