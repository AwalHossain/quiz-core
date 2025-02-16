
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthProvider";
import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const banglaFont = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${banglaFont.className} antialiased`}>

          <AuthProvider>

            <Navbar />
            <Toaster richColors/>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
