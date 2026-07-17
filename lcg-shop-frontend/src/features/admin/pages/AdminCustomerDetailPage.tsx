import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { adminCustomerRepository } from "@/services/admin";
import type { AuthUser } from "@/features/auth/types/auth.types";
import styles from "../admin.module.css";

export function AdminCustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      try {
        const result = await adminCustomerRepository.getUser(id);
        if (cancelled) return;
        if (!result) {
          setError("Customer not found.");
        } else {
          setCustomer(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load customer.",
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

  if (loading) return <Spinner />;

  if (!customer) {
    return (
      <div>
        <p className={styles.error}>{error ?? "Customer not found."}</p>
        <Link to="/admin/customers">← Back to customers</Link>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>
            {customer.firstName} {customer.lastName}
          </h1>
          <p>
            <Link to="/admin/customers">← Back to customers</Link>
          </p>
        </div>
        {customer.role === "ADMIN" ? (
          <Badge variant="sale">ADMIN</Badge>
        ) : (
          <Badge variant="category">CUSTOMER</Badge>
        )}
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <h2>Profile</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{customer.email}</dd>
            </div>
            {customer.phone && (
              <div>
                <dt>Phone</dt>
                <dd>{customer.phone}</dd>
              </div>
            )}
            <div>
              <dt>Member since</dt>
              <dd>
                {new Date(customer.createdAt).toLocaleDateString("en-GB")}
              </dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{customer.id}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.detailCard}>
          <h2>Default address</h2>
          {customer.defaultAddress ? (
            <address style={{ fontStyle: "normal", lineHeight: 1.6 }}>
              {customer.defaultAddress.street}
              <br />
              {customer.defaultAddress.postalCode} {customer.defaultAddress.city}
              <br />
              {customer.defaultAddress.country}
            </address>
          ) : (
            <p className={styles.muted}>No default address on file.</p>
          )}
        </div>
      </div>
    </div>
  );
}
