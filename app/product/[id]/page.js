import ProductDetailClient from "./ProductDetailClient";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    await dbConnect();
    const product = await Product.findOne({ id });
    if (product) {
      return {
        title: `${product.name} | RAVTRON®`,
        description: product.description || `${product.name} - high-performance power adapter, cables, and dynamic electronic accessories from RAVTRON®.`,
        openGraph: {
          title: `${product.name} | RAVTRON®`,
          description: product.description || `${product.name} - high-performance power adapter, cables, and dynamic electronic accessories from RAVTRON®.`,
          images: product.image ? [{ url: product.image }] : []
        }
      };
    }
  } catch (e) {
    console.error("Failed to generate metadata for product " + id, e);
  }

  return {
    title: "Product Details | RAVTRON®",
    description: "High-performance power adapters, cables, and dynamic electronic accessories."
  };
}

export default async function ProductPage({ params }) {
  return <ProductDetailClient params={params} />;
}
