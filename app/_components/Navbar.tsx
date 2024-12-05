import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="fixed z-[49] h-16 w-full shadow-md">
      <nav className="max-w-screen-xl px-6 h-full mx-auto flex w-full items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-extrabold text-lg">Easy Env</h2>
        </Link>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant={"link"}>Dashboard</Button>
            </Link>
            <SignOutButton>
              <Button variant={"link"}>Logout</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href={"sign-in"}>
              <Button variant={"link"}>Login</Button>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
