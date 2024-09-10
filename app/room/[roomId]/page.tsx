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
import Image from "next/image"; // Ensure this import is present

import InputComponent from "@/components/InputComponent";
import PlayerComponent from "@/components/PlayerComponent";
import axios from "axios";

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
  const handleUpvote = async (songId: string) => {
    try {
      setSongs((prevSongs) =>
        //@ts-ignore
        prevSongs.map((song) => {
          if (song.id === songId) {
            // Check if the user has already downvoted
            const existingVote = song.upvotes.find(
              (up: any) => up.userId === userId
            );

            // Create a new upvotes array
            const updatedUpvotes = song.upvotes.filter(
              (up: any) => up.userId !== userId
            ); // Remove existing vote

            if (existingVote) {
              // If the user had downvoted, remove the downvote and add the upvote
              if (existingVote.downvoted) {
                updatedUpvotes.push({
                  userId,
                  songId,
                  upvoted: true,
                  downvoted: false,
                }); // Add new upvote
              }
              // If the user had upvoted, remove the upvote (toggle)
            } else {
              // If the user has not voted yet, just add the upvote
              updatedUpvotes.push({
                userId,
                songId,
                upvoted: true,
                downvoted: false,
              });
            }

            return { ...song, upvotes: updatedUpvotes }; // Update song with new upvotes
          }
          return song; // Return unchanged song
        })
      );
      await axios.post("/api/upvote", {
        userId,
        songId,
      });
    } catch (e) {
      console.error("error while updating upvotes", e);
    }
  };

  const handleDownvote = async (songId: string) => {
    setSongs((prevSongs) =>
      //@ts-ignore
      prevSongs.map((song) => {
        if (song.id === songId) {
          // Check if the user has already upvoted
          const existingVote = song.upvotes.find(
            (up: any) => up.userId === userId
          );

          // Create a new upvotes array
          const updatedUpvotes = song.upvotes.filter(
            (up: any) => up.userId !== userId
          ); // Remove existing vote

          if (existingVote) {
            // If the user had upvoted, remove the upvote and add the downvote
            if (existingVote.upvoted) {
              updatedUpvotes.push({ userId, upvoted: false, downvoted: true }); // Add new downvote
            }
            // If the user had downvoted, remove the downvote (toggle)
          } else {
            // If the user has not voted yet, just add the downvote
            updatedUpvotes.push({ userId, upvoted: false, downvoted: true });
          }

          return { ...song, upvotes: updatedUpvotes }; // Update song with new upvotes
        }
        return song; // Return unchanged song
      })
    );
    await axios.post("/api/downvote", {
      userId,
      songId,
    });
  };

  useEffect(() => {
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
    fetchRoomData();
  }, [roomId]);

  const copyRoomCode = () => {
    if (roomData && roomData.code) {
      navigator.clipboard.writeText(roomData.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDelete = async (songId: string) => {
    try {
      const response = await axios.delete(`/api/deleteSong?songId=${songId}`);
      if (response.status === 200) {
        setSongs((prevSongs) =>
          prevSongs ? prevSongs.filter((song) => song.id !== songId) : []
        );
      }
    } catch (e: any) {
      console.error(
        "Error while deleting song:",
        e.response?.data || e.message
      );
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
                      <Card
                        key={song.id}
                        className=" text-black bg-purple-200 backdrop-blur-sm border-purple-600 hover:bg-white transition-colors duration-200 hover:text-white">
                        <CardContent className="p-3 text-white">
                          <div className="flex items-center">
                            <div className="flex flex-col items-center mr-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpvote(song.id)}
                                className={`p-4 ${
                                  song.upvotes.some(
                                    (up: any) =>
                                      up.userId === userId && up.upvoted
                                  )
                                    ? "text-green-400"
                                    : "text-gray-400 hover:text-green-400"
                                } hover:bg-gray-600/50`}>
                                <FaArrowUp className="h-8 w-8" />
                              </Button>
                              <span
                                className={`font-bold text-2xl ${
                                  song.upvotes.filter((up: any) => {
                                    return up.upvoted === true;
                                  }).length -
                                    song.upvotes.filter((up: any) => {
                                      return up.downvoted === true;
                                    }).length >
                                  0
                                    ? "text-black"
                                    : song.upvotes.filter((up: any) => {
                                        return up.upvoted === true;
                                      }).length -
                                        song.upvotes.filter((up: any) => {
                                          return up.downvoted === true;
                                        }).length <
                                      0
                                    ? "text-black"
                                    : "text-purple-500"
                                }`}>
                                {song.upvotes.filter((up: any) => {
                                  return up.upvoted === true;
                                }).length -
                                  song.upvotes.filter((up: any) => {
                                    return up.downvoted === true;
                                  }).length}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownvote(song.id)}
                                className={`p-1 ${
                                  song.upvotes.some(
                                    (up: any) =>
                                      up.userId === userId && up.downvoted
                                  )
                                    ? "text-blue-500"
                                    : "text-gray-400 hover:text-blue-500"
                                } hover:bg-gray-600/50`}>
                                <FaArrowDown className="h-8 w-8" />
                              </Button>
                            </div>
                            <div className="flex flex-row gap-4">
                              <div>
                                <Image
                                  src={song.thumbnail}
                                  alt={song.name}
                                  width={150}
                                  height={100}
                                />
                              </div>
                              <h1 className="font-semibold text-black text-xl">
                                {song.name}
                              </h1>
                            </div>
                            {roomData.userId === userId && (
                              <div className="flex flex-row ml-10">
                                <Button
                                  variant="ghost"
                                  className="text-gray-400 hover:text-green-300 hover:bg-gray-600/50 text-xs">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-10 text-green-400">
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                    />
                                  </svg>
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={(e) => {
                                    handleDelete(song.id);
                                  }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-10 text-red-700">
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </Button>
                              </div>
                            )}
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
