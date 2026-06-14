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
  ChevronRight
} from "lucide-react";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

export default function AdminPanelPage() {
  const router = useRouter();
  const { showToast } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, orders, users, categories

  // Data States
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Product Form Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    shortSpec: "",
    price: "",
    originalPrice: "",
    discountBadge: "",
    category: "",
    image: "",
    color: "",
    isNew: false,
    featured: false
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, new, featured
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, categoryName
  const [subTab, setSubTab] = useState("all"); // all, or category capsules

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

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
      price: priceNum,
      originalPrice: origPriceNum,
      discountBadge: productForm.discountBadge || "",
      category: productForm.category,
      image: productForm.image || "/images/charger.png",
      color: productForm.color || "Standard",
      isNew: !!productForm.isNew,
      featured: !!productForm.featured
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
            gallery: [
              productPayload.image,
              "/images/powerbank_side.png",
              "/images/charger_angle.png"
            ],
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

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
          subcategories: []
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to add category");
      }
      setNewCategoryName("");
      showToast("Category added successfully!");
      await fetchAdminData();
    } catch (err) {
      console.error("Error adding category:", err);
      showToast(err.message || "Failed to add category.", "error");
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

  const handleResetData = async () => {
    if (confirm("This will purge all custom products, orders, categories, and reset the MongoDB database. Proceed?")) {
      try {
        const response = await fetch("/api/seed");
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to reset database");
        }
        
        localStorage.removeItem("ravtron_products");
        localStorage.removeItem("ravtron_orders");
        localStorage.removeItem("ravtron_categories");
        localStorage.removeItem("ravtron_users");
        localStorage.removeItem("ravtron_address");

        showToast("E-commerce database reset to factory defaults.", "info");
        await fetchAdminData();
      } catch (err) {
        console.error("Error resetting database:", err);
        showToast(err.message || "Failed to reset database.", "error");
      }
    }
  };

  const openProductForm = (productToEdit = null) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setProductForm({
        name: productToEdit.name,
        shortSpec: productToEdit.shortSpec,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice,
        discountBadge: productToEdit.discountBadge || "",
        category: productToEdit.category,
        image: productToEdit.image,
        color: productToEdit.color || "",
        isNew: productToEdit.isNew || false,
        featured: productToEdit.featured || false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        shortSpec: "",
        price: "",
        originalPrice: "",
        discountBadge: "",
        category: adminCategories[0]?.name || "Accessories",
        image: "/images/charger.png",
        color: "Standard",
        isNew: true,
        featured: false
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
    if (statusFilter === "new") matchesStatus = product.isNew;
    else if (statusFilter === "featured") matchesStatus = product.featured;
    else if (statusFilter === "active") matchesStatus = true; // all items are active in catalog

    return matchesSearch && matchesCategory && matchesSubTab && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-white text-[#1E293B] antialiased font-sans">
      
      {/* LEFT SIDEBAR (exactly matches screenshot layout design) */}
      <aside className="w-64 border-r border-slate-100 flex flex-col justify-between p-6 bg-white shrink-0">
        <div className="space-y-8">
          {/* Logo / Menu Header */}
          <div className="px-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MENU</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview" 
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "products" 
                  ? "bg-slate-50 text-slate-900 font-bold" 
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "orders" 
                  ? "bg-slate-50 text-slate-900 font-bold" 
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "users" 
                  ? "bg-slate-50 text-slate-900 font-bold" 
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "categories" 
                  ? "bg-slate-50 text-slate-900 font-bold" 
                  : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
              }`}
            >
              <FolderPlus className="w-4 h-4 text-slate-400" />
              <span>Categories</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Log out */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Reset Database</span>
          </button>
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
      <main className="flex-grow p-8 md:p-12 bg-slate-50/50 min-h-screen overflow-y-auto">
        
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Admin Terminal Overview</h1>
                <p className="text-xs text-slate-400">Monitor global system parameters, database integrations, and transactions.</p>
              </div>
            </div>

            {/* Stats Cards Row (matching Gross Sales card design style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">₹{totalSalesVal.toLocaleString()}</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">{adminOrders.length} placed</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Catalog</p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">{adminProducts.length} items</h3>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">{adminUsers.length} profiles</h3>
              </div>
            </div>

            {/* Simulation Status & Database card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">Simulation Status</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 tracking-wider">Operational</span>
                </div>
                <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed">
                  <p>
                    This administrative terminal is synced directly to the live **MongoDB Atlas Cloud Database** via backend REST API routes. Changes made to products, categories, users, or order milestones are persisted securely in the cloud and propagate in real time across the entire application workspace.
                  </p>
                  <p>
                    Placing an order through the Cart secures coordinates and inserts the payload here. Updating order milestones (like shifting an item to <strong>Shipped</strong> or <strong>Delivered</strong>) automatically updates the customer profile package tracker instantly!
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Database Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Database Engine</span>
                      <span className="font-bold text-slate-900">MongoDB Atlas</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Cluster Status</span>
                      <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Protocol</span>
                      <span className="font-bold text-slate-900">SRV over DNS Cache</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Manage Products</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Recent orders Timeline list */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">Recent Activity Queue</h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-[#3674B5] hover:underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="space-y-4">
                {adminOrders.length > 0 ? (
                  adminOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#3674B5]/10 text-[#3674B5]">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{order.id} · {order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{order.items.length} item(s) · {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xs font-bold text-slate-900">₹{order.total.toLocaleString()}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-semibold text-slate-400 text-center py-6">No orders placed in database yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

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
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  subTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All Categories
              </button>
              {adminCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSubTab(cat.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    subTab === cat.name ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
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
                  {adminCategories.map((c) => (
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
                New: <span className="font-black text-blue-800">{filteredProducts.filter(p => p.isNew).length}</span>
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
                          <div className="flex flex-col gap-1 items-start">
                            {p.isNew && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-50 text-blue-600">
                                New
                              </span>
                            )}
                            {p.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-50 text-amber-600">
                                Featured
                              </span>
                            )}
                            {!p.isNew && !p.featured && (
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
                        <td className="p-4 font-bold text-slate-900">{u.name}</td>
                        <td className="p-4 text-slate-500 font-medium">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            u.role === "Administrator" ? "bg-[#3674B5]/10 text-[#3674B5]" : "bg-slate-100 text-slate-400"
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
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleToggleUserRole(u.email)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                                u.role === "Administrator"
                                  ? "border-rose-100 bg-rose-50/40 text-rose-600 hover:bg-rose-50"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {u.role === "Administrator" ? "Demote" : "Promote to Admin"}
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
            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Manage Product Categories</h1>
              <p className="text-xs text-slate-400 font-medium">Add category classifications or modify existing configurations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form card */}
              <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-50 pb-3">New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cables"
                      className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              {/* Category Directory List */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-800">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400 font-black">
                      <th className="p-4 w-12 text-center">SNo</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCategories.map((c, idx) => (
                      <tr key={c.name} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-base">{c.icon || "📦"}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => handleDeleteCategory(c.name)}
                              className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-50"
                              title="Delete Category"
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
              <div className="space-y-1.5">
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
                    {adminCategories.map((c) => (
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

              {/* Image & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Path</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/charger.png"
                    className="w-full bg-[#F8F9FA] border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-350"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>
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
              </div>

              {/* Status toggles */}
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-slate-900"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                  />
                  <span>Mark as New</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-slate-900"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Feature on Home</span>
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

      <SearchModal />
      <CartDrawer />
    </div>
  );
}
