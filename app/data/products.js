export const products = [
  {
    id: "p1",
    name: "Ravtron 65W GaN Wall Charger",
    shortSpec: "2x USB-C · 1x USB-A · 65W · GaN Fast Charge",
    price: 2499,
    originalPrice: 3499,
    discountBadge: "-28%",
    rating: 4.9,
    reviewsCount: 182,
    image: "/images/charger.png",
    gallery: [
      "/images/charger.png",
      "/images/charger_angle.png",
      "/images/charger_pack.png"
    ],
    category: "Accessories",
    featured: true,
    isNew: false,
    color: "Sage Green"
  },
  {
    id: "p2",
    name: "Ravtron Smart OLED 20K Power Bank",
    shortSpec: "20,000 mAh · 65W Max · Triple Ports",
    price: 3999,
    originalPrice: 4999,
    discountBadge: "Bestseller",
    rating: 4.9,
    reviewsCount: 340,
    image: "/images/powerbank.png",
    gallery: [
      "/images/powerbank.png",
      "/images/powerbank_side.png",
      "/images/powerbank_use.png"
    ],
    category: "Accessories",
    featured: true,
    isNew: false,
    color: "Sand Beige"
  },
  {
    id: "p3",
    name: "Ravtron Braided 100W Wattage Cable",
    shortSpec: "1.8m · 100W PD · Digital Live Wattage Display",
    price: 899,
    originalPrice: 1299,
    discountBadge: "-30%",
    rating: 4.8,
    reviewsCount: 95,
    image: "/images/cable.png",
    gallery: [
      "/images/cable.png",
      "/images/powerbank_use.png",
      "/images/charger_angle.png"
    ],
    category: "Cables",
    featured: true,
    isNew: true,
    color: "Cream Cord"
  },
  {
    id: "p4",
    name: "Ravtron Ultra HD 4K Ringlight Webcam",
    shortSpec: "4K UHD · Built-in LED Ring · Glass Lens",
    price: 5499,
    originalPrice: 7999,
    discountBadge: "New",
    rating: 4.9,
    reviewsCount: 54,
    image: "/images/webcam.png",
    gallery: [
      "/images/webcam.png",
      "/images/hero.png",
      "/images/charger.png"
    ],
    category: "Accessories",
    featured: true,
    isNew: true,
    color: "Clay Grey"
  },
  {
    id: "p5",
    name: "PowerBuds Active Noise Canceling Earbuds",
    shortSpec: "ANC 40dB · 40hr Battery · Sand Gold Charging Case",
    price: 2999,
    originalPrice: 4499,
    discountBadge: "-33%",
    rating: 4.8,
    reviewsCount: 124,
    image: "/images/earbuds.png",
    gallery: [
      "/images/earbuds.png",
      "/images/charger.png",
      "/images/powerbank.png"
    ],
    category: "Accessories",
    featured: false,
    isNew: true,
    color: "Sand & Gold"
  },
  {
    id: "p6",
    name: "Ravtron 3-in-1 Wood MagSafe Stand",
    shortSpec: "15W MagSafe · Beechwood Base · Phone/Watch/AirPods",
    price: 4500,
    originalPrice: 5999,
    discountBadge: "Premium",
    rating: 4.9,
    reviewsCount: 88,
    image: "/images/magsafe.png",
    gallery: [
      "/images/magsafe.png",
      "/images/powerbank.png",
      "/images/charger.png"
    ],
    category: "Accessories",
    featured: false,
    isNew: false,
    color: "Beechwood Sand"
  }
];

export const categories = [
  {
    name: "Cables",
    icon: "🔌",
    subcategories: ["HDMI Cables", "VGA Cables", "Power Cords", "Cable Cum Converter"]
  },
  {
    name: "Converters",
    icon: "⚡",
    subcategories: ["HDMI", "VGA", "Display Port", "Mini DP", "Type C", "USB"]
  },
  {
    name: "Accessories",
    icon: "💼",
    subcategories: ["Privacy Filter", "Webcam", "Power Adapter", "Aux Cables", "SSD Enclosure", "Wall Mount", "Laptop Stand"]
  },
  {
    name: "Surveillance",
    icon: "🛡️",
    subcategories: ["CCTV Cables", "Power Supply", "PoE Switch", "BNC Connector", "DC Pin", "Video Balun"]
  },
  {
    name: "Docking Stations",
    icon: "💻",
    subcategories: ["Dual Type C", "Type C", "USB Hubs"]
  },
  {
    name: "Audio Video",
    icon: "📺",
    subcategories: ["HDMI Extender", "HDMI Splitter", "HDMI Switcher", "Matrix"]
  },
  {
    name: "Networking",
    icon: "🌐",
    subcategories: ["Patch Cord", "Cat6 Cable"]
  }
];
