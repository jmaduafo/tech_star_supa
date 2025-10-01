import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Wrapper from "@/components/auth/Wrapper";
import Providers from "@/components/auth/Providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  fallback: [],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${urbanist.className} antialiased bg-background text-darkText`}
      >
        <Providers>
          <Wrapper>{children}</Wrapper>
        </Providers>
      </body>
    </html>
  );
}
