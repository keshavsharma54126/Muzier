import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "user not signed" }, { status: 400 });
    }

    const { userId, songId }: { userId: string; songId: string } =
      await req.json();

    // Check if the user has already voted on this song
    const existingVote = await db.upvote.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    if (existingVote) {
      // If the user has already upvoted, toggle the upvote
      if (existingVote.downvoted) {
        await db.upvote.update({
          where: {
            id: existingVote.id, // Use the unique ID of the existing vote
          },
          data: {
            upvoted: true,
            downvoted: false,
          },
        });
      } else {
        await db.upvote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            upvoted: !existingVote.upvoted, // Toggle upvoted state
          },
        });
      }
    } else {
      // If no existing vote, create a new upvote
      await db.upvote.create({
        data: {
          userId,
          songId,
          upvoted: true,
          downvoted: false,
        },
      });
    }

    return NextResponse.json(
      { message: "upvote added successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error while upvoting the song:", e);
    return NextResponse.json(
      { message: "error while upvotintg the song" },
      { status: 400 }
    );
  }
}
