import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/store/Provider";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pika Kasino Lobby",
  description: "Pika Kasino Lobby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
