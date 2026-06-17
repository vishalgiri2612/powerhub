import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HeroSlide from "@/models/HeroSlide";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const slides = await HeroSlide.find({}).sort({ slideIndex: 1 });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { slideIndex, disconnected, connected, productId, tag1, tag1Desc, tag2, tag2Desc, tag3, tag3Desc } = body;

    if (slideIndex === undefined || slideIndex === null) {
      return NextResponse.json({ error: "slideIndex is required" }, { status: 400 });
    }

    if (!disconnected || !connected) {
      return NextResponse.json({ error: "Both connected and disconnected images are required" }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ error: "Target product ID is required" }, { status: 400 });
    }

    const updatedSlide = await HeroSlide.findOneAndUpdate(
      { slideIndex },
      {
        disconnected,
        connected,
        productId,
        tag1: tag1 || "",
        tag1Desc: tag1Desc || "",
        tag2: tag2 || "",
        tag2Desc: tag2Desc || "",
        tag3: tag3 || "",
        tag3Desc: tag3Desc || ""
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedSlide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    await HeroSlide.deleteMany({});
    return NextResponse.json({ success: true, message: "All custom hero slides deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
