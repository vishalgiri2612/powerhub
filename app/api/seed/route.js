import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Category from "@/models/Category";
import User from "@/models/User";
import HeroSlide from "@/models/HeroSlide";
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

export async function GET(request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Database seeding is disabled in production environments." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || request.headers.get("x-api-key");
    if (process.env.SEED_API_KEY && key !== process.env.SEED_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or missing seed API key." },
        { status: 401 }
      );
    }

    await dbConnect();
    const force = searchParams.get("force") === "true";

    let seededProductsCount = 0;
    let seededCategoriesCount = 0;
    let seededOrdersCount = 0;
    let seededUsersCount = 0;

    if (force) {
      // 1. Seed Products
      await Product.deleteMany({});
      const seededProducts = await Product.insertMany(products);
      seededProductsCount = seededProducts.length;

      // 2. Seed Categories
      await Category.deleteMany({});
      const seededCategories = await Category.insertMany(categories);
      seededCategoriesCount = seededCategories.length;

      // 3. Seed Orders
      await Order.deleteMany({});
      const seededOrders = await Order.insertMany(initialMockOrders);
      seededOrdersCount = seededOrders.length;

      // 4. Seed Users
      await User.deleteMany({});
      const seededUsers = await User.insertMany(initialMockUsers);
      seededUsersCount = seededUsers.length;

      // 5. Seed Hero Slides (Delete custom slides to restore hardcoded defaults)
      await HeroSlide.deleteMany({});
    } else {
      // Safe incremental seed (only insert if empty or missing)
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        const seededProducts = await Product.insertMany(products);
        seededProductsCount = seededProducts.length;
      } else {
        const currentProducts = await Product.find({});
        seededProductsCount = currentProducts.length;
      }

      // Categories: add missing categories without wiping custom cover images
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        const seededCategories = await Category.insertMany(categories);
        seededCategoriesCount = seededCategories.length;
      } else {
        for (const cat of categories) {
          const exists = await Category.findOne({ name: cat.name });
          if (!exists) {
            await Category.create(cat);
          }
        }
        const currentCategories = await Category.find({});
        seededCategoriesCount = currentCategories.length;
      }

      // Orders
      const orderCount = await Order.countDocuments();
      if (orderCount === 0) {
        const seededOrders = await Order.insertMany(initialMockOrders);
        seededOrdersCount = seededOrders.length;
      } else {
        seededOrdersCount = orderCount;
      }

      // Users
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const seededUsers = await User.insertMany(initialMockUsers);
        seededUsersCount = seededUsers.length;
      } else {
        seededUsersCount = userCount;
      }
    }

    return NextResponse.json({
      success: true,
      message: force ? "Database reset and seeded successfully!" : "Database seeded incrementally (safe mode)!",
      counts: {
        products: seededProductsCount,
        categories: seededCategoriesCount,
        orders: seededOrdersCount,
        users: seededUsersCount
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
