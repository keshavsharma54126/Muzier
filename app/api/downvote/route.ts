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

    const existingVote = await db.upvote.findFirst({
      where: {
        userId,
        songId,
      },
    });

    if (existingVote) {
      // If the user has already upvoted, we need to handle that
      if (existingVote.upvoted) {
        // If the user upvoted before, we need to downvote now
        await db.upvote.update({
          where: {
            id: existingVote.id, // Use the unique ID of the existing vote
          },
          data: {
            upvoted: false,
            downvoted: true,
          },
        });
      } else {
        // If the user has already downvoted, we toggle the downvote
        await db.upvote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            downvoted: !existingVote.downvoted, // Toggle downvoted state
          },
        });
      }
    } else {
      // If no existing vote, create a new downvote
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
      { message: "downvote processed successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error while downvoting the song:", e);
    return NextResponse.json(
      { message: "error while downvoting the song" },
      { status: 400 }
    );
  }
}
