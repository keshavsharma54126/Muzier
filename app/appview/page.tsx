"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FaMusic, FaUsers, FaDoorOpen, FaFire } from "react-icons/fa";
import {
  MdLibraryMusic,
  MdGroupAdd,
  MdLogin,
  MdMeetingRoom,
} from "react-icons/md";
import { CreateRoomModal } from "@/components/CreateRoomModal";

interface Room {
  id: string;
  name: string;
  roomtype: string;
  userCount?: number;
}

const Appview = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Dummy data for My Rooms
  const myRooms: Room[] = [
    { id: "1", name: "My Rock Room", roomtype: "public" },
    { id: "2", name: "Jazz Nights", roomtype: "private" },
    { id: "3", name: "Classical Sundays", roomtype: "public" },
    { id: "4", name: "Pop Playlist", roomtype: "public" },
    { id: "5", name: "Indie Jams", roomtype: "private" },
  ];

  // Dummy data for Trending Rooms
  const trendingRooms: Room[] = [
    { id: "6", name: "Pop Hits 2024", roomtype: "public", userCount: 156 },
    { id: "7", name: "Indie Discoveries", roomtype: "public", userCount: 89 },
    { id: "8", name: "EDM Party", roomtype: "public", userCount: 203 },
    { id: "9", name: "Chill Lounge", roomtype: "public", userCount: 75 },
    { id: "10", name: "Rock Classics", roomtype: "public", userCount: 132 },
  ];

  const handleRoomClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
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
    <div className="flex flex-col min-h-screen overflow-hidden max-w-screen bg-gray-900">
      <div className="flex-grow container mx-auto px-4 py-8 text-gray-200">
        <h1 className="mt-16 text-4xl font-bold mb-6 text-gray-100">
          Hi {session.user?.name || "Unknown User"}, Welcome to Muzify
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaMusic className="mr-2" /> Your Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore your favorite tracks and playlists.</p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center">
                <MdLibraryMusic className="mr-2" /> Go to Library
              </button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaUsers className="mr-2" />
                Create a Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a room and share it with your viewers or friends</p>
              <CreateRoomModal />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaDoorOpen className="mr-2" />
                Join An Active Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Join the music room of your favorite creator or friends</p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center">
                <MdLogin className="mr-2" /> Join Room
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-8">
          <Card className="flex-1 bg-gray-800 border-gray-700 text-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center text-gray-100">
                <MdMeetingRoom className="mr-2 text-indigo-400" /> My Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4">
                {myRooms.map((room, index) => (
                  <div key={room.id}>
                    <div
                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room.id)}>
                      <span className="text-sm font-medium leading-none">
                        {room.name}
                      </span>
                      <span className="text-sm text-indigo-400">
                        {room.roomtype}
                      </span>
                    </div>
                    {index < myRooms.length - 1 && (
                      <Separator className="my-2 bg-gray-700" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gray-800 border-gray-700 text-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center text-gray-100">
                <FaFire className="mr-2 text-amber-400" /> Trending Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4">
                {trendingRooms.map((room, index) => (
                  <div key={room.id}>
                    <div
                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room.id)}>
                      <span className="text-sm font-medium leading-none">
                        {room.name}
                      </span>
                      <span className="text-sm text-amber-400 flex items-center">
                        <FaUsers className="mr-1" />
                        {room.userCount}
                      </span>
                    </div>
                    {index < trendingRooms.length - 1 && (
                      <Separator className="my-2 bg-gray-700" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">
            What&apos;s New
          </h2>
          <p className="mb-4 text-gray-200">
            Check out our latest features and updates!
          </p>
          <button className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold py-2 px-4 rounded">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appview;
