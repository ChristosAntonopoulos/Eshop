import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/features/home/HomePage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { CartPage } from "@/features/cart/CartPage";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { AccountPage } from "@/features/auth/pages/AccountPage";
import { AboutPage } from "@/features/about/AboutPage";
import { ContactPage } from "@/features/contact/ContactPage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { AdminProductFormPage } from "@/features/admin/pages/AdminProductFormPage";
import { AdminCategoriesPage } from "@/features/admin/pages/AdminCategoriesPage";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { AdminOrderDetailPage } from "@/features/admin/pages/AdminOrderDetailPage";
import { AdminCustomersPage } from "@/features/admin/pages/AdminCustomersPage";
import { AdminCustomerDetailPage } from "@/features/admin/pages/AdminCustomerDetailPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
