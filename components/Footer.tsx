import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black/10 dark:bg-black/30 py-4 relative z-10 backdrop-blur-md">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Muzify
        </Link>
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white hover:text-yellow-400 transition-colors duration-200">
            <Link
              href="https://github.com/keshavsharma54126/Muzier"
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white hover:text-yellow-400 transition-colors duration-200">
            <Link
              href="https://x.com/BasedDesiMan"
              target="_blank"
              rel="noopener noreferrer">
              <FaTwitter className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 font-bold">
            <Link href="">Contact Us</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
