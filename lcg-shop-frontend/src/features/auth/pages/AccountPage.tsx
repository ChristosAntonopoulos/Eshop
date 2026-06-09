import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Package,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./AccountPage.module.css";

export function AccountPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <div className={styles.signInPrompt}>
          <User size={40} className={styles.promptIcon} />
          <h1 className="page-title">Your account</h1>
          <p className="page-subtitle">
            Sign in to view your profile and speed up checkout. You can still shop
            and order as a guest without an account.
          </p>
          <div className={styles.promptActions}>
            <Link to="/login">
              <Button variant="accent" size="lg">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Create account
              </Button>
            </Link>
          </div>
          <Link to="/products" className={styles.guestLink}>
            Continue shopping as guest →
          </Link>
        </div>
      </Container>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">
            Hello, {user.firstName}
            {isAdmin && <span className={styles.roleBadge}>Admin</span>}
          </h1>
          <p className="page-subtitle">
            Manage your profile and enjoy faster checkout on your next order.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </Button>
      </div>

      <div className={styles.grid}>
        <Card className={styles.profileCard}>
          <h2>
            <User size={20} />
            Profile
          </h2>
          <dl className={styles.details}>
            <div>
              <dt>Name</dt>
              <dd>
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            {user.phone && (
              <div>
                <dt>Phone</dt>
                <dd>{user.phone}</dd>
              </div>
            )}
            <div>
              <dt>Member since</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString("en-GB")}</dd>
            </div>
          </dl>
        </Card>

        {user.defaultAddress ? (
          <Card className={styles.profileCard}>
            <h2>
              <MapPin size={20} />
              Default address
            </h2>
            <address className={styles.address}>
              {user.defaultAddress.street}
              <br />
              {user.defaultAddress.postalCode} {user.defaultAddress.city}
              <br />
              {user.defaultAddress.country}
            </address>
            <p className={styles.addressNote}>
              Used to pre-fill checkout. You can change it per order.
            </p>
          </Card>
        ) : (
          <Card className={styles.profileCard}>
            <h2>
              <MapPin size={20} />
              Delivery address
            </h2>
            <p className={styles.emptyAddress}>
              No saved address yet. Add one at checkout and we&apos;ll remember it
              for next time (when the backend is connected).
            </p>
          </Card>
        )}

        <Card className={styles.profileCard}>
          <h2>
            <Package size={20} />
            Orders
          </h2>
          <p className={styles.emptyAddress}>
            Order history will appear here once the backend is connected. For now,
            checkout works as a demo — guest or signed-in.
          </p>
          <Link to="/products">
            <Button variant="accent">Start shopping</Button>
          </Link>
        </Card>

        <Card className={`${styles.profileCard} ${styles.infoCard}`}>
          <h2>
            <Shield size={20} />
            Account & privacy
          </h2>
          <ul className={styles.infoList}>
            <li>Your session is stored locally (mock auth for development).</li>
            <li>Guest checkout remains available — no login required to buy.</li>
            <li>The backend developer will connect real JWT auth later.</li>
          </ul>
        </Card>
      </div>

      <div className={styles.quickActions}>
        <Link to="/products" className={styles.quickAction}>
          <ShoppingBag size={22} />
          <span>Browse products</span>
        </Link>
        <Link to="/cart" className={styles.quickAction}>
          <Package size={22} />
          <span>View cart</span>
        </Link>
      </div>
    </Container>
  );
}
