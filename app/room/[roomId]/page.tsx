"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, CopyIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { MdMeetingRoom } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomData.code);
    const { toast } = useToast();
    toast({
      description: "Room code copied to clipboard",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomData) {
    return <div>Room not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row lg:justify-end">
        <div className="lg:w-1/3 w-full">
          {(roomData.roomtype !== "private" ||
            roomData.userId === userId ||
            !isModalOpen) && (
            <Card className="bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MdMeetingRoom className="mr-2 text-purple-400" />{" "}
                  {roomData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Collapsible className="space-y-2">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-9 text-white hover:bg-purple-800/30">
                      <span>Room Information</span>
                      <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    <div className="text-sm">
                      Room Type: {roomData.roomtype}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Room Code: {roomData.code}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyRoomCode}
                        className="h-8 w-8 text-white hover:bg-purple-800/30">
                        <CopyIcon className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-col space-y-2 mt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Streaming
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-white hover:bg-purple-800/30">
                    Invite Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="text-white ">Hello user</div>
    </div>
  );
}
