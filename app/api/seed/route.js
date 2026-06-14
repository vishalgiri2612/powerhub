import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Category from "@/models/Category";
import User from "@/models/User";
import { products, categories } from "@/app/data/products";

const initialMockOrders = [
  {
    id: "RVT-98274-IN",
    date: "June 08, 2026",
    status: "In Transit",
    statusColor: "text-amber-500 bg-amber-50",
    total: 3999,
    savings: 1000,
    customerName: "ravtron",
    customerEmail: "ravtron@admin.com",
    items: [
      {
        name: "Ravtron Smart OLED 20K Power Bank",
        image: "/images/powerbank.png",
        price: 3999,
        qty: 1
      }
    ],
    trackingSteps: [
      { title: "Order Placed", date: "June 08, 2026 10:30 AM", done: true },
      { title: "Packed & Verified", date: "June 08, 2026 04:15 PM", done: true },
      { title: "Shipped", date: "June 09, 2026 09:00 AM", done: true },
      { title: "In Transit", date: "June 12, 2026 05:40 AM", done: true },
      { title: "Delivered", date: "Pending Delivery", done: false }
    ]
  },
  {
    id: "RVT-78322-IN",
    date: "May 24, 2026",
    status: "Delivered",
    statusColor: "text-emerald-500 bg-emerald-50",
    total: 5498,
    savings: 2000,
    customerName: "Rahul Sharma",
    customerEmail: "rahul@gmail.com",
    items: [
      {
        name: "Pro HDMI 2.1 Display Cable",
        image: "/images/cable.png",
        price: 1499,
        qty: 1
      },
      {
        name: "GaN Pro 65W Triple Charger",
        image: "/images/charger.png",
        price: 3999,
        qty: 1
      }
    ],
    trackingSteps: [
      { title: "Order Placed", date: "May 24, 2026 02:22 PM", done: true },
      { title: "Packed & Verified", date: "May 24, 2026 06:10 PM", done: true },
      { title: "Shipped", date: "May 25, 2026 10:30 AM", done: true },
      { title: "In Transit", date: "May 27, 2026 09:12 AM", done: true },
      { title: "Delivered", date: "May 27, 2026 01:15 PM", done: true }
    ]
  }
];

const initialMockUsers = [
  { name: "Visha Rawat", email: "ravtron@admin.com", role: "Administrator", joinDate: "June 2026", active: true },
  { name: "Rahul Sharma", email: "rahul@gmail.com", role: "Customer", joinDate: "May 2026", active: true },
  { name: "Ksg Automation", email: "ksg@automation.com", role: "Customer", joinDate: "April 2026", active: false }
];

export async function GET() {
  try {
    await dbConnect();

    // 1. Seed Products
    await Product.deleteMany({});
    const seededProducts = await Product.insertMany(products);

    // 2. Seed Categories
    await Category.deleteMany({});
    const seededCategories = await Category.insertMany(categories);

    // 3. Seed Orders
    await Order.deleteMany({});
    const seededOrders = await Order.insertMany(initialMockOrders);

    // 4. Seed Users
    await User.deleteMany({});
    const seededUsers = await User.insertMany(initialMockUsers);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      counts: {
        products: seededProducts.length,
        categories: seededCategories.length,
        orders: seededOrders.length,
        users: seededUsers.length
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
