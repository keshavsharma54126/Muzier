import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdMeetingRoom } from "react-icons/md";

interface Room {
  id: string;
  name: string;
  roomtype: string;
  code: string;
}

export function MyRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      //@ts-ignore
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/myrooms");
          if (response.ok) {
            const data = await response.json();
            setRooms(data);
          } else {
            console.error("Failed to fetch rooms");
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      }
    };

    fetchRooms();
  }, [session]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <Card className="bg-purple-800/30 border-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MdMeetingRoom className="mr-2" /> My Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rooms.length === 0 ? (
          <p>You haven't created any rooms yet.</p>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <Button
                  className="w-full text-left justify-start bg-purple-700 hover:bg-purple-600"
                  onClick={() => handleRoomClick(room.id)}>
                  <MdMeetingRoom className="mr-2" />
                  {room.name} ({room.roomtype})
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
