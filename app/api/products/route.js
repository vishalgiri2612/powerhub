import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/auth";
import { getCachedProducts, setCachedProducts, clearProductsCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeGallery = searchParams.get("excludeGallery") === "true";

    // Serve from cache if available (5-minute TTL)
    const cached = getCachedProducts(excludeGallery);
    if (cached) {
      return NextResponse.json(cached);
    }

    // First request: connect to real database and cache the result
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });

    // Cache both variants so all subsequent requests are instant
    setCachedProducts(products, false);
    setCachedProducts(
      products.map((p) => {
        const obj = p.toObject ? p.toObject() : p;
        const { gallery, ...rest } = obj;
        return rest;
      }),
      true
    );

    return NextResponse.json(getCachedProducts(excludeGallery));
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
    const newProduct = await Product.create(body);
    
    // Invalidate product cache
    clearProductsCache();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
