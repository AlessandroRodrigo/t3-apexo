import "~/styles/globals.css";

import { Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import { type Metadata } from "next";
import { ThemeProvider } from "~/app/_components/theme-provider";

export const metadata: Metadata = {
  title: "Apexo",
  description: "How big would you dream, if you knew you could not fail?",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  abstract: "width=device-width, initial-scale=1",
  appleWebApp: true,
  applicationName: "Apexo",
  category: "Business",
  classification: "Business",
  keywords: ["apexo", "business", "management", "app"],
  openGraph: {
    title: "Apexo",
    description: "How big would you dream, if you knew you could not fail?",
    images: [{ url: "/apexo-image.svg" }],
    siteName: "Apexo",
    url: "https://apexo.digital",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.className} ${spaceGrotesk.variable}`}
    >
      <body>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
