import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const roomId = searchParams.get("roomId") || "";

  try {
    const room = await db.stream.findUnique({
      where: {
        id: roomId,
      },
    });
    return NextResponse.json(room, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "error while fetching rooms for user" },
      { status: 400 }
    );
  }
}
