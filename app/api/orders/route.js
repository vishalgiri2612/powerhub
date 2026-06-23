import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdmin, verifyUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      if (!(await verifyUser(email))) {
        return NextResponse.json({ error: "Unauthorized access: Mismatching session" }, { status: 403 });
      }
    } else {
      if (!(await verifyAdmin())) {
        return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
      }
    }

    await dbConnect();
    const query = email ? { customerEmail: email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.customerEmail || !(await verifyUser(body.customerEmail))) {
      return NextResponse.json({ error: "Unauthorized: Invalid session or missing email" }, { status: 403 });
    }

    await dbConnect();

    // 1. Recalculate and validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of body.items) {
      if (!item.productId) {
        return NextResponse.json({ error: `Missing productId for item: ${item.name}` }, { status: 400 });
      }

      // Fetch product from MongoDB to obtain trusted price
      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return NextResponse.json({ error: `Product not found in database: ${item.productId}` }, { status: 404 });
      }

      // Determine correct price based on size configuration
      let price = product.price;
      if (item.selectedSize) {
        const sizePriceObj = product.sizePrices.find(sp => sp.size === item.selectedSize);
        if (sizePriceObj) {
          price = sizePriceObj.price;
        }
      }

      const qty = Number(item.qty || item.quantity || 1);
      subtotal += price * qty;

      validatedItems.push({
        productId: item.productId,
        selectedSize: item.selectedSize || null,
        name: item.name,
        image: product.image || item.image,
        price: price, // Set server-verified price
        qty: qty
      });
    }

    // 2. Validate Coupon and Savings
    let verifiedSavings = 0;

    // 3. Recalculate shipping delivery charge
    // Delivery: standard (free if subtotal > 999, else 99) or express (199)
    const deliveryCharge = body.deliveryPref === "express" ? 199 : subtotal > 999 ? 0 : 99;

    // 4. Recalculate tax and total
    const taxableAmount = Math.max(0, subtotal - verifiedSavings);
    const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
    const verifiedTotal = taxableAmount + deliveryCharge + taxAmount;

    // 5. Enforce server-calculated values
    body.items = validatedItems;
    body.total = verifiedTotal;
    body.savings = verifiedSavings;

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
