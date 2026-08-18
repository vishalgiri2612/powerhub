"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as fallbackProducts, categories as fallbackCategories } from "../data/products";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Global cache states for products, categories, and coupons to optimize page load speeds
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoupons(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch coupons in CartContext", err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const fetchProducts = async (retries = 3, delay = 1000) => {
    if (products.length === 0) {
      setProductsLoading(true);
    }
    try {
      const res = await fetch("/api/products?excludeGallery=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((p) => ({
          ...p,
          name: p.name ? p.name.replace(/ravtron/gi, "RAVTRON") : p.name,
          description: p.description ? p.description.replace(/ravtron/gi, "RAVTRON") : p.description
        }));
        setProducts(formatted);
        try {
          localStorage.setItem("powerhub_products_cache", JSON.stringify(formatted));
        } catch (e) {}
      }
      setProductsLoading(false);
    } catch (err) {
      console.error(`Failed to fetch products globally (retries left: ${retries})`, err);
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1, delay * 1.5), delay);
      } else {
        // Fallback to cached products if available, otherwise local static products
        try {
          const cached = localStorage.getItem("powerhub_products_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed);
              setProductsLoading(false);
              return;
            }
          }
        } catch (e) {}
        
        setProducts(fallbackProducts);
        setProductsLoading(false);
      }
    } finally {
      if (retries === 0) {
        setProductsLoading(false);
      }
    }
  };

  const fetchCategories = async (retries = 3, delay = 1000) => {
    if (categories.length === 0) {
      setCategoriesLoading(true);
    }
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        try {
          localStorage.setItem("powerhub_categories_cache", JSON.stringify(data));
        } catch (e) {}
      }
      setCategoriesLoading(false);
    } catch (err) {
      console.error(`Failed to fetch categories globally (retries left: ${retries})`, err);
      if (retries > 0) {
        setTimeout(() => fetchCategories(retries - 1, delay * 1.5), delay);
      } else {
        // Fallback to cached categories if available, otherwise local static categories
        try {
          const cached = localStorage.getItem("powerhub_categories_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCategories(parsed);
              setCategoriesLoading(false);
              return;
            }
          }
        } catch (e) {}
        
        setCategories(fallbackCategories);
        setCategoriesLoading(false);
      }
    } finally {
      if (retries === 0) {
        setCategoriesLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCoupons();
  }, []);

  const refreshProducts = () => fetchProducts();
  const refreshCategories = () => fetchCategories();
  const refreshCoupons = () => fetchCoupons();

  const isInitialized = React.useRef(false);

  // Load initial cart and wishlist from localStorage on client mount
  useEffect(() => {
    // Load products and categories cache safely on client mount
    try {
      const cachedProds = localStorage.getItem("powerhub_products_cache");
      if (cachedProds) {
        const parsed = JSON.parse(cachedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setProductsLoading(false);
        }
      }

      const cachedCats = localStorage.getItem("powerhub_categories_cache");
      if (cachedCats) {
        const parsed = JSON.parse(cachedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
          setCategoriesLoading(false);
        }
      }
    } catch (e) {
      console.warn("Failed to load products/categories cache on mount", e);
    }

    // Global theme initialization (Default & permanent Light Mode)
    document.documentElement.classList.add("light-mode");
    try {
      localStorage.removeItem("ravtron_theme");
    } catch (e) {}

    const savedCart = localStorage.getItem("ravtron_cart");
    const savedWishlist = localStorage.getItem("ravtron_wishlist");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
      }
    }
    isInitialized.current = true;


  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("ravtron_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Save wishlist to localStorage on changes
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("ravtron_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Toast notification helper
  const showToast = (message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const addToCart = (product, quantityToAdd = 1) => {
    const variantTag = product.selectedSize || product.selectedPrivacySize || product.selectedChannel;
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedPrivacySize === product.selectedPrivacySize &&
          item.selectedChannel === product.selectedChannel
      );
      if (existing) {
        showToast(`Added ${quantityToAdd}x ${product.name}${variantTag ? ` (${variantTag})` : ""} to cart`);
        return prevCart.map((item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedPrivacySize === product.selectedPrivacySize &&
          item.selectedChannel === product.selectedChannel
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      showToast(`Added ${quantityToAdd}x ${product.name}${variantTag ? ` (${variantTag})` : ""} to cart`);
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (target, selectedSize = null, selectedChannel = null) => {
    setCart((prevCart) => {
      let itemToRemove = null;

      if (typeof target === "object" && target !== null) {
        itemToRemove = target;
      } else {
        itemToRemove = prevCart.find(
          (i) =>
            (String(i.id) === String(target) || String(i._id) === String(target)) &&
            (i.selectedSize || null) === (selectedSize || null) &&
            (i.selectedChannel || null) === (selectedChannel || null)
        );
      }

      if (itemToRemove) {
        const variantTag = itemToRemove.selectedSize || itemToRemove.selectedPrivacySize || itemToRemove.selectedChannel;
        showToast(`Removed ${itemToRemove.name}${variantTag ? ` (${variantTag})` : ""} from cart`, "info");
      }

      return prevCart.filter((i) => {
        if (typeof target === "object" && target !== null) {
          return i !== target;
        }
        const matchesId = String(i.id) === String(target) || String(i._id) === String(target);
        const matchesSize = (i.selectedSize || null) === (selectedSize || null);
        const matchesChannel = (i.selectedChannel || null) === (selectedChannel || null);
        return !(matchesId && matchesSize && matchesChannel);
      });
    });
  };

  const updateQuantity = (target, amount, selectedSize = null, selectedChannel = null) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          let isMatch = false;
          if (typeof target === "object" && target !== null) {
            isMatch = item === target;
          } else {
            const matchesId = String(item.id) === String(target) || String(item._id) === String(target);
            const matchesSize = (item.selectedSize || null) === (selectedSize || null);
            const matchesChannel = (item.selectedChannel || null) === (selectedChannel || null);
            isMatch = matchesId && matchesSize && matchesChannel;
          }

          if (isMatch) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from wishlist`, "info");
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        showToast(`Added ${product.name} to wishlist`);
        return [...prevWishlist, product];
      }
    });
  };

  const applyCouponCode = (codeToApply) => {
    if (!codeToApply || typeof codeToApply !== "string") {
      showToast("Please enter a valid coupon code", "error");
      return false;
    }

    const cleanCode = codeToApply.trim().toUpperCase();
    const foundCoupon = coupons.find((c) => c.code === cleanCode && c.active);

    if (!foundCoupon) {
      showToast(`Coupon code '${cleanCode}' is invalid or expired`, "error");
      return false;
    }

    const subtotal = getSubtotal();
    if (foundCoupon.minPurchase > 0 && subtotal < foundCoupon.minPurchase) {
      showToast(`Minimum order amount of ₹${foundCoupon.minPurchase} required for '${cleanCode}'`, "error");
      return false;
    }

    let calculatedDiscount = 0;
    if (foundCoupon.type === "percentage") {
      calculatedDiscount = Math.round((subtotal * foundCoupon.discountValue) / 100);
    } else {
      calculatedDiscount = foundCoupon.discountValue;
    }

    setCoupon(cleanCode);
    setDiscount(calculatedDiscount);
    showToast(`Coupon '${cleanCode}' applied successfully! Saved ₹${calculatedDiscount}`);
    return true;
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCoupon("");
    showToast("Coupon code removed");
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCoupon("");
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isVideoOpen,
        setIsVideoOpen,
        activeProduct,
        setActiveProduct,
        coupon,
        discount,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        applyCouponCode,
        removeCoupon,
        clearCart,
        getSubtotal,
        getCartCount,
        showToast,
        products,
        productsLoading,
        categories,
        categoriesLoading,
        coupons,
        couponsLoading,
        refreshProducts,
        refreshCategories,
        refreshCoupons,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-5 py-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 animate-fade-in-up ${toast.type === "success"
              ? "bg-[#3674B5] text-white border-[#3674B5]/40"
              : toast.type === "error"
                ? "bg-[#3674B5] text-white border-[#3674B5]/40"
                : "bg-[#EDECE6] text-[#1E293B] border-[#1E293B]/15"
              }`}
          >
            {toast.type === "success" && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
