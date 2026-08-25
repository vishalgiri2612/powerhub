export const products = [
  {
    id: "p1",
    name: "RAVTRON 65W GaN Wall Charger",
    shortSpec: "2x USB-C · 1x USB-A · 65W · GaN Fast Charge",
    price: 2499,
    originalPrice: 3499,
    discountBadge: "-28%",
    rating: 4.9,
    reviewsCount: 182,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Accessories",
    subcategory: "Power Adapter",
    featured: true,
    isNewArrival: false,
    color: "Sage Green",
    stock: 8,
    description: "Equipped with advanced Gallium Nitride (GaN) technology, this ultra-compact wall adapter delivers efficient power for up to three devices simultaneously. Smart power allocation ensures optimal wattage for your laptop, smartphone, and tablet while protecting against overheating and overvoltage."
  },
  {
    id: "p2",
    name: "RAVTRON 11-in-1 Type-C Multiport Docking Station",
    shortSpec: "11 Ports · 100W PD · 4K Dual HDMI · Gigabit LAN",
    price: 3999,
    originalPrice: 4999,
    discountBadge: "Bestseller",
    rating: 4.9,
    reviewsCount: 340,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Docking Stations",
    subcategory: "TYPE C",
    featured: true,
    isNewArrival: false,
    color: "Anodized Grey",
    stock: 25,
    description: "Engineered for maximum workstation productivity. This premium solid aluminum 11-in-1 Type-C docking station features dual 4K HDMI displays, 100W Power Delivery pass-through, Gigabit Ethernet, SD/MicroSD card readers, and high-speed USB 3.0 ports.",
    topSelling: true
  },
  {
    id: "p3",
    name: "RAVTRON Braided 100W Wattage Cable",
    shortSpec: "1.8m · 100W PD · Digital Live Wattage Display",
    price: 899,
    originalPrice: 1299,
    discountBadge: "-30%",
    rating: 4.8,
    reviewsCount: 95,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Cables",
    subcategory: "Power Cords",
    sizes: ["1.8 Mtr", "3.0 Mtr", "5 Mtr"],
    featured: true,
    isNewArrival: true,
    color: "Cream Cord",
    stock: 45,
    description: "Engineered for durability and high-speed energy transfer. This heavy-duty nylon braided cable features an integrated digital live-wattage display that displays exact charging rates in real time. Supports Power Delivery up to 100W for quick-charging laptops and mobile devices."
  },
  {
    id: "p4",
    name: "RAVTRON Ultra HD 4K Ringlight Webcam",
    shortSpec: "4K UHD · Built-in LED Ring · Glass Lens",
    price: 5499,
    originalPrice: 7999,
    discountBadge: "New",
    rating: 4.9,
    reviewsCount: 54,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Accessories",
    subcategory: "Webcam",
    featured: true,
    isNewArrival: true,
    color: "Clay Grey",
    stock: 12,
    description: "Elevate your professional workspace with stunning video clarity. This 4K ultra-high-definition webcam delivers crystal clear imagery, featuring an integrated LED ring light with adjustable touch-brightness controls to ensure optimal lighting in any environment."
  },
  {
    id: "p5",
    name: "RAVTRON Privacy Screen Filter for Laptops",
    shortSpec: "60° Viewing Angle · Anti-Glare · Blue Light Filter",
    price: 1999,
    originalPrice: 2999,
    discountBadge: "-33%",
    rating: 4.8,
    reviewsCount: 124,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Accessories",
    subcategory: "Privacy Filter",
    featured: false,
    isNewArrival: true,
    color: "Black Matte",
    stock: 25,
    description: "Protect your confidential work data on the go with RAVTRON Privacy Screen Filter. Engineered with microlouver technology to block side-angle viewing beyond 60 degrees, while shielding your eyes from glare and blue light radiation.",
    topSelling: true
  },
  {
    id: "p6",
    name: "RAVTRON High-Performance Cat6 Patch Cord Cable",
    shortSpec: "10Gbps Speed · Gold-Plated RJ45 · Snagless Molded Boot",
    price: 499,
    originalPrice: 899,
    discountBadge: "Best Value",
    rating: 4.9,
    reviewsCount: 88,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Networking",
    subcategory: "PATCH CORD",
    featured: false,
    isNewArrival: false,
    color: "Blue",
    stock: 50,
    description: "Engineered for high-density network connectivity. Features 100% pure copper conductors and gold-plated RJ45 connectors to deliver crystal-clear Gigabit and 10Gbps data transmission speeds with zero latency."
  },
  {
    id: "p7",
    name: "RAVTRON CCTV Power Supply (SMPS)",
    shortSpec: "Power Supply for CCTV Cameras · Input AC 150-240V · LED for Individual Channel",
    price: 900,
    originalPrice: 1530,
    discountBadge: "Save 41%",
    rating: 4.8,
    reviewsCount: 1,
    image: "/logo.png",
    gallery: [
      "/logo.png"
    ],
    category: "Surveillance",
    subcategory: "Power Supply",
    channels: ["4 Channel", "8 Channel", "16 Channel"],
    sizePrices: [
      { size: "4 Channel", price: 900, originalPrice: 1530 },
      { size: "8 Channel", price: 1500, originalPrice: 2200 },
      { size: "16 Channel", price: 2800, originalPrice: 3900 }
    ],
    featured: true,
    isNewArrival: true,
    color: "White",
    stock: 30,
    description: "POWER SUPPLY FOR CCTV CAMERAS POWER LED MONITOR FOR INDIVIDUAL CAMERA CHANNEL INDIVIDUAL CAMERA DRIVE. INPUT AC: 150-240V, 1A 50-60HZ. COLOUR: WHITE OUTPUT CURRENT: 1 AMPS OUTPUT VOLTAGE: 12 VOLTS SPECIAL FEATURE: LED FOR INDIVIDUAL CHANNEL"
  }
];

export const categories = [
  {
    name: "Cables",
    icon: "🔌",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["HDMI Cables", "VGA Cables", "Power Cords", "Cable Cum Converter"]
  },
  {
    name: "HDMI Cables",
    icon: "🔌",
    image: "/logo.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "VGA Cables",
    icon: "🔌",
    image: "/logo.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "Power Cords",
    icon: "🔌",
    image: "/logo.png",
    showOnHome: true,
    subcategories: []
  },
  {
    name: "Converters",
    icon: "⚡",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["HDMI", "VGA", "Display Port", "Mini DP", "Type C", "USB"]
  },
  {
    name: "Accessories",
    icon: "💼",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["Privacy Filter", "Webcam", "Power Adapter", "Aux Cables", "SSD Enclosure", "Wall Mount", "Laptop Stand"]
  },
  {
    name: "Surveillance",
    icon: "🛡️",
    image: "/logo.png",
    showOnHome: false,
    subcategories: ["CCTV Cables", "Power Supply", "PoE Switch", "BNC Connector", "DC Pin", "Video Balun"]
  },
  {
    name: "Docking Stations",
    icon: "💻",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["Dual Type C", "Type C"]
  },
  {
    name: "Audio Video",
    icon: "📺",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["HDMI Extender", "HDMI Splitter", "HDMI Switcher", "Matrix"]
  },
  {
    name: "Networking",
    icon: "🌐",
    image: "/logo.png",
    showOnHome: false,
    subcategories: ["PATCH CORD", "CAT6 CABLE"]
  },
  {
    name: "USB HUBS",
    icon: "🔌",
    image: "/logo.png",
    showOnHome: true,
    subcategories: ["TYPE C", "USB"]
  }
];
