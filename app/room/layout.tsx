"use client";
import { SocketProvider } from "@/components/socket-provider";

export default function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) {
  return <div>{children}</div>;
}
