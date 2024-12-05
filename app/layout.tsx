import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/Navbar";
import { GlobalProvider } from "@/context/GlobalContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easy Env",
  description:
    "An application that allows you to securely store environment variables of your projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Toaster />
          <GlobalProvider>
            <Navbar />
            <div className="pt-16">{children}</div>
          </GlobalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
