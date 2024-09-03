"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnterRoomModal } from "@/components/EnterRoomModal";
import { useSession } from "next-auth/react";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  if (!session) {
    router.push("/signin");
  }
  //@ts-ignore
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`/api/getRoomData`, {
          params: { roomId },
        });
        setRoomData(response.data);
        if (response.data.roomtype === "private") {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleEnterRoom = async (code: string) => {
    try {
      const response = await axios.post(`/api/verifyRoomCode`, {
        roomId,
        code,
      });
      if (response.data.success) {
        setIsModalOpen(false);
      } else {
        // Handle incorrect code
        console.error("Incorrect room code");
      }
    } catch (error) {
      console.error("Error verifying room code:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomData) {
    return <div>Room not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {roomData.roomtype === "private" && roomData.userId != userId && (
        <EnterRoomModal />
      )}
      {(roomData.roomtype !== "private" ||
        roomData.userId === userId ||
        !isModalOpen) && (
        <div className="text-white my-12">
          <h1 className="text-3xl font-bold mb-6">{roomData.name}</h1>
          <p className="mb-4">Room Type: {roomData.roomtype}</p>
          <p className="mb-4">Room Code: {roomData.code}</p>
          <div className="flex space-x-4">
            <Button>Start Streaming</Button>
            <Button variant="outline" className="text-black">
              Invite Friends
            </Button>
          </div>
          {/* Add more room features here */}
        </div>
      )}
    </div>
  );
}
