import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import HeroSlide from "@/models/HeroSlide";
import { verifyAdmin } from "@/lib/auth";
import { getCachedHero, setCachedHero, clearHeroCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Serve from cache if available (5-minute TTL)
    const cached = getCachedHero();
    if (cached) {
      return NextResponse.json(cached);
    }

    // First request: connect to real database and cache the result
    await dbConnect();
    const slides = await HeroSlide.find({}).sort({ slideIndex: 1 });
    setCachedHero(slides);

    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
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

    // Invalidate hero cache
    clearHeroCache();

    return NextResponse.json(updatedSlide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    await dbConnect();
    await HeroSlide.deleteMany({});
    
    // Invalidate hero cache
    clearHeroCache();

    return NextResponse.json({ success: true, message: "All custom hero slides deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
