import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/features/cart/CartContext";
import { MobileAuthLinks, UserMenu } from "@/features/auth/components/UserMenu";
import { MobileNav } from "../MobileNav";
import styles from "./Header.module.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/products?category=supplements", label: "Supplements" },
  { to: "/products?category=hydration", label: "Hydration" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>LCG</span> Shop
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <UserMenu />
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={20} />
            </button>
            <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className={styles.badge}>{itemCount}</span>
              )}
            </Link>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search supplements, snacks, gear…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
            <button type="submit" className={styles.searchSubmit}>
              Search
            </button>
          </form>
        )}
      </Container>

      <MobileNav
        open={mobileOpen}
        links={navLinks}
        onClose={() => setMobileOpen(false)}
        footer={<MobileAuthLinks onClose={() => setMobileOpen(false)} />}
      />
    </header>
  );
}
