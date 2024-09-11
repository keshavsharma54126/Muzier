import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { FaArrowDown, FaArrowUp, FaPlay, FaTrash } from "react-icons/fa";
import axios from "axios";

interface Upvote {
  userId: string;
  upvoted: boolean;
  downvoted: boolean;
}

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  upvotes: Upvote[];
}

interface SongComponentProps {
  song: Song;
  roomData: { userId: string };
  userId: string;
  setSongs: any;
}

const SongComponent: React.FC<SongComponentProps> = ({
  song,
  roomData,
  userId,
  setSongs,
}) => {
  const [isVoting, setIsVoting] = useState(false);

  const userVote = song.upvotes?.find((up) => up.userId === userId);
  const upvoted = userVote?.upvoted || false;
  const downvoted = userVote?.downvoted || false;

  const voteCount = song.upvotes?.reduce((acc, vote) => {
    if (vote.upvoted) return acc + 1;
    if (vote.downvoted) return acc - 1;
    return acc;
  }, 0);

  const handleVote = useCallback(
    async (voteType: "upvote" | "downvote") => {
      if (isVoting) return;
      setIsVoting(true);

      const newUpvoted = voteType === "upvote" ? !upvoted : false;
      const newDownvoted = voteType === "downvote" ? !downvoted : false;

      const optimisticUpdate = (prevSongs: Song[]) =>
        prevSongs.map((s) =>
          s.id === song.id
            ? {
                ...s,
                upvotes: userVote
                  ? s.upvotes.map((up) =>
                      up.userId === userId
                        ? {
                            ...up,
                            upvoted: newUpvoted,
                            downvoted: newDownvoted,
                          }
                        : up
                    )
                  : [
                      ...s.upvotes,
                      { userId, upvoted: newUpvoted, downvoted: newDownvoted },
                    ],
              }
            : s
        );

      setSongs(optimisticUpdate);

      try {
        await axios.post(`/api/${voteType}`, { userId, songId: song.id });
      } catch (error) {
        console.error(`Error ${voteType}ing the song:`, error);
        setSongs((prevSongs: any) =>
          prevSongs.map((s: any) => (s.id === song.id ? song : s))
        );
      } finally {
        setIsVoting(false);
      }
    },
    [isVoting, upvoted, downvoted, userId, song, setSongs]
  );

  const handleDelete = useCallback(async () => {
    try {
      await axios.delete(`/api/deleteSong?songId=${song.id}`);
      setSongs((prevSongs: any) =>
        prevSongs.filter((s: any) => s.id !== song.id)
      );
    } catch (error) {
      console.error("Error while deleting song:", error);
    }
  }, [song.id, setSongs]);

  return (
    <Card className="text-black bg-purple-200 backdrop-blur-sm border-purple-600 hover:bg-white transition-colors duration-200 hover:text-white">
      <CardContent className="p-3 text-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex flex-col items-center mr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("upvote")}
              disabled={isVoting}
              className={`p-4 ${
                upvoted
                  ? "text-green-400"
                  : "text-gray-400 hover:text-green-400"
              } hover:bg-gray-600/50`}>
              <FaArrowUp className="h-8 w-8" />
            </Button>
            <span
              className={`font-bold text-2xl ${
                voteCount > 0
                  ? "text-green-500"
                  : voteCount < 0
                  ? "text-red-500"
                  : "text-purple-500"
              }`}>
              {voteCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("downvote")}
              disabled={isVoting}
              className={`p-1 ${
                downvoted
                  ? "text-blue-500"
                  : "text-gray-400 hover:text-blue-500"
              } hover:bg-gray-600/50`}>
              <FaArrowDown className="h-8 w-8" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={song.thumbnail}
              alt={song.name}
              width={150}
              height={100}
              className="rounded-md"
            />
            <h1 className="font-semibold text-black text-xl">{song.name}</h1>
          </div>
        </div>
        {roomData.userId === userId && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-green-300 hover:bg-gray-600/50">
              <FaPlay className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 hover:bg-gray-600/50">
              <FaTrash className="h-6 w-6" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongComponent;
