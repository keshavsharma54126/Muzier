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
    const existingUpvote = await db.upvote.findFirst({
      where: {
        userId,
        songId,
      },
    });
    if (existingUpvote) {
      if (existingUpvote.upvoted) {
        await db.upvote.update({
          where: {
            songId,
          },
          data: {
            downvoted: !existingUpvote.downvoted,
            upvoted: !existingUpvote.upvoted,
          },
        });
      } else if (existingUpvote.downvoted) {
        await db.upvote.update({
          where: {
            songId,
          },
          data: {
            downvoted: !existingUpvote.downvoted,
          },
        });
      }
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
