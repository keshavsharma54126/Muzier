import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "user not signed in" },
        { status: 401 } // Changed to 401 for unauthorized access
      );
    }
    const { url, roomId, userId } = await req.json();
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    const apiKey = "AIzaSyBenioWr6YeAI54CBT3lMjf-kK__3ahOfo";

    // Check if videoId is valid
    if (!videoId) {
      return NextResponse.json(
        { message: "Invalid YouTube URL: Video ID not found." },
        { status: 400 }
      );
    }

    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    );
    console.log(res.data);
    // Check if the response contains items
    if (!res.data.items.length) {
      return NextResponse.json(
        { message: "No video found for the provided ID." },
        { status: 404 }
      );
    }

    const title = res.data.items[0].snippet.title;
    const thumbnail = res.data.items[0].snippet.thumbnails.default.url;

    const song = await db.song.create({
      data: {
        name: title,
        url,
        thumbnail,
        streamId: roomId,
        userId,
      },
    });
    await db.upvote.create({
      data: {
        userId,
        songId: song.id,
        upvoted: false,
        downvoted: false,
      },
    });

    return NextResponse.json(
      { message: "song has been added to stream songs" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in addSong API:", e); // Log the error for debugging
    return NextResponse.json(
      { message: "failed while pushing song to playlist in backend", error: e },
      { status: 400 }
    );
  }
}
