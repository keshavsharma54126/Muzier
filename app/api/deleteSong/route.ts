import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "user is not signed in" },
      { status: 401 } // Change to 401
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const songId = searchParams.get("songId") || "";
    await db.song.delete({
      where: {
        id: songId,
      },
    });
    return NextResponse.json({ message: "song deleted" }, { status: 200 });
  } catch (e) {
    console.error("Error deleting song:", e); // Log the error
    return NextResponse.json(
      { message: "error while deleting song in the backend" },
      { status: 400 }
    );
  }
}
