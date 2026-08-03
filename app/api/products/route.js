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

    await dbConnect();

    // Auto-update any existing mixed-case "Ravtron" product names in MongoDB to capital "RAVTRON"
    try {
      const itemsToFix = await Product.find({ name: { $regex: /ravtron/i } });
      for (const p of itemsToFix) {
        if (p.name && /ravtron/i.test(p.name) && !p.name.includes("RAVTRON")) {
          p.name = p.name.replace(/ravtron/gi, "RAVTRON");
          if (p.description) p.description = p.description.replace(/ravtron/gi, "RAVTRON");
          await p.save();
        }
      }
    } catch (e) {
      console.error("Auto-correcting MongoDB product names:", e);
    }

    const rawProducts = await Product.find({}).sort({ createdAt: -1 });
    const products = rawProducts.map((p) => {
      const obj = p.toObject ? p.toObject() : { ...p };
      if (obj.name) obj.name = obj.name.replace(/ravtron/gi, "RAVTRON");
      if (obj.description) obj.description = obj.description.replace(/ravtron/gi, "RAVTRON");
      return obj;
    });

    // Cache both variants so all subsequent requests are instant
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
