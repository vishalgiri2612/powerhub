"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import {
  BarChart2,
  ShoppingBag,
  Users,
  Package,
  Plus,
  Trash2,
  Edit3,
  Check,
  Lock,
  Unlock,
  FolderPlus,
  RefreshCw,
  X,
  ArrowRight,
  LogOut,
  Home,
  Search,
  ArrowLeft,
  ChevronRight,
  Cable,
  Zap,
  Briefcase,
  Camera,
  Laptop,
  Tv,
  Network,
  Eye
} from "lucide-react";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

const getCategoryIconDetails = (categoryName) => {
  const iconClass = "w-4 h-4";
  switch (categoryName) {
    case "Cables":
    case "HDMI Cables":
    case "VGA Cables":
      return {
        icon: <Cable className={iconClass} />,
        bg: "bg-blue-50 text-[#3674B5] border-blue-100"
      };
    case "Power Cords":
      return {
        icon: <Cable className={iconClass} />,
        bg: "bg-cyan-50 text-cyan-600 border-cyan-100"
      };
    case "Converters":
      return {
        icon: <Zap className={iconClass} />,
        bg: "bg-amber-50 text-amber-600 border-amber-100"
      };
    case "Accessories":
      return {
        icon: <Briefcase className={iconClass} />,
        bg: "bg-slate-50 text-slate-600 border-slate-100"
      };
    case "Surveillance":
      return {
        icon: <Camera className={iconClass} />,
        bg: "bg-rose-50 text-rose-600 border-rose-100"
      };
    case "Docking Stations":
      return {
        icon: <Laptop className={iconClass} />,
        bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
      };
    case "Audio Video":
      return {
        icon: <Tv className={iconClass} />,
        bg: "bg-violet-50 text-violet-600 border-violet-100"
      };
    case "Networking":
      return {
        icon: <Network className={iconClass} />,
        bg: "bg-emerald-50 text-emerald-600 border-emerald-100"
      };
    default:
      return {
        icon: <Package className={iconClass} />,
        bg: "bg-slate-50 text-slate-500 border-slate-150"
      };
  }
};

