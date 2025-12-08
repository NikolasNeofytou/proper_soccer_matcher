import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: "Proper Soccer Matcher - Find Soccer Pitches & Players",
  description: "The ultimate soccer booking platform connecting players with pitches and building vibrant soccer communities worldwide.",
  keywords: ["soccer", "football", "pitch booking", "field rental", "find players", "soccer matches"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-gray-950 text-gray-100">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
