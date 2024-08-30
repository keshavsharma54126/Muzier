"use client";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const session = useSession();
  const router = useRouter();
  return (
    <nav className="fixed w-full bg-black/30  backdrop-blur-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Muzer
        </Link>
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-yellow-400 transition-colors duration-200"></Button>
          {session.data?.user ? (
            <Button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 font-bold">
              Logout
            </Button>
          ) : (
            <Button
              variant="secondary"
              asChild
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 font-bold">
              <Link href="/api/auth/signin">Signin/Signup</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
