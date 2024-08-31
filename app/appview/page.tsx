"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaMusic, FaUsers, FaDoorOpen } from "react-icons/fa";
import { MdLibraryMusic, MdGroupAdd, MdLogin } from "react-icons/md";

const Appview = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hiddebn max-w-screen">
      <div className="flex-grow container mx-auto px-4 py-8 text-white ">
        <h1 className="mt-16 text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Hi {session.user?.name || "Unknown User"}, Welcome to Muzier
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-purple-800/30 border-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaMusic className="mr-2" /> Your Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore your favorite tracks and playlists.</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <MdLibraryMusic className="mr-2" /> Go to Library
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 border-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaUsers className="mr-2" />
                Create a Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a room and share it with your viewers or friends</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <MdGroupAdd className="mr-2" /> Create Room
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 border-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaDoorOpen className="mr-2" />
                Join An Active Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Join the music room of your favorite creator or friends</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <MdLogin className="mr-2" /> Join Room
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-purple-700 to-pink-600 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">What&apos;s New</h2>
          <p className="mb-4">Check out our latest features and updates!</p>
          <Button
            variant="secondary"
            className="bg-white text-purple-700 hover:bg-purple-100">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Appview;
