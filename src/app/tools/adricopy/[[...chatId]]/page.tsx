import { type Metadata } from "next";
import { Suspense } from "react";
import { Chat } from "~/app/_components/chat/chat";
import { ChatHistory } from "~/app/_components/chat/history";

export const metadata: Metadata = {
  title: "Apexo | OliWrite - Elevate your script writing game",
  description:
    "Oliwrite is a versatile tool offered by Apexo Digital, designed to enhance your digital writing experience.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  abstract: "width=device-width, initial-scale=1",
  appleWebApp: true,
  applicationName: "Apexo",
  category: "Business",
  classification: "Business",
  keywords: [
    "Apexo Digital",
    "Oliwrite",
    "writing tool",
    "digital writing",
    "content creation",
    "writing enhancement",
  ],
  openGraph: {
    title: "Apexo | OliWrite - Elevate your script writing game",
    description:
      "Oliwrite is a versatile tool offered by Apexo Digital, designed to enhance your digital writing experience.",
    images: [{ url: "/apexo-image.svg" }],
    siteName: "Apexo",
    url: "https://www.apexo.digital/tools/oliwrite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apexo | OliWrite - Elevate your script writing game",
    description: "Oliwrite is a versatile tool offered by Apexo Digital.",
    images: [{ url: "/apexo-image.svg" }],
    site: "@apexodigital",
  },
};

export default function Page({ params }: { params: { chatId: string[] } }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/50 lg:flex-row">
      <Suspense>
        <ChatHistory />
      </Suspense>
      <Chat chatId={params.chatId?.[0]} />
    </div>
  );
}
