import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ACC Sierra Leone - Transparency & Asset Recovery Platform",
    template: "%s | ACC Sierra Leone",
  },
  description:
    "Official Anti-Corruption Commission of Sierra Leone transparency platform. View recovered assets, auction properties, and track anti-corruption efforts.",
  keywords: [
    "Anti-Corruption Commission",
    "Sierra Leone",
    "ACC",
    "transparency",
    "asset recovery",
    "property auction",
    "corruption",
  ],
  authors: [{ name: "Anti-Corruption Commission Sierra Leone" }],
  openGraph: {
    type: "website",
    locale: "en_SL",
    siteName: "ACC Sierra Leone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
