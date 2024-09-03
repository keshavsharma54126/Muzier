import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "";

  try {
    const rooms = await db.stream.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json({ rooms }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "error while fetching rooms for user" },
      { status: 400 }
    );
  }
}
