import "./globals.css";
import { CartProvider } from "./context/CartContext";
import PWARegister from "../components/PWARegister";

export const metadata = {
  title: "Ravtron — Premium GaN Fast Charging & Accessories",
  description: "State-of-the-art Gallium Nitride engineering packed into a premium minimalist sand aesthetic.",
  manifest: "/manifest.json?v=2",
  appleWebApp: {
    capable: true,
    title: "Ravtron",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/logo-apple.png",
  },
};

export const viewport = {
  themeColor: "#080C16",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body>
        <CartProvider>
          <PWARegister />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}