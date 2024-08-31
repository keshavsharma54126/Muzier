import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFire, FaUsers } from "react-icons/fa";

interface TrendingRoom {
  id: string;
  name: string;
  roomtype: string;
  userCount: number;
}

export function TrendingRooms() {
  const [trendingRooms, setTrendingRooms] = useState<TrendingRoom[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingRooms = async () => {
      try {
        const response = await fetch("/api/trendingrooms");
        if (response.ok) {
          const data = await response.json();
          setTrendingRooms(data);
        } else {
          console.error("Failed to fetch trending rooms");
        }
      } catch (error) {
        console.error("Error fetching trending rooms:", error);
      }
    };

    fetchTrendingRooms();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <Card className="bg-orange-800/30 border-orange-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaFire className="mr-2 text-orange-500" /> Trending Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingRooms.length === 0 ? (
          <p>No trending rooms at the moment.</p>
        ) : (
          <ul className="space-y-2">
            {trendingRooms.map((room) => (
              <li key={room.id}>
                <Button
                  className="w-full text-left justify-between bg-orange-700 hover:bg-orange-600"
                  onClick={() => handleJoinRoom(room.id)}>
                  <span>{room.name}</span>
                  <span className="flex items-center">
                    <FaUsers className="mr-1" />
                    {room.userCount}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
