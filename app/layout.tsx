import { type Metadata } from "next";
import { Playwrite_AU_SA } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { MapleMonoNormal } from "@/app/fonts";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";

const playwrite = Playwrite_AU_SA({
  variable: "--font-playwrite",
});

const baseUrl = process.env.NEXTAUTH_URL || "";

// Create the OG image URL with your desired parameters
const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("Mycelium AI")}&description=${encodeURIComponent("Advanced AI for knowledge enhancement")}&website=${encodeURIComponent("EraGear.ai")}&theme=light`;

export const metadata: Metadata = {
  title: "Mycelium AI",
  description: "AI powered by Mycelium AI",
  openGraph: {
    title: "Mycelium AI",
    description: "AI powered by Mycelium AI",
    url: baseUrl,
    siteName: "Mycelium AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Mycelium AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mycelium AI",
    description: "AI powered by Mycelium AI",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>

      <body className={`${MapleMonoNormal.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
