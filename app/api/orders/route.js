import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const query = email ? { customerEmail: email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if order with this ID already exists
    if (body.id) {
      const existing = await Order.findOne({ id: body.id });
      if (existing) {
        return NextResponse.json({ error: "Order ID already exists" }, { status: 400 });
      }
    }
    
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
