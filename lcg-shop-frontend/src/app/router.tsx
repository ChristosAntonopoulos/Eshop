import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/features/home/HomePage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { CartPage } from "@/features/cart/CartPage";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { AboutPage } from "@/features/about/AboutPage";
import { ContactPage } from "@/features/contact/ContactPage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
