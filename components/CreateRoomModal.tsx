import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdGroupAdd } from "react-icons/md";
import { RoomType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function CreateRoomModal() {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState<RoomType>(RoomType.public);
  const { data: session, status } = useSession();
  //@ts-ignore
  const userId = session?.user.id;

  const router = useRouter();
  const handleCreateRoom = async () => {
    try {
      const res = await axios.post("/api/createroom", {
        roomName,
        roomType,
        userId,
      });
      console.log(res);
      router.push(`/room/${res.data.id}`);
    } catch (e) {
      console.error("error while creating room", e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
          <MdGroupAdd className="mr-2" /> Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">
            Create a New Room
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter a name and select the type for your new music room.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="roomName" className="text-gray-200">
              Room Name
            </Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="bg-gray-700 text-white border-gray-600 focus:border-purple-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="roomType" className="text-gray-200">
              Room Type
            </Label>
            <Select
              onValueChange={(value) => setRoomType(value as RoomType)}
              defaultValue={RoomType.public}>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-purple-500">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value={RoomType.public}>Public</SelectItem>
                <SelectItem value={RoomType.private}>Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreateRoom}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!roomName.trim()}>
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
