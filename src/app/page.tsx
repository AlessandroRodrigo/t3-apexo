import Image from "next/image";

const navigation = [
  { name: "Home", href: "#" },
  { name: "About us", href: "#" },
  { name: "Services", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Tools", href: "#" },
];

export default async function Home() {
  return (
    <div className="min-h-screen bg-stone-950">
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
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-primary text-sm font-semibold leading-6 text-stone-200"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-stone-200"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-40">
        <div className="mr-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-left">
            <h1 className="text-5xl font-bold tracking-tight text-stone-200 sm:text-7xl">
              How big would you dream, if you knew you{" "}
              <span className="text-primary">couldn&apos;t fail?</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
