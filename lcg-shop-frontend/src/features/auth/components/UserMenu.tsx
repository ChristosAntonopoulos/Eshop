import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import styles from "./UserMenu.module.css";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UserMenu() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.guestActions}>
        <Link to="/login" className={styles.loginLink}>
          Sign in
        </Link>
        <Link to="/register" className={styles.registerBtn}>
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.menuWrap} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <span className={styles.avatar}>
          {getInitials(user.firstName, user.lastName)}
        </span>
        <span className={styles.name}>
          {user.firstName}
          {isAdmin && <span className={styles.adminBadge}>Admin</span>}
        </span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <p className={styles.dropdownName}>
              {user.firstName} {user.lastName}
            </p>
            <p className={styles.dropdownEmail}>{user.email}</p>
          </div>
          <Link
            to="/account"
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User size={16} />
            My account
          </Link>
          <Link
            to="/account"
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} />
            Profile settings
          </Link>
          <button
            type="button"
            className={`${styles.dropdownItem} ${styles.logoutItem}`}
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileAuthLinks({ onClose }: { onClose: () => void }) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.mobileAuth}>
        <Link to="/login" className={styles.mobileAuthLink} onClick={onClose}>
          Sign in
        </Link>
        <Link to="/register" className={styles.mobileAuthCta} onClick={onClose}>
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.mobileAuth}>
      <p className={styles.mobileUser}>
        Signed in as <strong>{user.firstName}</strong>
      </p>
      <Link to="/account" className={styles.mobileAuthLink} onClick={onClose}>
        My account
      </Link>
      <Button variant="outline" size="sm" fullWidth onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
