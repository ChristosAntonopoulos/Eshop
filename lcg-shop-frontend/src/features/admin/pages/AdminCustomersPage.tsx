import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { adminCustomerRepository } from "@/services/admin";
import type { AuthUser } from "@/features/auth/types/auth.types";
import styles from "../admin.module.css";

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = await adminCustomerRepository.listUsers();
        if (!cancelled) setCustomers(list);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load customers.",
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

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Customers</h1>
          <p>Registered accounts (customers and admins).</p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <Link to={`/admin/customers/${customer.id}`}>
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </td>
                  <td>{customer.email}</td>
                  <td>
                    {customer.role === "ADMIN" ? (
                      <Badge variant="sale">ADMIN</Badge>
                    ) : (
                      <Badge variant="category">CUSTOMER</Badge>
                    )}
                  </td>
                  <td>
                    {new Date(customer.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.muted}>
                    No customers found.
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
