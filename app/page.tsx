"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-purple-400 via-pink-500 to-red-500 animate-gradient-rotate"></div>
        <div className="absolute inset-0 bg-gradient-conic from-blue-500 via-teal-500 to-green-500 mix-blend-overlay animate-gradient-spin"></div>
        <div className="absolute inset-0 backdrop-blur-[150px]"></div>
      </div>

      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center w-full max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Streaming With Music,
              <br className="hidden sm:inline" />
              Reimagined.
            </h1>
            <p className="text-lg sm:text-xl font-bold text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Muzify brings a new dimension to music streaming, allowing
              listeners to shape the playlist in real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                asChild
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full transition duration-300 transform hover:scale-105 font-bold w-full sm:w-auto">
                <Link href="/appview">Create a Room</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-black/20 hover:bg-black/30 text-white border-2 border-white/50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full transition duration-300 transform hover:scale-105 font-bold w-full sm:w-auto">
                <Link href="/appview">Join a Room</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-24 bg-white/10 dark:bg-black/10 backdrop-blur-md">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Create",
                  description:
                    "Streamers set up music rooms for their audience",
                },
                {
                  title: "Vote",
                  description:
                    "Listeners vote on their favorite tracks in real-time",
                },
                {
                  title: "Play",
                  description:
                    "Top-voted songs get played, keeping everyone engaged",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center bg-white/10 dark:bg-black/10 p-6 rounded-lg backdrop-blur-md">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/80 font-bold">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></motion.div>
          <motion.div
            style={{ y: y1 }}
            className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></motion.div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to get started?
            </h2>
            <p className="text-xl font-bold text-white/80 mb-12 max-w-2xl mx-auto">
              Join Muzer today and experience the future of interactive music
              streaming.
            </p>
            <Button
              asChild
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 text-lg px-8 py-6 rounded-full transition duration-300 transform hover:scale-105 font-bold">
              <Link href="/signin">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
