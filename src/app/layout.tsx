import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import SessionProvider from "@/components/SessionProvider"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "goodwatch",
  description: "An app for tracking watched movies",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <Script src='/register-sw.js' />
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
