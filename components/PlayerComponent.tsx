import React, { useState, useCallback, useEffect } from "react";
import YouTube from "react-youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStepForward } from "react-icons/fa";
import axios from "axios";

interface PlayerComponentProps {
  roomId: string;
}

interface Song {
  id: string;
  url: string;
  upvotes: any;
}

const PlayerComponent: React.FC<PlayerComponentProps> = ({ roomId }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  //@ts-ignore
  const [player, setPlayer] = useState<YT.Player | null>(null);

  const getNextSong = useCallback((): Song | null => {
    if (songs.length === 0) return null;

    const sortedSongs = [...songs].sort(
      (a, b) =>
        b.upvotes.filter((u: any) => u.songId === b.id && u.upvoted === true)
          .length -
        b.upvotes.filter((u: any) => u.songId === b.id && u.downvoted === true)
          .length -
        (a.upvotes.filter((u: any) => u.songId === a.id && u.upvoted === true)
          .length -
          a.upvotes.filter(
            (u: any) => u.songId === a.id && u.downvoted === true
          ).length)
    );
    console.log(songs);

    return sortedSongs[0];
  }, [songs]);

  const extractVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const playNextSong = useCallback(async () => {
    const nextSong = getNextSong();

    if (nextSong) {
      const videoId = extractVideoId(nextSong.url);
      if (videoId) {
        setCurrentVideoId(videoId);
        setSongs((prevSongs) =>
          prevSongs.filter((song) => song.id !== nextSong.id)
        );
        await axios.delete(`/api/deleteSong?songId=${nextSong.id}`);
      } else {
        console.error("Invalid YouTube URL:", nextSong.url);
        setSongs((prevSongs) =>
          prevSongs.filter((song) => song.id !== nextSong.id)
        );
        playNextSong(); // Ensure this is safe to call recursively
      }
    } else {
      console.log("No more songs to play");
      setCurrentVideoId(null);
    }
  }, [getNextSong]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.post<{ songs: Song[] }>("/api/getStreamSongs", {
          roomId,
        });
        console.log(res.data.songs);
        setSongs(res.data.songs);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    const intervalId = setInterval(fetchSongs, 5000);

    return () => clearInterval(intervalId);
  }, [roomId]);

  useEffect(() => {
    if (!currentVideoId) {
      playNextSong();
    }
  }, [currentVideoId, playNextSong, songs]);
  //@ts-ignore
  const onReady = (event: YT.PlayerEvent) => {
    setPlayer(event.target);
  };

  const onEnd = () => {
    playNextSong();
  };
  //@ts-ignore
  const onError = (event: YT.OnErrorEvent) => {
    console.error("YouTube player error:", event.data);
    playNextSong();
  };
  //@ts-ignore
  const opts: YT.PlayerOptions = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl overflow-hidden">
      <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-5">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center justify-between">
          <div className="flex items-center">YouTube Player</div>
          <Button
            onClick={playNextSong}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-gray-100 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center text-sm shadow-md">
            <FaStepForward className="mr-2" />
            Play Next
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5">
        {currentVideoId ? (
          <YouTube
            videoId={currentVideoId}
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
            onError={onError}
          />
        ) : (
          <p>No video is currently playing.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerComponent;
