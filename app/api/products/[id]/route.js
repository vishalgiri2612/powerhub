import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findOne({ id });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updatedProduct = await Product.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true
    });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    await dbConnect();
    const { id } = await params;
    const deletedProduct = await Product.findOneAndDelete({ id });
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
