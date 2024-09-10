import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "user not signed" }, { status: 400 });
    }
    const { userId, songId }: { userId: string; songId: string } =
      await req.json(); // Added await
    const existingUpvote = await db.upvote.findUnique({
      where: {
        userId,
        songId,
      },
    });
    if (existingUpvote) {
      await db.upvote.update({
        where: {
          userId,
          songId,
        },
        data: {
          upvoted: existingUpvote.upvoted,
          downvoted: !existingUpvote.downvoted,
        },
      });
    } else {
      await db.upvote.create({
        data: {
          userId,
          songId,
          upvoted: false,
          downvoted: true,
        },
      });
    }
    return NextResponse.json(
      { message: "upvote added successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "error while downvoting the song" },
      { status: 400 }
    );
  }
}
