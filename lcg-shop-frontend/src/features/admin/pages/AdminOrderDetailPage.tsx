import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
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

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const result = await orderRepository.getById(id);
        if (cancelled) return;
        if (!result) {
          setError("Order not found.");
        } else {
          setOrder(result);
          setStatus(result.status);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load order.",
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
  }, [id]);

  const handleSaveStatus = async () => {
    if (!id || !order) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await orderRepository.updateStatus(id, status);
      setOrder(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  if (!order) {
    return (
      <div>
        <p className={styles.error}>{error ?? "Order not found."}</p>
        <Link to="/admin/orders">← Back to orders</Link>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Order {order.id}</h1>
          <p>
            <Link to="/admin/orders">← Back to orders</Link>
          </p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.statusBar}>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Button
          variant="accent"
          isLoading={saving}
          onClick={() => void handleSaveStatus()}
          disabled={status === order.status}
        >
          Update status
        </Button>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <h2>Customer</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>
                {order.customer.firstName} {order.customer.lastName}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{order.customer.phone}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.detailCard}>
          <h2>Shipping</h2>
          <dl>
            <div>
              <dt>Address</dt>
              <dd>{order.shippingAddress.address}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </dd>
            </div>
            <div>
              <dt>Placed</dt>
              <dd>{new Date(order.createdAt).toLocaleString("en-GB")}</dd>
            </div>
            {order.notes && (
              <div>
                <dt>Notes</dt>
                <dd>{order.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Line items</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={`${item.productId}-${item.productName}`}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.muted} style={{ marginTop: "1rem" }}>
          Subtotal {formatCurrency(order.subtotal)} · Shipping{" "}
          {formatCurrency(order.shipping)} ·{" "}
          <strong>Total {formatCurrency(order.total)}</strong>
        </p>
      </section>
    </div>
  );
}
