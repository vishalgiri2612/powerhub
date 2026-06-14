import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedOrder = await Order.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
