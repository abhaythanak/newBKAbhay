import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from "@/ui/providers/QueryProvider";
import { AuthProvider } from "@/ui/providers/AuthProvider";
import { Navbar } from "@/ui/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevTinder",
  description: "Find your next dev connection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <ToastContainer theme="dark" position="bottom-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
