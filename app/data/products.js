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
    isNewArrival: false,
    color: "Sage Green",
    stock: 8,
    description: "Equipped with advanced Gallium Nitride (GaN) technology, this ultra-compact wall adapter delivers efficient power for up to three devices simultaneously. Smart power allocation ensures optimal wattage for your laptop, smartphone, and tablet while protecting against overheating and overvoltage."
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
    isNewArrival: false,
    color: "Sand Beige",
    stock: 25,
    description: "Power up on the move with confidence. This massive 20,000 mAh high-density portable charger supplies up to 65W power, capable of recharging laptops and phones at maximum speeds. The integrated real-time OLED screen keeps you updated on the precise remaining battery life.",
    topSelling: true
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
    sizes: ["1.8 Mtr", "3.0 Mtr", "5 Mtr"],
    featured: true,
    isNewArrival: true,
    color: "Cream Cord",
    stock: 45,
    description: "Engineered for durability and high-speed energy transfer. This heavy-duty nylon braided cable features an integrated digital live-wattage display that displays exact charging rates in real time. Supports Power Delivery up to 100W for quick-charging laptops and mobile devices."
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
    isNewArrival: true,
    color: "Clay Grey",
    stock: 12,
    description: "Elevate your professional workspace with stunning video clarity. This 4K ultra-high-definition webcam delivers crystal clear imagery, featuring an integrated LED ring light with adjustable touch-brightness controls to ensure optimal lighting in any environment."
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
    isNewArrival: true,
    color: "Sand & Gold",
    stock: 3,
    description: "Immerse yourself in rich, high-fidelity acoustics. These wireless earbuds feature premium active noise cancellation up to 40dB, crystal-clear microphones for calls, and a sleek sand-gold charging case providing up to 40 hours of combined, uninterrupted playtime.",
    topSelling: true
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
    isNewArrival: false,
    color: "Beechwood Sand",
    stock: 18,
    description: "A sophisticated multi-device charger for your modern nightstand or desk. Crafted from sustainable premium beechwood and solid aluminum, this stand magnetically mounts and charges your iPhone, Apple Watch, and AirPods simultaneously at maximum Qi wireless charging speeds."
  }
];

export const categories = [
  {
    name: "Cables",
    icon: "🔌",
    image: "/images/cable.png",
    showOnHome: true,
    subcategories: ["HDMI Cables", "VGA Cables", "Power Cords", "Cable Cum Converter"]
  },
  {
    name: "HDMI Cables",
    icon: "🔌",
    image: "/images/cable.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "VGA Cables",
    icon: "🔌",
    image: "/images/cable.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "Power Cords",
    icon: "🔌",
    image: "/images/charger.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "Converters",
    icon: "⚡",
    image: "/images/charger.png",
    showOnHome: true,
    subcategories: ["HDMI", "VGA", "Display Port", "Mini DP", "Type C", "USB"]
  },
  {
    name: "Accessories",
    icon: "💼",
    image: "/images/webcam.png",
    showOnHome: true,
    subcategories: ["Privacy Filter", "Webcam", "Power Adapter", "Aux Cables", "SSD Enclosure", "Wall Mount", "Laptop Stand"]
  },
  {
    name: "Surveillance",
    icon: "🛡️",
    image: "/images/ravtron_utility_dev.png",
    showOnHome: false,
    subcategories: ["CCTV Cables", "Power Supply", "PoE Switch", "BNC Connector", "DC Pin", "Video Balun"]
  },
  {
    name: "Docking Stations",
    icon: "💻",
    image: "/images/magsafe.png",
    showOnHome: true,
    subcategories: ["Dual Type C", "Type C", "USB Hubs"]
  },
  {
    name: "Audio Video",
    icon: "📺",
    image: "/images/hero.png",
    showOnHome: true,
    subcategories: ["HDMI Extender", "HDMI Splitter", "HDMI Switcher", "Matrix"]
  },
  {
    name: "Networking",
    icon: "🌐",
    image: "/images/ravtron_networking.png",
    showOnHome: false,
    subcategories: ["Patch Cord", "Cat6 Cable"]
  }
];
