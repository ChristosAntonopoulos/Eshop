import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { orderRepository } from "@/services/orders";
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
} from "@/features/orders/types/order.types";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "../admin.module.css";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError(null);
    try {
      const list = await orderRepository.list({
        status: (nextStatus || undefined) as OrderStatus | undefined,
      });
      setOrders(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Orders</h1>
          <p>Review checkout orders and update fulfillment status.</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            void load(e.target.value);
          }}
          options={[
            { value: "", label: "All statuses" },
            ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>
                    {order.customer.firstName} {order.customer.lastName}
                    <div className={styles.muted}>{order.customer.email}</div>
                  </td>
                  <td>{order.status}</td>
                  <td>{order.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleString("en-GB")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.muted}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
