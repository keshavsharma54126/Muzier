"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnterRoomModal } from "@/components/EnterRoomModal";

interface Room {
  id: string;
  name: string;
  roomtype: string;
  userCount?: number;
}

const Appview = () => {
  const { data: session, status } = useSession();
  const [myrooms, setMYrooms] = useState<Room[]>([]);
  const router = useRouter();

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
  //@ts-ignore
  const userId = session?.user?.id;

  const getRooms = async () => {
    try {
      const res = await axios.get("/api/getRooms", {
        params: { userId },
      });

      setMYrooms(res.data.rooms);
    } catch (e) {
      console.error("error while fetching rooms for user ", e);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    getRooms();
  }, [status, router, userId]);

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
    <div className="flex flex-col min-h-screen overflow-hidden max-w-screen">
      <div className="flex-grow container mx-auto px-4 py-8 text-white ">
        <h1 className="mt-16 text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Hi {session.user?.name || "Unknown User"}, Welcome to Muzify
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
              <CreateRoomModal />
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
              <EnterRoomModal />
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-8">
          <Card className="flex-1 bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-800 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <MdMeetingRoom className="mr-2 text-purple-400" /> My Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border border-purple-800 p-4">
                {myrooms?.map((room, index) => (
                  <div key={room?.id}>
                    <div
                      className="flex items-center justify-between py-2 px-2 hover:bg-purple-800/30 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room.id)}>
                      <span className="text-sm font-medium leading-none">
                        {room.name}
                      </span>
                      <span className="text-sm text-purple-400">
                        {room.roomtype}
                      </span>
                    </div>
                    {index < myrooms.length - 1 && (
                      <Separator className="my-2 bg-purple-800" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gradient-to-br from-red-950 to-orange-950 border-red-800 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <FaFire className="mr-2 text-orange-400" /> Trending Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border border-red-800 p-4">
                {trendingRooms.map((room, index) => (
                  <div key={room.id}>
                    <div
                      className="flex items-center justify-between py-2 px-2 hover:bg-red-800/30 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleRoomClick(room.id)}>
                      <span className="text-sm font-medium leading-none">
                        {room.name}
                      </span>
                      <span className="text-sm text-orange-400 flex items-center">
                        <FaUsers className="mr-1" />
                        {room.userCount}
                      </span>
                    </div>
                    {index < trendingRooms.length - 1 && (
                      <Separator className="my-2 bg-red-800" />
                    )}
                  </div>
                ))}
              </ScrollArea>
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
