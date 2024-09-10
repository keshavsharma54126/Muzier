import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomId } = await req.json();
    const songs = await db.song.findMany({
      where: {
        streamId: roomId,
      },
      include: {
        upvotes: true,
      },
    });
    console.log(songs);

    return NextResponse.json({ songs }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "error while fetching dat songs data from backend" },
      { status: 400 }
    );
  }
}
