import type React from "react";
import { Fragment } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Fragment>
      <div className="min-h-screen w-full relative flex flex-col items-center">
        {/* Header */}
        <header className="border-b py-3 flex justify-between items-center border-border w-full bg-background/80 backdrop-blur-sm px-4 lg:px-8">
          <Link
            href="/"
            className="flex gap-2 items-center transition-opacity hover:opacity-80"
          >
            {/* <Logo /> */}
            <h1 className="font-semibold text-lg">ChatGPT Admin.</h1>
          </Link>
          <nav className="z-50 flex items-center gap-4">
            <ThemeToggle />
          </nav>
        </header>

        {/* Main content */}
        <main className="flex flex-row w-full max-w-7xl px-4 lg:px-8 pt-20 pb-12 items-center justify-center">
          <div className="mt-3 flex flex-col gap-4 w-full max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </Fragment>
  );
}
