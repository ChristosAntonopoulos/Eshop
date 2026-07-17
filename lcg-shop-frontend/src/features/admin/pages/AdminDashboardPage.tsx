import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { productRepository } from "@/services/products";
import { orderRepository } from "@/services/orders";
import { adminCustomerRepository } from "@/services/admin";
import type { Product } from "@/features/products/types/product.types";
import type { Order } from "@/features/orders/types/order.types";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "../admin.module.css";

const LOW_STOCK_THRESHOLD = 5;

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [products, orders, customers] = await Promise.all([
          productRepository.getProducts({ includeInactive: true }),
          orderRepository.list(),
          adminCustomerRepository.listUsers(),
        ]);

        if (cancelled) return;

        setProductCount(products.length);
        setOrderCount(orders.length);
        setCustomerCount(customers.length);
        setRevenue(
          orders
            .filter((o) => o.status !== "CANCELLED")
            .reduce((sum, o) => sum + o.total, 0),
        );
        setRecentOrders(orders.slice(0, 5));
        setLowStock(
          products
            .filter((p) => p.stockQuantity <= LOW_STOCK_THRESHOLD)
            .sort((a, b) => a.stockQuantity - b.stockQuantity)
            .slice(0, 8),
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.pageHeader}>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Overview of catalog, orders, and inventory.</p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Products</p>
          <p className={styles.statValue}>{productCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Orders</p>
          <p className={styles.statValue}>{orderCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Customers</p>
          <p className={styles.statValue}>{customerCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Revenue</p>
          <p className={styles.statValue}>{formatCurrency(revenue)}</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Recent orders</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td>{order.status}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.muted}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Low stock (≤ {LOW_STOCK_THRESHOLD})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lowStock.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className={styles.lowStock}>{product.stockQuantity}</td>
                  <td>
                    <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </td>
                </tr>
              ))}
              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={3} className={styles.muted}>
                    No low-stock products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
