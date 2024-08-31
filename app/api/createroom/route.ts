import { RoomType } from "@prisma/client";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "user  not  signed in" },
      { status: 500 }
    );
  }
  //@ts-ignore

  try {
    const {
      roomName,
      roomType,
      userId,
    }: { roomName: string; roomType: RoomType; userId: string } =
      await req.json();
    const res = await prisma.stream.create({
      data: {
        name: roomName,
        roomtype: roomType,
        code: uuidv4(),
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(res, { status: 201 });
  } catch (e) {
    console.error("Error creating room:", e);
    return NextResponse.json(
      { message: "Error while room creation" },
      { status: 400 }
    );
  }
}
