// components/SocketProvider.tsx
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  viewers: number;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  viewers: 0,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setViewers(0);
    });

    socketInstance.on("update_viewers", (count: number) => {
      setViewers(count);
    });

    setSocket(socketInstance);

    return () => {
      console.log("Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && isConnected && roomId) {
      console.log("Joining room:", roomId);
      socket.emit("join_room", roomId);
      socket.emit("request_viewer_count", roomId);

      return () => {
        console.log("Leaving room:", roomId);
        socket.emit("leave_room", roomId);
        socket.off(`update_viewers_${roomId}`);
      };
    }
  }, [socket, isConnected, roomId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, viewers }}>
      {children}
    </SocketContext.Provider>
  );
};
