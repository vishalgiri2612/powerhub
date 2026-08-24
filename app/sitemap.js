import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ravtron.in";

  // Core static pages
  const staticPages = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/support",
    "/privacy-policy",
    "/terms-and-conditions",
    "/shipping-policy",
    "/refund-policy"
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8
  }));

  // Dynamic product routes from database
  let productRoutes = [];
  try {
    await dbConnect();
    const products = await Product.find({}, "id updatedAt").lean();
    if (Array.isArray(products) && products.length > 0) {
      productRoutes = products.map((prod) => ({
        url: `${baseUrl}/product/${prod.id || prod._id}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt).toISOString() : new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9
      }));
    }
  } catch (error) {
    console.error("Error fetching products for dynamic sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
