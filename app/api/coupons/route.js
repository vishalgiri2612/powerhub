import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT_COUPONS = [
  {
    code: "FESTIVE20",
    title: "Festive Season Special 20% OFF",
    description: "Get 20% OFF on all GaN Chargers, Cables, and Workspace Gear.",
    type: "percentage",
    discountValue: 20,
    minPurchase: 0,
    applicableCategory: "All",
    badgeType: "Festive Offer",
    active: true
  },
  {
    code: "WELCOME100",
    title: "Flat ₹100 Discount on First Order",
    description: "Enjoy ₹100 instant discount on orders above ₹999.",
    type: "fixed",
    discountValue: 100,
    minPurchase: 999,
    applicableCategory: "All",
    badgeType: "First Order",
    active: true
  },
  {
    code: "ACC15",
    title: "15% OFF Workspace Accessories",
    description: "Exclusive discount on Webcams, Privacy Filters, Adapters & Stands.",
    type: "percentage",
    discountValue: 15,
    minPurchase: 499,
    applicableCategory: "Accessories",
    badgeType: "Exclusive Offer",
    active: true
  }
];

export async function GET() {
  try {
    await dbConnect();
    let coupons = await Coupon.find({}).sort({ createdAt: -1 });

    if (!coupons || coupons.length === 0) {
      coupons = await Coupon.insertMany(DEFAULT_COUPONS);
    }

    return NextResponse.json(coupons);
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
    const { id, code, title, description, type, discountValue, minPurchase, applicableCategory, badgeType, expiryDate, active } = body;

    if (!code || !title || discountValue === undefined) {
      return NextResponse.json({ error: "Coupon code, title, and discount value are required" }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    if (id) {
      // Edit existing coupon
      const updated = await Coupon.findByIdAndUpdate(
        id,
        {
          code: uppercaseCode,
          title: title.trim(),
          description: description || "",
          type: type || "percentage",
          discountValue: Number(discountValue),
          minPurchase: Number(minPurchase || 0),
          applicableCategory: applicableCategory || "All",
          badgeType: badgeType || "Festive Offer",
          expiryDate: expiryDate || "",
          active: active !== undefined ? active : true
        },
        { new: true }
      );
      return NextResponse.json(updated);
    } else {
      // Create new coupon
      const existing = await Coupon.findOne({ code: uppercaseCode });
      if (existing) {
        return NextResponse.json({ error: `Coupon code '${uppercaseCode}' already exists.` }, { status: 400 });
      }

      const created = await Coupon.create({
        code: uppercaseCode,
        title: title.trim(),
        description: description || "",
        type: type || "percentage",
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase || 0),
        applicableCategory: applicableCategory || "All",
        badgeType: badgeType || "Festive Offer",
        expiryDate: expiryDate || "",
        active: active !== undefined ? active : true
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const code = searchParams.get("code");

    if (!id && !code) {
      return NextResponse.json({ error: "Coupon ID or Code is required" }, { status: 400 });
    }

    let deleted;
    if (id) {
      deleted = await Coupon.findByIdAndDelete(id);
    } else {
      deleted = await Coupon.findOneAndDelete({ code: code.toUpperCase() });
    }

    if (!deleted) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
