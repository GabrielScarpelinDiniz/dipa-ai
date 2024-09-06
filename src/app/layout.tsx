import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unipar Management",
  description: "Serviços de gestão para a Unipar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-dark-900 bg-white`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
