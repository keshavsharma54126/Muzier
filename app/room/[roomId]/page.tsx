"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";

export default function RoomPage({ data }: any) {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/room/${roomId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomData) {
    return <div>Room not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{roomData.name}</h1>
      <p className="mb-4">Room Type: {roomData.roomtype}</p>
      <p className="mb-4">Room Code: {roomData.code}</p>
      <div className="flex space-x-4">
        <Button>Start Streaming</Button>
        <Button variant="outline">Invite Friends</Button>
      </div>
      {/* Add more room features here */}
    </div>
  );
}
