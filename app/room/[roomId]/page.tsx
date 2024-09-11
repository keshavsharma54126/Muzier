"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/socket-provider";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon, CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { MdMeetingRoom } from "react-icons/md";
import { FaUsers, FaWifi, FaMusic, FaStepForward } from "react-icons/fa";

import InputComponent from "@/components/InputComponent";
import PlayerComponent from "@/components/PlayerComponent";
import axios from "axios";
import SongComponent from "@/components/Song";

interface songInterface {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  upvotes: any;
  streamId: string;
  userId: string;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { data: session } = useSession();
  const { socket, isConnected, viewers } = useSocket();
  //@ts-ignore
  const userId = session?.user?.id;

  const [songs, setSongs] = useState<songInterface[] | null>(null);

  const fetchRoomData = async () => {
    try {
      const response = await fetch(`/api/getRoomData?roomId=${roomId}`);
      const data = await response.json();
      setRoomData(data);
      const res = await axios.post("/api/getStreamSongs", {
        roomId,
      });
      console.log(res.data.songs);
      setSongs(res.data.songs);
    } catch (error) {
      console.error("Error fetching room data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const copyRoomCode = () => {
    if (roomData && roomData.code) {
      navigator.clipboard.writeText(roomData.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePlayNext = () => {
    console.log("Playing next song");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Loading...
      </div>
    );
  if (!roomData)
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Room not found
      </div>
    );

  return (
    <div className=" text-gray-200 flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black mt-16 ">
      <div className="flex-grow lg:w-4/5 xl:w-5/6 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full lg:w-2/5  space-y-6">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-purple-300">
                  Input
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <InputComponent
                  roomId={roomId}
                  userId={userId}
                  setSongs={setSongs as any} // Cast to the correct type
                />
              </CardContent>
            </Card>
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-purple-300">
                  Player
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <PlayerComponent url="https://www.youtube.com/watch?v=GhH1QWY6BDc&t=4389s" />
                <Button
                  onClick={handlePlayNext}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-gray-100 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center text-sm shadow-md">
                  <FaStepForward className="mr-2" />
                  Play Next
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-3/5">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg h-full">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-purple-300 flex items-center">
                  <FaMusic className="mr-2" /> Playlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[800px] w-full rounded-md">
                  <div className="space-y-3">
                    {songs?.map((song) => (
                      <SongComponent
                        key={song.id}
                        song={song}
                        roomData={roomData}
                        userId={userId}
                        setSongs={setSongs}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="lg:w-1/5 xl:w-1/6 p-4 sm:p-6 md:p-8 lg:p-10 m ">
        {(roomData.roomtype !== "private" || roomData.userId === userId) && (
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg text-gray-200 sticky top-10">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center text-purple-300">
                <MdMeetingRoom className="mr-2 text-purple-400" />
                {roomData.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible className="space-y-2">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 text-gray-300 hover:bg-white rounded-md">
                    <span>Room Information</span>
                    <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2 bg-gray-700/80 rounded-md">
                  <div className="text-sm text-gray-400">
                    Room Type: {roomData.roomtype}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Room Code: {roomData.code}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={copyRoomCode}
                      className="h-8 w-8 text-white-400 hover:bg-white-600/50">
                      {isCopied ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isCopied ? "Copied" : "Copy"}
                      </span>
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 bg-gray-800/80 px-4 py-2 rounded-full">
            <FaUsers className="text-purple-300" />
            <span>Online: {viewers}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/80 px-4 py-2 rounded-full">
            <FaWifi
              className={isConnected ? "text-green-500" : "text-red-500"}
            />
            <span>Status: {isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
