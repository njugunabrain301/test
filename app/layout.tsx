import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "@/Context/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hello World - Next.js App",
  description: "A simple Next.js hello world application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GlobalContextProvider
        profile={null}
        titleFont={null}
        bodyFont={null}
        subtitleFont={null}
        checkoutInfo={null}
      >
        <body className={inter.className}>{children}</body>
      </GlobalContextProvider>
    </html>
  );
}
