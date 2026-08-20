import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { verifyAdmin, verifyUser } from "@/lib/auth";
import { clearOrdersCache } from "@/lib/cache";
import { sendReturnStatusEmail } from "@/lib/email";

export async function PUT(request, { params }) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
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
    clearOrdersCache();

    // Check if return status was updated (e.g. Approved or Declined)
    if (body.returnRequest && body.returnRequest.status) {
      const status = body.returnRequest.status;
      if (status === "Approved" || status === "Declined") {
        sendReturnStatusEmail(updatedOrder, status, body.returnRequest.adminNote || "")
          .catch((err) => console.error("Return notification email error:", err));
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findOne({ id });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!(await verifyUser(order.customerEmail))) {
      return NextResponse.json({ error: "Unauthorized access: Mismatching session" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
