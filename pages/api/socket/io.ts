// pages/api/socket/io.ts
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const roomParticipants: { [roomId: string]: Set<string> } = {};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("join_room", (roomId) => {
        socket.join(roomId);
        if (!roomParticipants[roomId]) {
          roomParticipants[roomId] = new Set();
        }
        roomParticipants[roomId].add(socket.id);
        const participantCount = roomParticipants[roomId].size;
        console.log(
          `Client ${socket.id} joined room: ${roomId}. Total participants: ${participantCount}`
        );
        io.to(roomId).emit("update_viewers", participantCount);
      });

      socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
        if (roomParticipants[roomId]) {
          roomParticipants[roomId].delete(socket.id);
          const participantCount = roomParticipants[roomId].size;
          console.log(
            `Client ${socket.id} left room: ${roomId}. Total participants: ${participantCount}`
          );
          io.to(roomId).emit("update_viewers", participantCount);
        }
      });

      socket.on("disconnecting", () => {
        console.log(`Client ${socket.id} disconnecting`);
        for (const room of Array.from(socket.rooms)) {
          if (room !== socket.id && roomParticipants[room]) {
            roomParticipants[room].delete(socket.id);
            const participantCount = roomParticipants[room].size;
            console.log(
              `Room ${room}: participants before emit:`,
              participantCount
            );
            io.to(room).emit("update_viewers", participantCount);
            console.log(
              `Emitted update_viewers for room ${room} with count:`,
              participantCount
            );
          }
        }
      });

      socket.on("update_viewers", (roomId) => {
        const participantCount = roomParticipants[roomId]?.size || 0;
        console.log(
          `Manual update_viewers for room ${roomId}: ${participantCount}`
        );
        io.to(roomId).emit("update_viewers", participantCount);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
