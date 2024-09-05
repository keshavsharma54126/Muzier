import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Music, Video } from "lucide-react";

interface PlayerComponentProps {
  url: string;
}

const PlayerComponent: React.FC<PlayerComponentProps> = ({ url }) => {
  const [isYouTube, setIsYouTube] = useState(false);
  const [isSpotify, setIsSpotify] = useState(false);

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

  const renderPlayer = () => {
    if (isYouTube) {
      return (
        <div className="aspect-w-16 aspect-h-9 w-full">
          <ReactPlayer
            url={url}
            controls
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { modestbranding: 1 },
              },
            }}
          />
        </div>
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
        <p className="text-white text-center text-xs sm:text-sm md:text-base lg:text-lg p-2 sm:p-3 md:p-4 lg:p-5">
          Invalid URL. Please enter a valid YouTube or Spotify URL.
        </p>
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
