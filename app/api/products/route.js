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

    // 1. Return immediately from in-memory cache if valid (< 1ms response)
    const cached = getCachedProducts(excludeGallery);
    if (cached) {
      return NextResponse.json(cached);
    }

    await dbConnect();

    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
    const products = rawProducts.map((p) => {
      const obj = { ...p };
      if (obj.name) obj.name = obj.name.replace(/ravtron/gi, "RAVTRON");
      if (obj.description) obj.description = obj.description.replace(/ravtron/gi, "RAVTRON");
      return obj;
    });

    // Cache both full & gallery-excluded variants
    setCachedProducts(products, false);
    setCachedProducts(
      products.map((p) => {
        const { gallery, ...rest } = p;
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
