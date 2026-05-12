import "./globals.css";

import type { Metadata } from "next";

import {
  CartProvider,
} from "@/src/context/CartContext";

export const metadata: Metadata = {
  title: "Fusion Bites",
  description: "Food Delivery Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body>

        <CartProvider>

          {children}

        </CartProvider>

      </body>

    </html>
  );
}