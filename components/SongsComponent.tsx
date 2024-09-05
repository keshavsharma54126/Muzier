import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMusic } from "react-icons/fa";

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <FaMusic className="mr-2" /> Playlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {songs.length === 0 ? (
          <p className="text-center text-gray-400">No songs in the playlist</p>
        ) : (
          <ul className="space-y-2">
            {songs.map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between p-2 bg-purple-800/30 rounded-md">
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-300">{song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default SongList;
