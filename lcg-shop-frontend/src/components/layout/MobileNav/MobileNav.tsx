import { NavLink } from "react-router-dom";
import styles from "./MobileNav.module.css";

interface NavLinkItem {
  to: string;
  label: string;
}

interface MobileNavProps {
  open: boolean;
  links: NavLinkItem[];
  onClose: () => void;
}

export function MobileNav({ open, links, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <nav className={styles.overlay} aria-label="Mobile">
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={onClose}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
