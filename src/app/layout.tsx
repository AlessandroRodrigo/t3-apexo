import "~/styles/globals.css";

import { Space_Grotesk } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "Apexo",
  description: "How big would you dream, if you knew you could not fail?",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
