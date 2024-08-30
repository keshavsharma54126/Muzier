"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="fixed w-full bg-black/30 backdrop-blur-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Muzer
        </Link>
        <div className="flex items-center space-x-6">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Avatar>
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(session.user.name || "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
