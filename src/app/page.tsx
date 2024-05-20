import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowDown, Instagram } from "lucide-react";
import Image from "next/image";
import { Navigation } from "~/app/_components/landing/nav";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default async function Home() {
  return (
    <main className="bg-stone-950">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-40"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image src="/apexo-logo.svg" alt="" width={100} height={100} />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Navigation />
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <SignedOut>
              <SignInButton>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-stone-200"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
      </header>

      <section className="relative isolate flex flex-col px-6 pt-14 lg:px-40">
        <div className="flex gap-4">
          <div className="mr-auto flex max-w-2xl grow py-32 sm:py-48 lg:py-56">
            <div className="text-left">
              <h1 className="text-5xl font-bold tracking-tight text-stone-200 sm:text-7xl">
                How big would you dream, if you knew you{" "}
                <span className="text-primary">couldn&apos;t fail?</span>
              </h1>
            </div>
          </div>
          <Image
            className="shrink"
            src="/apexo-brain.svg"
            alt=""
            width={500}
            height={500}
          />
        </div>
      </section>

      <section className="isolate flex flex-row items-center justify-center gap-16 px-6 py-20 lg:px-40">
        <h2 className="bg-gradient-to-l from-stone-600 from-10% to-stone-200 to-90% bg-clip-text text-5xl font-bold text-transparent">
          What <br /> We Do
        </h2>

        <Separator orientation="vertical" className="h-24 w-1" />
        <p className="max-w-md text-lg font-thin text-stone-400">
          Imagine a world where your business is limitless. Where technology and
          creativity come together to unlock new possibilities. Welcome to
          Apexo, your partner in AI-driven innovation.
        </p>
      </section>

      <section className="isolate flex flex-row items-center justify-center gap-16 px-6 py-20 lg:px-40">
        <h2 className="text-4xl font-bold text-stone-200">Trusted by:</h2>
      </section>

      <div className="bg-gradient-to-b from-stone-950 to-stone-900">
        <footer className="relative isolate flex h-72 flex-col justify-between gap-8 px-6 py-6 md:h-96 md:px-40 md:py-14">
          <Image src="/apexo-logo.svg" alt="" width={100} height={100} />

          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-stone-500 p-2">
                <Image
                  src="/instagram-logo.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
              <div className="rounded-full border border-stone-500 p-2">
                <Image src="/whatsapp-logo.svg" alt="" width={20} height={20} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span>
                A product of <strong>Apexo</strong>
              </span>

              <span>2024 | All rights reserved</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
