import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Music } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

const InputComponent = ({
  roomId,
  setSongs,
}: {
  roomId: string;
  userId: string;
  setSongs: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [url, setUrl] = useState("");
  const { data: session } = useSession();
  //@ts-ignore
  const userId = session?.user?.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  const addSong = async () => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");

      if (!videoId) {
        throw new Error("Invalid YouTube URL: Video ID not found.");
      }

      const apiKey =
        process.env.NEXT_YOUTUBE_APIKEY ||
        "AIzaSyByQXZDhTMVxdehWryqb6h4vAXcJ6u4cw4";
      if (!apiKey) {
        throw new Error("API key is missing.");
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
      );

      if (!response.data.items.length) {
        throw new Error("No video found for the provided ID.");
      }

      const title = response.data.items[0].snippet.title;
      const thumbnail = response.data.items[0].snippet.thumbnails.default.url;
      console.log(title, thumbnail);

      setSongs((prev: any[]) => [
        ...prev,
        { name: title, url, thumbnail, streamId: roomId, userId },
      ]);
    } catch (e) {
      console.error("Error while adding song to frontend:", e);
    }
  };

  const handleAddSong = async () => {
    try {
      const res = await axios.post("/api/addSong", {
        url,
        roomId,
        userId,
      });
      console.log(res.data);
      addSong();
      setUrl("");
    } catch (e) {
      alert("can not add a duplicate entry");
      console.error("error while adding song", e);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl">
      <CardHeader className="p-3 sm:p-4 md:p-5 ">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl  font-bold text-white flex items-center">
          <Music className="mr-2 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
          Add a Song
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-5 ">
        <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
          <Input
            type="text"
            placeholder="Paste YouTube or Spotify URL here"
            value={url}
            onChange={(e) => {
              handleInputChange(e);
            }}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-500 focus:ring-purple-500 h-9 sm:h-10 md:h-11 lg:h-12 text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 md:px-4 rounded"
          />
          <Button
            onClick={handleAddSong}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-2.5 md:py-3 lg:py-3.5 px-3 sm:px-4 md:px-5 lg:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg h-9 sm:h-10 md:h-11 lg:h-12"
          >
            <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
            Add Song
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputComponent;
