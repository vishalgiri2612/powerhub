import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "Ravtron — Premium GaN Fast Charging & Accessories",
  description: "State-of-the-art Gallium Nitride engineering packed into a premium minimalist sand aesthetic.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}