import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if category already exists
    const existing = await Category.findOne({ name: body.name });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }
    
    const newCategory = await Category.create(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    
    if (!name) {
      return NextResponse.json({ error: "Category name parameter is required" }, { status: 400 });
    }
    
    const deleted = await Category.findOneAndDelete({ name });
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
