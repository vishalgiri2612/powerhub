import "./globals.css";
import { CartProvider } from "./context/CartContext";
import PWARegister from "../components/PWARegister";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "RAVTRON — Premium GaN Fast Charging & Accessories",
  description: "State-of-the-art Gallium Nitride engineering packed into a premium minimalist sand aesthetic.",
  manifest: "/manifest.json?v=2",
  appleWebApp: {
    capable: true,
    title: "RAVTRON",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/logo-apple.png",
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth light-mode ${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body>
        <CartProvider>
          <PWARegister />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}