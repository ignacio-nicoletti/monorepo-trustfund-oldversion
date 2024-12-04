import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import ErrorBoundary from "../components/errorPage/global-error";
import { Toaster } from "@repo/ui/components/ui/toaster.tsx";

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
  title: "Trust Fund CRM",
  description: "CRM para gestion interna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
          <Toaster />
          <ErrorBoundary>
            {children}
            </ErrorBoundary>
      </body>
    </html>
  );
}