export default function AdminPanelPage() {
  const router = useRouter();
  const { showToast, refreshProducts, refreshCategories } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, orders, users, categories

  // Data States
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const categoriesListToUse = adminCategories.length > 0
    ? adminCategories
    : [
        { name: "Cables" },
        { name: "Converters" },
        { name: "Accessories" },
        { name: "Surveillance" },
        { name: "Docking Stations" },
        { name: "Audio Video" },
        { name: "Networking" }
      ];

  // Product Form Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    shortSpec: "",
    description: "",
    price: "",
    originalPrice: "",
    discountBadge: "",
    category: "",
    image: "",
    gallery: [],
    sizes: [],
    privacySizes: [],
    sizePrices: [],
    color: "",
    stock: "",
    isNewArrival: false,
    featured: false,
    topSelling: false
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, new, featured
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, categoryName
  const [subTab, setSubTab] = useState("all"); // all, or category capsules

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e, type = "product") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const base64Url = await compressAndConvertToBase64(file);
      if (type === "product") {
        setProductForm((prev) => ({ ...prev, image: base64Url }));
      } else if (type === "category") {
        setNewCategoryImage(base64Url);
      }
      showToast("Image processed successfully!");
    } catch (err) {
      console.error("Image processing error:", err);
      showToast("Failed to process image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch administrator records from MongoDB APIs
  const fetchAdminData = async () => {
    try {
      const [resProducts, resOrders, resCategories, resUsers] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/users").then((r) => r.json())
      ]);
      setAdminProducts(Array.isArray(resProducts) ? resProducts : []);
      setAdminOrders(Array.isArray(resOrders) ? resOrders : []);
      setAdminCategories(Array.isArray(resCategories) ? resCategories : []);
      setAdminUsers(Array.isArray(resUsers) ? resUsers : []);

      // Refresh global state cache to propagate changes instantly
      refreshProducts();
      refreshCategories();
    } catch (err) {
      console.error("Error loading admin data:", err);
      showToast("Error loading administrator data.", "error");
    }
  };

  useEffect(() => {
    // Check if user session indicates administrator status
    const session = localStorage.getItem("ravtron_session");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role === "Administrator") {
        setIsAdmin(true);
      }
    }
    fetchAdminData();
  }, []);

  const fetchHeroSlides = async () => {
    setIsLoadingHero(true);
    try {
      const res = await fetch("/api/hero");
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading hero slides:", err);
      showToast("Error loading hero slides.", "error");
    } finally {
      setIsLoadingHero(false);
    }
  };

  const handleResetHero = async () => {
    if (confirm("Reset all Hero slides to their default hardcoded settings?")) {
      try {
        const response = await fetch("/api/hero", { method: "DELETE" });
        if (response.ok) {
          showToast("Hero slider reset to factory defaults.", "info");
          await fetchHeroSlides();
        } else {
          showToast("Failed to reset hero settings.", "error");
        }
      } catch (err) {
        console.error("Error resetting hero settings:", err);
        showToast("Error resetting hero settings.", "error");
      }
    }
  };

  useEffect(() => {
    if (activeTab === "hero") {
      fetchHeroSlides();
    }
  }, [activeTab]);

  const handleAdminAuthSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123" || adminPassword === "admin") {
      setIsAdmin(true);
      showToast("Access Granted. Welcome to Admin Panel.");
    } else {
      showToast("Invalid administrative credentials.", "error");
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const priceNum = Number(productForm.price);
    const origPriceNum = Number(productForm.originalPrice || productForm.price);

    const productPayload = {
      name: productForm.name,
      shortSpec: productForm.shortSpec,
      description: productForm.description || "",
      price: priceNum,
      originalPrice: origPriceNum,
      discountBadge: productForm.discountBadge || "",
      category: productForm.category,
      image: productForm.image || (productForm.gallery?.[0] || "/images/charger.png"),
      gallery: productForm.gallery || [],
      sizes: productForm.sizes || [],
      privacySizes: productForm.privacySizes || [],
      sizePrices: (productForm.sizePrices || [])
        .filter((sp) => sp.size && sp.price)
        .map((sp) => ({
          size: sp.size,
          price: Number(sp.price),
          originalPrice: Number(sp.originalPrice || sp.price)
        })),
      color: productForm.color || "Standard",
      stock: Number(productForm.stock || 0),
      isNewArrival: !!productForm.isNewArrival,
      featured: !!productForm.featured,
      topSelling: !!productForm.topSelling
    };

    try {
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productPayload)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update product");
        }
        showToast("Product updated successfully!");
      } else {
        const newId = "p-" + Date.now();
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...productPayload,
            id: newId,
            rating: 4.8,
            reviewsCount: 1
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to create product");
        }
        showToast("New product added successfully!");
      }

      setIsProductModalOpen(false);
      await fetchAdminData();
    } catch (err) {
      console.error("Error saving product:", err);
      showToast(err.message || "Failed to save product.", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to delete product");
        }
        // Clear hero slide cache so deleted product doesn't flash on next page refresh
        try { localStorage.removeItem("hero_slides_cache"); } catch (e) {}
        showToast("Product deleted successfully.", "info");
        await fetchAdminData();
      } catch (err) {
        console.error("Error deleting product:", err);
        showToast(err.message || "Failed to delete product.", "error");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const orderToUpdate = adminOrders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    let statusColor = "text-amber-500 bg-amber-50";
    if (newStatus === "Delivered") statusColor = "text-emerald-500 bg-emerald-50";
    if (newStatus === "Shipped") statusColor = "text-sky-500 bg-sky-50";
    if (newStatus === "Cancelled") statusColor = "text-rose-500 bg-rose-50";

    const currentSteps = orderToUpdate.trackingSteps ? [...orderToUpdate.trackingSteps] : [];

    const updatedSteps = currentSteps.map((step) => {
      if (step.title === newStatus) {
        return { ...step, date: new Date().toLocaleString(), done: true };
      }
      if (newStatus === "Delivered") {
        return { ...step, date: step.date === "Pending Delivery" || step.date === "Pending" ? new Date().toLocaleString() : step.date, done: true };
      }
      if (newStatus === "In Transit" && (step.title === "Order Placed" || step.title === "Packed & Verified" || step.title === "Shipped")) {
        return { ...step, done: true };
      }
      if (newStatus === "Shipped" && (step.title === "Order Placed" || step.title === "Packed & Verified")) {
        return { ...step, done: true };
      }
      if (newStatus === "Packed & Verified" && step.title === "Order Placed") {
        return { ...step, done: true };
      }
      return step;
    });

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus,
          statusColor,
          trackingSteps: updatedSteps
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update order status");
      }
      showToast(`Order status updated to: ${newStatus}`);
      await fetchAdminData();
    } catch (err) {
      console.error("Error updating order status:", err);
      showToast(err.message || "Failed to update status.", "error");
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryImage(category.image || "");
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (editingCategory) {
      try {
        const response = await fetch("/api/categories", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: editingCategory.name,
            newName: newCategoryName.trim(),
            image: newCategoryImage.trim() || "/images/charger.png"
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update category");
        }
        setNewCategoryName("");
        setNewCategoryImage("");
        setEditingCategory(null);
        showToast("Category updated successfully!");
        await fetchAdminData();
      } catch (err) {
        console.error("Error updating category:", err);
        showToast(err.message || "Failed to update category.", "error");
      }
    } else {
      const exists = adminCategories.some(
        (c) => c.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      );
      if (exists) {
        showToast("Category already exists.", "error");
        return;
      }

      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
            icon: "📦",
            image: newCategoryImage.trim() || "/images/charger.png",
            showOnHome: true,
            subcategories: []
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to add category");
        }
        setNewCategoryName("");
        setNewCategoryImage("");
        showToast("Category added successfully!");
        await fetchAdminData();
      } catch (err) {
        console.error("Error adding category:", err);
        showToast(err.message || "Failed to add category.", "error");
      }
    }
  };

  const handleSetCategoryPosition = async (name, position) => {
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, homePosition: Number(position) })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update category position");
      }
      showToast(position > 0 ? `Moved to slot ${position} on home page.` : "Removed from home page.");
      await fetchAdminData();
    } catch (err) {
      console.error("Error updating category position:", err);
      showToast(err.message || "Failed to update category position.", "error");
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (confirm(`Delete category "${catName}"?`)) {
      try {
        const response = await fetch(`/api/categories?name=${encodeURIComponent(catName)}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to delete category");
        }
        showToast("Category deleted.", "info");
        await fetchAdminData();
      } catch (err) {
        console.error("Error deleting category:", err);
        showToast(err.message || "Failed to delete category.", "error");
      }
    }
  };

  const handleToggleUserRole = async (email) => {
    const userToUpdate = adminUsers.find((u) => u.email === email);
    if (!userToUpdate) return;
    const nextRole = userToUpdate.role === "Administrator" ? "Customer" : "Administrator";

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, role: nextRole })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update user role");
      }
      showToast("User access permissions updated.");
      await fetchAdminData();
    } catch (err) {
      console.error("Error updating user role:", err);
      showToast(err.message || "Failed to update user role.", "error");
    }
  };

  const handleToggleUserActive = async (email) => {
    const userToUpdate = adminUsers.find((u) => u.email === email);
    if (!userToUpdate) return;
    const nextActive = userToUpdate.active === false ? true : false;

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, active: nextActive })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update user status");
      }
      showToast(nextActive ? "User activated successfully." : "User deactivated successfully.");
      await fetchAdminData();
    } catch (err) {
      console.error("Error updating user status:", err);
      showToast(err.message || "Failed to update user status.", "error");
    }
  };


  const openProductForm = (productToEdit = null) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setProductForm({
        name: productToEdit.name,
        shortSpec: productToEdit.shortSpec,
        description: productToEdit.description || "",
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice,
        discountBadge: productToEdit.discountBadge || "",
        category: productToEdit.category,
        image: productToEdit.image,
        gallery: productToEdit.gallery || [],
        sizes: productToEdit.sizes || [],
        privacySizes: productToEdit.privacySizes || [],
        sizePrices: productToEdit.sizePrices || [],
        color: productToEdit.color || "",
        stock: productToEdit.stock ?? 0,
        isNewArrival: productToEdit.isNewArrival || false,
        featured: productToEdit.featured || false,
        topSelling: productToEdit.topSelling || false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        shortSpec: "",
        description: "",
        price: "",
        originalPrice: "",
        discountBadge: "",
        category: categoriesListToUse[0]?.name || "Accessories",
        image: "/images/charger.png",
        gallery: ["/images/charger.png"],
        sizes: [],
        privacySizes: [],
        sizePrices: [],
        color: "Standard",
        stock: 0,
        isNewArrival: true,
        featured: false,
        topSelling: false
      });
    }
    setIsProductModalOpen(true);
  };

  const totalSalesVal = adminOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);

  // Authentication protection check screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] antialiased flex flex-col justify-between">
        <main className="flex-grow flex items-center justify-center px-4 py-24 relative overflow-hidden">
          <div className="absolute top-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-20 blur-3xl pointer-events-none" />

          <div className="w-full max-w-[420px] rounded-3xl bg-white border border-[#1E293B]/10 p-8 shadow-2xl relative z-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/20 flex items-center justify-center mx-auto text-[#3674B5]">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-[#1E293B]">Admin Authorization</h2>
              <p className="text-xs font-semibold text-[#1E293B]/50">Enter credentials to unlock administrative system capabilities.</p>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">Access Key Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password (admin123)"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5]"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <span>Authorize Terminal</span>
              </button>
            </form>
            <div className="pt-2">
              <button
                onClick={() => router.push("/")}
                className="text-xs font-bold text-[#3674B5] hover:text-[#578FCA] flex items-center justify-center gap-1.5 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Filter logic for Products list
  const filteredProducts = adminProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortSpec.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSubTab = subTab === "all" || product.category.toLowerCase() === subTab.toLowerCase();

    let matchesStatus = true;
    if (statusFilter === "new") matchesStatus = product.isNewArrival;
    else if (statusFilter === "featured") matchesStatus = product.featured;
    else if (statusFilter === "active") matchesStatus = true; // all items are active in catalog

    return matchesSearch && matchesCategory && matchesSubTab && matchesStatus;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#1E293B] antialiased font-sans">

      {/* LEFT SIDEBAR (exactly matches screenshot layout design) */}
      <aside className="w-64 border-r border-slate-100 flex flex-col justify-between p-6 bg-white shrink-0 h-full">
        <div className="space-y-8">
          {/* Logo / Menu Header */}
          <div className="px-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MENU</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "overview"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("products");
                setSubTab("all");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "products"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "orders"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "users"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "categories"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <FolderPlus className="w-4 h-4 text-slate-400" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("hero")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === "hero"
                  ? "bg-slate-50 text-slate-900 font-bold"
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`}
            >
              <Zap className="w-4 h-4 text-slate-400" />
              <span>Hero Manager</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Log out */}
        <div className="space-y-4 pt-4 border-t border-slate-100">

          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Go to Shop</span>
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-8 md:p-12 bg-slate-50/50 h-full overflow-y-auto">

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (() => {
          const totalRevenue = adminOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" && o.status !== "CANCELLED" ? o.total : 0), 0) || 42001;
          const ordersCount = adminOrders.length || 17;
          const customersCount = adminUsers.length || 6;
          const lowStockProducts = adminProducts.filter((p) => typeof p.stock === "number" && p.stock <= 5);

          const categorySalesMap = {};
          // Pre-seed some default baseline data
          categorySalesMap["Cables"] = 120;
          categorySalesMap["Converters"] = 85;
          categorySalesMap["Accessories"] = 60;

          adminOrders.forEach((order) => {
            if (order.status !== "Cancelled" && order.status !== "CANCELLED") {
              order.items.forEach((item) => {
                const prod = adminProducts.find((p) => p.name === item.name);
                const category = prod ? prod.category : "Accessories";
                categorySalesMap[category] = (categorySalesMap[category] || 0) + item.qty;
              });
            }
          });

          const categoryPerformance = Object.entries(categorySalesMap)
            .map(([categoryName, units]) => ({ categoryName, units }))
            .sort((a, b) => b.units - a.units)
            .slice(0, 3);

          const maxUnits = Math.max(...categoryPerformance.map(c => c.units), 1);

          const mockTransactions = [
            { id: "RVT-CANCEL-01", customerName: "Visha Rawat", status: "CANCELLED", date: "6/4/2026", total: 1 },
            { id: "RVT-DELIVER-02", customerName: "Rahul Sharma", status: "DELIVERED", date: "6/4/2026", total: 12500 },
            { id: "RVT-DELIVER-03", customerName: "Ksg Automation", status: "DELIVERED", date: "6/4/2026", total: 4500 },
            { id: "RVT-CANCEL-04", customerName: "ravtron", status: "CANCELLED", date: "6/4/2026", total: 1 },
            { id: "RVT-CANCEL-05", customerName: "Rahul Sharma", status: "CANCELLED", date: "6/4/2026", total: 7890 }
          ];

          const transactionsToDisplay = adminOrders.length > 0
            ? adminOrders.map(o => ({
              id: o.id,
              customerName: o.customerName,
              status: o.status.toUpperCase(),
              date: o.date.split(" ")[0] || o.date,
              total: o.total
            }))
            : mockTransactions;

          return (
            <div className="space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Dashboard Overview</h1>
                  <p className="text-xs text-slate-400 font-medium">Real-time store performance and logistics.</p>
                </div>
                <button
                  onClick={fetchAdminData}
                  className="w-fit inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total Revenue */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">₹0 today</p>
                </div>
                {/* Orders */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{ordersCount}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">0 placed today</p>
                </div>
                {/* Low Stock */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{lowStockProducts.length}</h3>
                  <p className={`text-[10px] font-semibold ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {lowStockProducts.length > 0 ? `${lowStockProducts.length} items low` : 'Requires attention'}
                  </p>
                </div>
                {/* Support */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Active tickets</p>
                </div>
                {/* Customers */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customers</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{customersCount}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Registered users</p>
                </div>
              </div>

              {/* Chart and Brand Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-100/60 pb-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Revenue Trend</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Performance over the last 30 days</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">Last 30 Days</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h4 className="text-2xl font-black text-slate-900">₹17,001</h4>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="relative w-full h-48 flex items-stretch">
                    {/* Y Axis */}
                    <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 h-36 pr-4 border-r border-slate-100/60 text-right w-12 shrink-0">
                      <span>₹18k</span>
                      <span>₹14k</span>
                      <span>₹9k</span>
                      <span>₹5k</span>
                      <span>₹0</span>
                    </div>
                    {/* Chart Area */}
                    <div className="flex-grow relative h-36 ml-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 144" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3674B5" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#3674B5" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal guidelines */}
                        <line x1="0" y1="0" x2="400" y2="0" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="0" y1="36" x2="400" y2="36" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="0" y1="72" x2="400" y2="72" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="0" y1="108" x2="400" y2="108" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="0" y1="144" x2="400" y2="144" stroke="#E2E8F0" strokeWidth="1.5" />

                        {/* Chart Area Fill */}
                        <path
                          d="M 0 130 C 80 110, 120 40, 200 60 C 280 80, 320 20, 400 10 L 400 144 L 0 144 Z"
                          fill="url(#chartGrad)"
                        />

                        {/* Chart Line Path */}
                        <path
                          d="M 0 130 C 80 110, 120 40, 200 60 C 280 80, 320 20, 400 10"
                          fill="none"
                          stroke="#3674B5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Chart Points */}
                        <circle cx="200" cy="60" r="4.5" fill="#3674B5" stroke="#FFFFFF" strokeWidth="2.5" />
                        <circle cx="400" cy="10" r="4.5" fill="#3674B5" stroke="#FFFFFF" strokeWidth="2.5" />
                      </svg>
                      {/* X Axis labels */}
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                        <span>06/03</span>
                        <span>06/04</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Performance */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm text-slate-900">Category Performance</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Top selling by volume</p>
                    </div>

                    <div className="space-y-4 pt-1">
                      {categoryPerformance.map((item, idx) => {
                        const colors = ["bg-[#3674B5]", "bg-[#DEC89E]", "bg-[#C39281]"];
                        const color = colors[idx] || "bg-slate-400";
                        const pct = (item.units / maxUnits) * 100;
                        return (
                          <div key={item.categoryName} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-600 font-bold">{item.categoryName}</span>
                              <span className="text-slate-950 font-black">{item.units} units</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                              <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("categories")}
                    className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all text-center flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <span>Manage Categories</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Transactions and Alerts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Recent Transactions */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Recent Transactions</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Logs of recent order activity</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-[#3674B5] hover:text-[#578FCA] hover:underline"
                    >
                      View All Orders
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionsToDisplay.slice(0, 5).map((tx) => {
                          const statusColor =
                            tx.status.toUpperCase() === "CANCELLED" ? "text-rose-500 bg-rose-50" :
                              tx.status.toUpperCase() === "DELIVERED" ? "text-emerald-500 bg-emerald-50" :
                                "text-amber-500 bg-amber-50";
                          return (
                            <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                              <td className="p-3 font-bold text-slate-900">{tx.id}</td>
                              <td className="p-3 text-slate-600 font-semibold">{tx.customerName}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${statusColor}`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-400 font-semibold">{tx.date}</td>
                              <td className="p-3 font-black text-slate-900">₹{tx.total.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm text-slate-900">Low Stock</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Critical stock level notifications</p>
                    </div>
                    {lowStockProducts.length === 0 ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
                          <Check className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-slate-900">0 Alerts</h4>
                          <p className="text-xs text-slate-400 font-semibold">Inventory levels healthy</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                        {lowStockProducts.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-amber-50/40 border border-amber-100/60 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={p.image} alt={p.name} className="w-7 h-7 object-contain rounded bg-white p-0.5 border border-slate-100 shrink-0" />
                              <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md shrink-0">
                              {p.stock} units
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab("products")}
                    className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all text-center flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <span>Check All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: PRODUCTS (Exactly copies styling filters, capsules, tables and buttons from screenshot) */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-fade-in">

            {/* Top header title and Add Product button */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Products & Inventory</h1>
                <p className="text-xs text-slate-400 font-medium">Manage adapters, cables, power banks and workspace inventories.</p>
              </div>
              <button
                onClick={() => openProductForm()}
                className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Capsules Sub-Navigation tabs (inside gray bar) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
              <button
                onClick={() => setSubTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${subTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                All Categories
              </button>
              {categoriesListToUse.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSubTab(cat.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${subTab === cat.name ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input, Dropdown Status and Category Filter section */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="relative flex-grow max-w-xl">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-300 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Catalog</option>
                  <option value="new">New Products Only</option>
                  <option value="featured">Featured on Home</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
                >
                  <option value="all">All Categories</option>
                  {categoriesListToUse.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badges details layout style */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <div className="px-3.5 py-1.5 bg-slate-100 rounded-lg text-slate-600">
                Results: <span className="font-black text-slate-900">{filteredProducts.length}</span>
              </div>
              <div className="px-3.5 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
                Active: <span className="font-black text-emerald-800">{filteredProducts.length}</span>
              </div>
              <div className="px-3.5 py-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                New: <span className="font-black text-blue-800">{filteredProducts.filter(p => p.isNewArrival).length}</span>
              </div>
              <div className="px-3.5 py-1.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-100">
                Featured: <span className="font-black text-amber-800">{filteredProducts.filter(p => p.featured).length}</span>
              </div>
            </div>

            {/* Data Table component representation layout */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                      <th className="p-4 w-12 text-center">SNo</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Orig Price</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4">Color Accent</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, index) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 text-center font-bold text-slate-400">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate max-w-xs sm:max-w-md">{p.name}</p>
                              <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.shortSpec}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 uppercase text-[9px] font-bold tracking-wider">{p.category}</td>
                        <td className="p-4 font-bold text-slate-900">₹{p.price.toLocaleString()}</td>
                        <td className="p-4 text-slate-400">₹{p.originalPrice.toLocaleString()}</td>
                        <td className="p-4">
                          {p.discountBadge ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                              {p.discountBadge}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{p.color}</td>
                        <td className="p-4">
                          {p.stock === 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black">
                              Out of Stock
                            </span>
                          ) : p.stock <= 5 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black">
                              {p.stock} Low
                            </span>
                          ) : (
                            <span className="text-slate-900 font-bold">{p.stock}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-50 text-blue-600">
                                New
                              </span>
                            )}
                            {p.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-50 text-amber-600">
                                Featured
                              </span>
                            )}
                            {!p.isNewArrival && !p.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-50 text-slate-400">
                                Standard
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openProductForm(p)}
                              className="p-1.5 rounded-lg border border-slate-150 bg-slate-50 hover:bg-slate-100 text-slate-600"
                              title="Edit Product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Orders Queue</h1>
              <p className="text-xs text-slate-400 font-medium">Manage customer transactions, packages, and shipping milestones.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                      <th className="p-4 w-12 text-center">SNo</th>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Tracking Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrders.map((order, idx) => (
                      <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-4 font-bold text-slate-900 tracking-tight">{order.id}</td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{order.date}</td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.map((item, idy) => (
                              <p key={idy} className="text-[10px] text-slate-600 truncate max-w-xs font-medium">
                                {item.name} <span className="font-bold text-slate-400">x{item.qty}</span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#3674B5]">₹{order.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <select
                              className="bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none"
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Packed & Verified">Packed & Verified</option>
                              <option value="Shipped">Shipped</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS/USERS */}
        {activeTab === "users" && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Customers Database</h1>
              <p className="text-xs text-slate-400 font-medium">Verify profiles, register admin permissions, and view client active states.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                      <th className="p-4 w-12 text-center">SNo</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Access Role</th>
                      <th className="p-4">Join Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions / Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u, index) => (
                      <tr key={u.email} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 text-center font-bold text-slate-400">{index + 1}</td>
                        <td className="p-4 font-bold text-slate-900">
                          <button
                            onClick={() => setSelectedCustomer(u)}
                            className="hover:text-[#3674B5] hover:underline font-bold text-left outline-none cursor-pointer"
                          >
                            {u.name}
                          </button>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.role === "Administrator" ? "bg-[#3674B5]/10 text-[#3674B5]" : "bg-slate-100 text-slate-400"
                            }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{u.joinDate}</td>
                        <td className="p-4">
                          <span className={`w-2 h-2 rounded-full inline-block ${u.active !== false ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                          <span className="ml-1.5 text-[10px] font-semibold text-slate-500">{u.active !== false ? "Active" : "Disabled"}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedCustomer(u)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                              title="View Customer Profile"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleToggleUserActive(u.email)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${u.active !== false
                                  ? "border-amber-100 bg-amber-50/40 text-amber-600 hover:bg-amber-50"
                                  : "border-emerald-100 bg-emerald-50/40 text-emerald-600 hover:bg-emerald-50"
                                }`}
                            >
                              {u.active !== false ? "Disable" : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
                <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                  System Catalog
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Manage Product Categories</h1>
                <p className="text-xs text-slate-400 font-medium">Add category classifications or modify existing configurations.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Form card */}
              <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {editingCategory ? "Edit Category" : "New Category"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {editingCategory ? "Modify existing category details." : "Define a new category grouping."}
                    </p>
                  </div>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName("");
                        setNewCategoryImage("");
                      }}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase hover:underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cables, Adapters..."
                      className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Image</label>
                      {isUploading && <span className="text-[10px] text-[#3674B5] font-extrabold animate-pulse">Uploading...</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. /images/cable.png"
                          className="flex-1 bg-[#F8F9FA] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                          value={newCategoryImage}
                          onChange={(e) => setNewCategoryImage(e.target.value)}
                        />
                        <label className="flex items-center justify-center px-4 bg-[#3674B5]/10 hover:bg-[#3674B5]/20 border border-[#3674B5]/30 text-[#3674B5] text-xs font-bold rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "category")}
                            disabled={isUploading}
                          />
                        </label>
                      </div>

                      {/* Thumbnail Preview */}
                      {newCategoryImage && (
                        <div className="w-full h-16 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center overflow-hidden p-1">
                          <img src={newCategoryImage} alt="Category Preview" className="h-full max-w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#3674B5] hover:bg-[#578FCA] text-white py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-md shadow-[#3674B5]/10"
                  >
                    {editingCategory ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Update Category</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Category</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Category Directory List */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Active Categories Directory</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Set home page position (max 6 slots) or hide categories.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Home Slots Used:</span>
                    <span className={`text-xs font-black ${
                      adminCategories.filter(c => c.homePosition > 0).length >= 6 ? "text-rose-500" : "text-emerald-600"
                    }`}>
                      {adminCategories.filter(c => c.homePosition > 0).length}/6
                    </span>
                  </div>
                </div>
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                      <th className="p-4 w-12 text-center">SNo</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Home Position (1–6)</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCategories.map((c, idx) => {
                      const iconObj = getCategoryIconDetails(c.name);
                      return (
                        <tr key={c.name} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                          <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-4 font-bold text-slate-900">
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${iconObj.bg}`}>
                                {iconObj.icon}
                              </span>
                              <span className="text-slate-800 text-sm font-semibold">{c.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={c.homePosition || 0}
                              onChange={(e) => handleSetCategoryPosition(c.name, Number(e.target.value))}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all outline-none cursor-pointer ${
                                c.homePosition > 0
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-400"
                              }`}
                            >
                              <option value={0}>— Not on Home —</option>
                              {[1,2,3,4,5,6].map(pos => {
                                const occupant = adminCategories.find(cat => cat.name !== c.name && cat.homePosition === pos);
                                return (
                                  <option key={pos} value={pos}>
                                    Slot {pos}{occupant ? ` (replaces ${occupant.name})` : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditCategoryClick(c)}
                                className="p-1.5 rounded-lg border border-slate-150 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
                                title="Edit Category"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.name)}
                                className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all hover:scale-105 active:scale-95"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB: HERO MANAGER */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Hero Section Manager</h1>
                <p className="text-xs text-slate-400 font-medium">Customize home page Hero slider images, tags, and product redirections.</p>
              </div>
              <button
                onClick={handleResetHero}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            {isLoadingHero ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">Loading hero configurations...</div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {[0, 1, 2].map((idx) => {
                  const existingSlide = heroSlides.find((s) => s.slideIndex === idx);
                  return (
                    <HeroSlideEditor
                      key={idx}
                      slideIndex={idx}
                      existingSlide={existingSlide}
                      products={adminProducts}
                      compressAndConvertToBase64={compressAndConvertToBase64}
                      showToast={showToast}
                      onSave={(updated) => {
                        setHeroSlides((prev) => {
                          const list = prev.filter((s) => s.slideIndex !== idx);
                          return [...list, updated].sort((a, b) => a.slideIndex - b.slideIndex);
                        });
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Product Form Modal (Add / Edit) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-100 p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">

            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct ? "Edit Product Details" : "Add Product to Catalog"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Configure hardware specifications, categories, and pricing index.</p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GaN Pro 120W Desktop Charger"
                  className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              {/* Spec */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Specifications</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3x USB-C · 120W Max"
                  className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                  value={productForm.shortSpec}
                  onChange={(e) => setProductForm({ ...productForm, shortSpec: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">About Product (Description)</label>
                <textarea
                  placeholder="Enter detailed description of the product..."
                  rows={3}
                  className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4999"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Price (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5999"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {categoriesListToUse.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promo Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. New, Bestseller"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.discountBadge}
                    onChange={(e) => setProductForm({ ...productForm, discountBadge: e.target.value })}
                  />
                </div>
              </div>

              {/* Cable Sizes Configurations — Always Visible */}
              {true && (
                <div className="space-y-3.5 border-t border-slate-100 pt-3 text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Available Cable Sizes & Custom Lengths
                  </label>
                  
                  {/* Presets */}
                  <div className="space-y-1">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["1.8 Mtr", "3.0 Mtr", "5 Mtr", "10 Mtr", "15 Mtr", "20 Mtr", "25 Mtr", "30 Mtr", "40 Mtr", "50 Mtr"].map((sz) => {
                        const isChecked = productForm.sizes?.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              let newSizes = [...(productForm.sizes || [])];
                              if (newSizes.includes(sz)) {
                                newSizes = newSizes.filter((s) => s !== sz);
                              } else {
                                newSizes.push(sz);
                              }
                              setProductForm({ ...productForm, sizes: newSizes });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-205 ${
                              isChecked
                                ? "bg-black text-white border-black shadow-2xs font-extrabold"
                                : "bg-slate-50 text-slate-500 border-slate-250 hover:bg-slate-100 hover:text-slate-800 font-bold"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Custom Add Section */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Add Custom Length (e.g. meter, yard, ft)</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 5 Meter, 3 Yard, 10 Ft, 15 Mtr"
                        className="flex-1 bg-[#F8F9FA] border border-slate-200/65 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                        id="customLengthInput"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !productForm.sizes?.includes(val)) {
                              setProductForm({
                                ...productForm,
                                sizes: [...(productForm.sizes || []), val]
                              });
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("customLengthInput");
                          const val = input?.value.trim();
                          if (val && !productForm.sizes?.includes(val)) {
                            setProductForm({
                              ...productForm,
                              sizes: [...(productForm.sizes || []), val]
                            });
                            input.value = "";
                          }
                        }}
                        className="px-4 bg-[#3674B5] text-white text-xs font-bold rounded-xl hover:bg-[#578FCA] transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Selected Output Preview */}
                  {productForm.sizes && productForm.sizes.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Currently Configured Sizes (Store Preview)</span>
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#F8F9FA] rounded-xl border border-slate-200">
                        {productForm.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold rounded-lg shadow-3xs"
                          >
                            <span>{sz}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm({
                                  ...productForm,
                                  sizes: productForm.sizes.filter((s) => s !== sz)
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[9px] text-slate-400 font-medium">
                    Admins can enter any custom length/unit. These options will dynamically show up in the customer storefront size selector.
                  </p>
                </div>
              )}

              {/* Privacy Screen Size Configurations — Always Visible */}
              <div className="space-y-3.5 border-t border-slate-100 pt-3 text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Privacy Screen — Available Sizes &amp; Resolutions
                  </label>

                  {/* Presets */}
                  <div className="space-y-1">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Common Laptop Screen Sizes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '12.5" 16:9 283x166mm',
                        '13.3" 16:9 300x176mm',
                        '13.3" 16:10 293x190mm',
                        '14" 16:9 316x184mm',
                        '14" 16:10 309x198mm',
                        '15.6" 16:9 351x204mm',
                        '15.6" 16:10 342x220mm',
                        '16" 16:10 344x215mm',
                        '17.3" 16:9 382x215mm'
                      ].map((sz) => {
                        const isChecked = productForm.privacySizes?.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              let newSizes = [...(productForm.privacySizes || [])];
                              if (newSizes.includes(sz)) {
                                newSizes = newSizes.filter((s) => s !== sz);
                              } else {
                                newSizes.push(sz);
                              }
                              setProductForm({ ...productForm, privacySizes: newSizes });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-205 ${
                              isChecked
                                ? "bg-black text-white border-black shadow-2xs font-extrabold"
                                : "bg-slate-50 text-slate-500 border-slate-250 hover:bg-slate-100 hover:text-slate-800 font-bold"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Add Section */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Add Custom Size / Resolution</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder='e.g. 14" 16:9 309x174mm'
                        className="flex-1 bg-[#F8F9FA] border border-slate-200/65 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                        id="customPrivacySizeInput"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !productForm.privacySizes?.includes(val)) {
                              setProductForm({
                                ...productForm,
                                privacySizes: [...(productForm.privacySizes || []), val]
                              });
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("customPrivacySizeInput");
                          const val = input?.value.trim();
                          if (val && !productForm.privacySizes?.includes(val)) {
                            setProductForm({
                              ...productForm,
                              privacySizes: [...(productForm.privacySizes || []), val]
                            });
                            input.value = "";
                          }
                        }}
                        className="px-4 bg-[#3674B5] text-white text-xs font-bold rounded-xl hover:bg-[#578FCA] transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Selected Output Preview */}
                  {productForm.privacySizes && productForm.privacySizes.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Configured Sizes (Store Preview)</span>
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#F8F9FA] rounded-xl border border-slate-200">
                        {productForm.privacySizes.map((sz) => (
                          <span
                            key={sz}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold rounded-lg shadow-3xs"
                          >
                            <span>{sz}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm({
                                  ...productForm,
                                  privacySizes: productForm.privacySizes.filter((s) => s !== sz)
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[9px] text-slate-400 font-medium">
                    Select presets or type any custom size. These appear as selectable options on the product page for customers.
                  </p>
                </div>

              {/* Variant Pricing overrides */}
              {((productForm.sizes && productForm.sizes.length > 0) || (productForm.privacySizes && productForm.privacySizes.length > 0)) && (
                <div className="space-y-3 border-t border-slate-100 pt-3 text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Variant Specific Pricing overrides
                  </label>
                  <p className="text-[9px] text-slate-400 font-medium -mt-1 leading-normal">
                    Specify different prices for different length/size segments. Leave blank to default to the base product price.
                  </p>
                  <div className="space-y-2 bg-slate-50/50 rounded-xl p-3 border border-slate-200/60 max-h-[220px] overflow-y-auto">
                    {[...(productForm.sizes || []), ...(productForm.privacySizes || [])].map((sz) => {
                      const currentOverride = (productForm.sizePrices || []).find((sp) => sp.size === sz) || { size: sz, price: "", originalPrice: "" };
                      return (
                        <div key={sz} className="grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-4 text-[10px] font-extrabold text-slate-600 truncate" title={sz}>{sz}</span>
                          <div className="col-span-4">
                            <input
                              type="number"
                              required
                              placeholder="Price"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-800 outline-none focus:border-slate-350"
                              value={currentOverride.price}
                              onChange={(e) => {
                                const val = e.target.value;
                                let newOverrides = [...(productForm.sizePrices || [])];
                                const idx = newOverrides.findIndex((sp) => sp.size === sz);
                                if (idx > -1) {
                                  newOverrides[idx] = { ...newOverrides[idx], price: val ? Number(val) : "" };
                                } else {
                                  newOverrides.push({ size: sz, price: val ? Number(val) : "", originalPrice: "" });
                                }
                                setProductForm({ ...productForm, sizePrices: newOverrides });
                              }}
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              placeholder="Orig Price"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-800 outline-none focus:border-slate-350"
                              value={currentOverride.originalPrice}
                              onChange={(e) => {
                                const val = e.target.value;
                                let newOverrides = [...(productForm.sizePrices || [])];
                                const idx = newOverrides.findIndex((sp) => sp.size === sz);
                                if (idx > -1) {
                                  newOverrides[idx] = { ...newOverrides[idx], originalPrice: val ? Number(val) : "" };
                                } else {
                                  newOverrides.push({ size: sz, price: "", originalPrice: val ? Number(val) : "" });
                                }
                                setProductForm({ ...productForm, sizePrices: newOverrides });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Gallery (Up to 5 Images) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Product Images Gallery (Up to 5 Images)
                  </label>
                  {isUploading && (
                    <span className="text-[10px] text-[#3674B5] font-extrabold animate-pulse">
                      Uploading image...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((index) => {
                    const imgUrl = productForm.gallery?.[index];
                    return (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all group bg-[#F8F9FA] ${imgUrl
                            ? "border-slate-200"
                            : "border-dashed border-slate-300 hover:border-[#3674B5] hover:bg-slate-50"
                          }`}
                      >
                        {imgUrl ? (
                          <>
                            <img
                              src={imgUrl}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-contain p-1"
                            />
                            {/* Hover Overlay to Delete */}
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const newGallery = [...productForm.gallery];
                                  newGallery.splice(index, 1);
                                  setProductForm({
                                    ...productForm,
                                    gallery: newGallery,
                                    image: newGallery[0] || "/images/charger.png"
                                  });
                                }}
                                className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#3674B5]">
                            <Plus className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-bold uppercase">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setIsUploading(true);
                                try {
                                  const base64Url = await compressAndConvertToBase64(file);
                                  const newGallery = [...(productForm.gallery || [])];
                                  newGallery[index] = base64Url;
                                  setProductForm({
                                    ...productForm,
                                    gallery: newGallery,
                                    image: newGallery[0] || base64Url
                                  });
                                  showToast("Image processed successfully!");
                                } catch (err) {
                                  console.error("Image processing error:", err);
                                  showToast("Failed to process image.", "error");
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
                              disabled={isUploading}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  The first image will be set as the primary product cover image.
                </p>
              </div>

              {/* Color Accent & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Accent</label>
                  <input
                    type="text"
                    placeholder="e.g. Matte Black"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 50"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Status toggles */}
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-slate-900"
                    checked={productForm.isNewArrival}
                    onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-slate-900"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Shop Section</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-slate-900"
                    checked={productForm.topSelling}
                    onChange={(e) => setProductForm({ ...productForm, topSelling: e.target.checked })}
                  />
                  <span>Top Selling Section</span>
                </label>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Customer Profile & Orders Detail Modal */}
      {selectedCustomer && (() => {
        const custOrders = adminOrders.filter(
          (o) => o.customerEmail?.toLowerCase() === selectedCustomer.email?.toLowerCase() ||
                 o.customerName?.toLowerCase() === selectedCustomer.name?.toLowerCase()
        );

        return (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-100 p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in text-left">
              
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setExpandedOrderId(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/20 flex items-center justify-center text-[#3674B5] font-black text-sm uppercase">
                      {selectedCustomer.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Joined on {selectedCustomer.joinDate}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-slate-800">{selectedCustomer.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Access Role</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block ${
                      selectedCustomer.role === "Administrator" ? "bg-[#3674B5]/10 text-[#3674B5]" : "bg-slate-200 text-slate-600"
                    }`}>
                      {selectedCustomer.role}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Account Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full inline-block ${selectedCustomer.active !== false ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                      <span className="text-xs font-semibold text-slate-800">{selectedCustomer.active !== false ? "Active (Enabled)" : "Disabled (Restricted)"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Orders Count</span>
                    <span className="text-xs font-black text-slate-800">{custOrders.length} orders placed</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase History & Tracking</h4>
                  
                  {custOrders.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Orders Placed Yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin">
                      {custOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <div key={order.id} className="border border-slate-100 rounded-xl bg-white shadow-2xs hover:border-slate-200 transition-colors overflow-hidden">
                            {/* Order Accordion Header */}
                            <div
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`text-[9px] text-slate-400 font-bold transition-transform duration-300 inline-block ${isExpanded ? 'rotate-90' : ''}`}>
                                  ▶
                                </span>
                                <span className="text-xs font-black text-slate-900">{order.id}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{order.date.split(" ")[0]}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${order.statusColor}`}>
                                  {order.status}
                                </span>
                                <span className="text-xs font-black text-[#3674B5]">₹{order.total.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Collapsible content details */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1.5 border-t border-slate-50 bg-slate-50/30 space-y-3.5 animate-fade-in">
                                <div className="space-y-2 pl-2.5 border-l-2 border-slate-200">
                                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Items Details</p>
                                  {order.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex justify-between text-xs font-semibold text-slate-700">
                                      <span>{item.name} <span className="text-slate-400 font-medium">x{item.qty}</span></span>
                                      <span>{item.price ? `₹${item.price.toLocaleString()}` : ""}</span>
                                    </div>
                                  ))}
                                </div>

                                {order.status !== "Cancelled" && order.status !== "CANCELLED" && order.status !== "Delivered" && order.status !== "DELIVERED" ? (
                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={async (e) => {
                                        e.stopPropagation(); // Prevent toggling accordion state
                                        if (confirm(`Are you sure you want to cancel order ${order.id}?`)) {
                                          await handleUpdateOrderStatus(order.id, "Cancelled");
                                          showToast(`Order ${order.id} cancelled successfully.`);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50/30 text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                                    >
                                      Cancel Order
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setExpandedOrderId(null);
                    }}
                    className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      <SearchModal />
      <CartDrawer />
    </div>
  );
}

function HeroSlideEditor({
  slideIndex,
  existingSlide,
  products,
  onSave,
  compressAndConvertToBase64,
  showToast
}) {
  const defaultSlides = [
    {
      disconnected: "/images/hero.png",
      connected: "/images/cable.png",
      productId: "p3",
      tag1: "Pro HDMI 2.1", tag1Desc: "8K Resolution",
      tag2: "Docking Hub", tag2Desc: "10-in-1 output",
      tag3: "CAT6 SFTP", tag3Desc: "10Gbps Speed"
    },
    {
      disconnected: "/images/charger.png",
      connected: "/images/webcam.png",
      productId: "p4",
      tag1: "GaN Pro 65W", tag1Desc: "Fast Charging",
      tag2: "Ring Webcam", tag2Desc: "4K Video Stream",
      tag3: "Power Cord", tag3Desc: "Heavy Duty"
    },
    {
      disconnected: "/images/powerbank.png",
      connected: "/images/earbuds.png",
      productId: "p5",
      tag1: "Smart Bank", tag1Desc: "OLED Diagnostics",
      tag2: "Hi-Fi Buds", tag2Desc: "ANC Workspace",
      tag3: "USB-C Cable", tag3Desc: "100W PD Power"
    }
  ];

  const slideDefaults = defaultSlides[slideIndex] || {};

  const [disconnected, setDisconnected] = useState("");
  const [connected, setConnected] = useState("");
  const [productId, setProductId] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag1Desc, setTag1Desc] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag2Desc, setTag2Desc] = useState("");
  const [tag3, setTag3] = useState("");
  const [tag3Desc, setTag3Desc] = useState("");

  const [isUploadingConnected, setIsUploadingConnected] = useState(false);
  const [isUploadingDisconnected, setIsUploadingDisconnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingSlide) {
      setDisconnected(existingSlide.disconnected || "");
      setConnected(existingSlide.connected || "");
      setProductId(existingSlide.productId || "");
      setTag1(existingSlide.tag1 || "");
      setTag1Desc(existingSlide.tag1Desc || "");
      setTag2(existingSlide.tag2 || "");
      setTag2Desc(existingSlide.tag2Desc || "");
      setTag3(existingSlide.tag3 || "");
      setTag3Desc(existingSlide.tag3Desc || "");
    } else {
      setDisconnected(slideDefaults.disconnected || "");
      setConnected(slideDefaults.connected || "");
      setProductId(slideDefaults.productId || "");
      setTag1(slideDefaults.tag1 || "");
      setTag1Desc(slideDefaults.tag1Desc || "");
      setTag2(slideDefaults.tag2 || "");
      setTag2Desc(slideDefaults.tag2Desc || "");
      setTag3(slideDefaults.tag3 || "");
      setTag3Desc(slideDefaults.tag3Desc || "");
    }
  }, [existingSlide]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "connected") setIsUploadingConnected(true);
    else setIsUploadingDisconnected(true);

    try {
      const base64Url = await compressAndConvertToBase64(file);
      if (type === "connected") {
        setConnected(base64Url);
      } else {
        setDisconnected(base64Url);
      }
      showToast(`${type === "connected" ? "Connected" : "Disconnected"} image uploaded successfully!`);
    } catch (err) {
      console.error(err);
      showToast("Failed to process image.", "error");
    } finally {
      if (type === "connected") setIsUploadingConnected(false);
      else setIsUploadingDisconnected(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!productId) {
      showToast("Please select a target product.", "error");
      return;
    }
    if (!disconnected || !connected) {
      showToast("Both connected and disconnected images are required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideIndex,
          disconnected,
          connected,
          productId,
          tag1,
          tag1Desc,
          tag2,
          tag2Desc,
          tag3,
          tag3Desc
        })
      });
      if (response.ok) {
        const updated = await response.json();
        onSave(updated);
        showToast(`Slide ${slideIndex + 1} settings saved!`);
      } else {
        const errData = await response.json();
        showToast(errData.error || "Failed to save slide settings.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving slide settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base text-slate-900">Hero Slide #{slideIndex + 1}</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Configure the connected/disconnected state images, tags, and product link.</p>
        </div>
        {existingSlide ? (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase">Custom Active</span>
        ) : (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded text-[9px] font-black uppercase">Factory Default</span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images Section */}
          <div className="space-y-4 text-left">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Slide Images</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Disconnected State Image */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Disconnected Image</label>
                  {isUploadingDisconnected && <span className="text-[9px] text-[#3674B5] font-extrabold animate-pulse">Uploading...</span>}
                </div>
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 p-2">
                  {disconnected ? (
                    <img src={disconnected} alt="Disconnected view" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-slate-300 text-xs font-bold">No Image</span>
                  )}
                </div>
                <label className="w-full flex items-center justify-center py-2 px-3 bg-[#3674B5]/5 hover:bg-[#3674B5]/10 border border-[#3674B5]/20 text-[#3674B5] text-[11px] font-bold rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98">
                  <span>Change Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "disconnected")} disabled={isUploadingDisconnected} />
                </label>
              </div>

              {/* Connected State Image */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Connected Image</label>
                  {isUploadingConnected && <span className="text-[9px] text-[#3674B5] font-extrabold animate-pulse">Uploading...</span>}
                </div>
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 p-2">
                  {connected ? (
                    <img src={connected} alt="Connected view" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-slate-300 text-xs font-bold">No Image</span>
                  )}
                </div>
                <label className="w-full flex items-center justify-center py-2 px-3 bg-[#3674B5]/5 hover:bg-[#3674B5]/10 border border-[#3674B5]/20 text-[#3674B5] text-[11px] font-bold rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-98">
                  <span>Change Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "connected")} disabled={isUploadingConnected} />
                </label>
              </div>
            </div>
          </div>

          {/* Links & Tags Section */}
          <div className="space-y-4 text-left">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Settings & Content</h4>
            
            {/* Product Redirection Select */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Click Target Product Redirection</label>
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
              >
                <option value="">-- Select Target Product --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    [{prod.category}] {prod.name} (₹{prod.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Inputs */}
            <div className="space-y-3 pt-2 text-left">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Floating Info Chips Text</label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 1 Label</span>
                  <input type="text" placeholder="e.g. Pro HDMI 2.1" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag1} onChange={(e) => setTag1(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 1 Description</span>
                  <input type="text" placeholder="e.g. 8K Resolution" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag1Desc} onChange={(e) => setTag1Desc(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 2 Label</span>
                  <input type="text" placeholder="e.g. Docking Hub" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag2} onChange={(e) => setTag2(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 2 Description</span>
                  <input type="text" placeholder="e.g. 10-in-1 output" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag2Desc} onChange={(e) => setTag2Desc(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 3 Label</span>
                  <input type="text" placeholder="e.g. CAT6 SFTP" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag3} onChange={(e) => setTag3(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Tag 3 Description</span>
                  <input type="text" placeholder="e.g. 10Gbps Speed" className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white" value={tag3Desc} onChange={(e) => setTag3Desc(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100/65">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? "Saving slide..." : "Save Slide Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
