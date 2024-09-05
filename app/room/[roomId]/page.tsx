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
import {
  FaUsers,
  FaWifi,
  FaMusic,
  FaStepForward,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import InputComponent from "@/components/InputComponent";
import PlayerComponent from "@/components/PlayerComponent";

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

  const [songs, setSongs] = useState([
    { id: "1", title: "Song 1", artist: "Artist 1", score: 5, userVote: 0 },
    { id: "2", title: "Song 2", artist: "Artist 2", score: 3, userVote: 0 },
    { id: "3", title: "Song 3", artist: "Artist 3", score: 7, userVote: 0 },
    { id: "1", title: "Song 1", artist: "Artist 1", score: 5, userVote: 0 },
    { id: "2", title: "Song 2", artist: "Artist 2", score: 3, userVote: 0 },
    { id: "3", title: "Song 3", artist: "Artist 3", score: 7, userVote: 0 },
  ]);

  const handleVote = (songId: string, vote: number) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) => {
        if (song.id === songId) {
          const oldVote = song.userVote;
          const newVote = oldVote === vote ? 0 : vote;
          return {
            ...song,
            score: song.score - oldVote + newVote,
            userVote: newVote,
          };
        }
        return song;
      })
    );
    // Here you would also send an update to the server
    // socket.emit('vote_song', { roomId, songId, vote });
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/getRoomData?roomId=${roomId}`);
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
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
    <div className="mt-12 text-gray-200 flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black ">
      <div className="flex-grow lg:w-4/5 xl:w-5/6 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full lg:w-2/5 space-y-4">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-purple-300">
                  Input
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <InputComponent />
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
          <div className="w-full lg:w-2/5">
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-lg h-full">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-purple-300 flex items-center">
                  <FaMusic className="mr-2" /> Playlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[650px] w-full rounded-md">
                  <div className="space-y-3">
                    {songs.map((song) => (
                      <Card
                        key={song.id}
                        className="bg-purple-600/80 backdrop-blur-sm border-purple-600 hover:bg-gray-600/80 transition-colors duration-200 text-white">
                        <CardContent className="p-3 text-white">
                          <div className="flex items-center">
                            <div className="flex flex-col items-center mr-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVote(song.id, 1)}
                                className={`p-4 ${
                                  song.userVote === 1
                                    ? "text-green-400"
                                    : "text-gray-400 hover:text-green-400"
                                } hover:bg-gray-600/50`}>
                                <FaArrowUp className="h-8 w-8" />
                              </Button>
                              <span
                                className={`font-bold text-2xl ${
                                  song.score > 0
                                    ? "text-white-400"
                                    : song.score < 0
                                    ? "text-white-400"
                                    : "text-purple-500"
                                }`}>
                                {song.score}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVote(song.id, -1)}
                                className={`p-1 ${
                                  song.userVote === -1
                                    ? "text-blue-500"
                                    : "text-gray-400 hover:text-blue-500"
                                } hover:bg-gray-600/50`}>
                                <FaArrowDown className="h-8 w-8" />
                              </Button>
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold text-white-200 text-xl">
                                {song.title}
                              </h3>
                              <p className="text-sm text-white-400">
                                {song.artist}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-purple-300 hover:bg-gray-600/50 text-xs">
                              Play
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="lg:w-1/5 xl:w-1/6 p-4 sm:p-6 md:p-8 lg:p-10 ">
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
              <div className="flex flex-col space-y-2 mt-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-gray-100 transition-colors duration-200 shadow-md">
                  Start Streaming
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-purple-300 transition-colors duration-200">
                  Leave Room
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
