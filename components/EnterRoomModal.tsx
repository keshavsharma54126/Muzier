import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MdLogin } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";

export function EnterRoomModal() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }
    try {
      const res = await axios.post("/api/enterRoom", {
        roomCode,
      });
      console.log(res.data);
      router.push(`/room/${res.data.roomId}`);
    } catch (e) {
      console.error("error while entering room", e);
      setError("error while entering room");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
          <MdLogin className="mr-2" /> Join Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">
            Enter Room
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the room code to join this room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomCode" className="text-right text-gray-300">
                Room Code
              </Label>
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter room code"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white">
              Enter Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
