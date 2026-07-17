import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Store,
} from "lucide-react";
import { AdminGuard } from "./AdminGuard";
import styles from "./AdminLayout.module.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminLayout() {
  return (
    <AdminGuard>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <Store size={20} />
            <div>
              <p className={styles.brandTitle}>LCG Admin</p>
              <p className={styles.brandSub}>Store management</p>
            </div>
          </div>
          <nav className={styles.nav} aria-label="Admin">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/" className={styles.storeLink}>
            ← Back to store
          </NavLink>
        </aside>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </AdminGuard>
  );
}
