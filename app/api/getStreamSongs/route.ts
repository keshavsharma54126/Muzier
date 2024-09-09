import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomId } = await req.json();
    const res = await db.stream.findMany({
      where: {
        id: roomId,
      },
      select: {
        songs: true,
      },
    });
    const songs = res[0].songs;
    console.log(songs);
    return NextResponse.json({ songs }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "error while fetching dat songs data from backend" },
      { status: 400 }
    );
  }
}
