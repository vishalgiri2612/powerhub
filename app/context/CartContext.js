"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Global cache states for products and categories to optimize page load speeds
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchProducts = async () => {
    if (products.length === 0) {
      setProductsLoading(true);
    }
    try {
      const res = await fetch("/api/products?excludeGallery=true");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        try {
          localStorage.setItem("powerhub_products_cache", JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to fetch products globally", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (categories.length === 0) {
      setCategoriesLoading(true);
    }
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        try {
          localStorage.setItem("powerhub_categories_cache", JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.error("Failed to fetch categories globally", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const refreshProducts = () => fetchProducts();
  const refreshCategories = () => fetchCategories();

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

    // Global theme initialization
    const savedTheme = localStorage.getItem("ravtron_theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }

    // Listen for theme toggle events
    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem("ravtron_theme");
      if (updatedTheme === "light") {
        document.documentElement.classList.add("light-mode");
      } else {
        document.documentElement.classList.remove("light-mode");
      }
    };
    window.addEventListener("ravtron_theme_change", handleThemeChange);

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

    return () => {
      window.removeEventListener("ravtron_theme_change", handleThemeChange);
    };
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
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id && item.selectedSize === product.selectedSize);
      if (existing) {
        showToast(`Added ${quantityToAdd}x ${product.name}${product.selectedSize ? ` (${product.selectedSize})` : ""} to cart`);
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      showToast(`Added ${quantityToAdd}x ${product.name}${product.selectedSize ? ` (${product.selectedSize})` : ""} to cart`);
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId && i.selectedSize === selectedSize);
      if (item) {
        showToast(`Removed ${item.name}${selectedSize ? ` (${selectedSize})` : ""} from cart`, "info");
      }
      return prevCart.filter((item) => !(item.id === productId && item.selectedSize === selectedSize));
    });
  };

  const updateQuantity = (productId, amount, selectedSize = null) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId && item.selectedSize === selectedSize) {
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

  const applyCouponCode = (code) => {
    showToast("Invalid coupon code", "error");
    return false;
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
        refreshProducts,
        refreshCategories,
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
