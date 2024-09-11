import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Video } from "lucide-react";
import ReactPlayer from "react-player";

interface PlayerComponentProps {
  url: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const PlayerComponent: React.FC<PlayerComponentProps> = ({ url }) => {
  const [isYouTube, setIsYouTube] = useState(false);
  const [isSpotify, setIsSpotify] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [songs, setSongs] = useState<string[]>([url]); // Assuming you have a list of songs

  useEffect(() => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setIsYouTube(true);
      setIsSpotify(false);
    } else if (url.includes("spotify.com")) {
      setIsYouTube(false);
      setIsSpotify(true);
    } else {
      setIsYouTube(false);
      setIsSpotify(false);
    }
  }, [url]);

  useEffect(() => {
    if (isYouTube && !playerReady) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isYouTube, playerReady]);

  useEffect(() => {
    if (isYouTube && playerReady && playerRef.current) {
      new window.YT.Player(playerRef.current, {
        videoId: getYoutubeId(url),
        height: "260",
        width: "500",
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
      });
    }
  }, [isYouTube, playerReady, url]);

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const removeSong = (song: string) => {
    setSongs((prevSongs) => prevSongs.filter((s) => s !== song));
  };

  const renderPlayer = () => {
    if (isYouTube) {
      return (
        <div ref={playerRef} className="aspect-w-16 aspect-h-9 w-full"></div>
      );
    } else if (isSpotify) {
      const trackId = url.split("/").pop()?.split("?")[0];
      return (
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32">
          <iframe
            src={`https://open.spotify.com/embed/track/${trackId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowTransparency={true}
            allow="encrypted-media"
            className="rounded-lg"
          />
        </div>
      );
    } else {
      return (
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playerVars={{ origin: window.location.origin, autoplay: 1 }}
          className="rounded-lg"
          onEnded={() => removeSong(url)} // Remove the song when it ends
        />
      );
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl overflow-hidden">
      <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-5">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center">
          {isYouTube ? (
            <Video className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          ) : (
            <Music className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          )}
          {isYouTube
            ? "YouTube Player"
            : isSpotify
            ? "Spotify Player"
            : "Media Player"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5">
        {renderPlayer()}
      </CardContent>
    </Card>
  );
};

export default PlayerComponent;
