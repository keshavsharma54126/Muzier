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
    router.push("/");
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
          Muzify
        </Link>
        <div className="flex items-center space-x-6 ">
          {session?.user ? (
            <div className="">
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
                <DropdownMenuContent align="end" className="mt-1">
                  <DropdownMenuItem asChild>
                    <div className="bg-green-100 text-green-500 hover:text-green-800">
                      <Link href="/appview">Dashboard</Link>
                    </div>
                  </DropdownMenuItem>
                  <div className="bg-red-100 hover:bg-red-200">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 text-red-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                          />
                        </svg>
                        <div className="text-red-500 hover:text-red-800">
                          Logout
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="secondary"
              asChild
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 font-bold">
              <Link href="/signin">Signin/Signup</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
