import { Link } from "react-router-dom";
import { Instagram, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { mockStoreInfo } from "@/data/mockStoreInfo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>LCG Shop</p>
            <p className={styles.tagline}>{mockStoreInfo.tagline}</p>
          </div>
          <div>
            <p className={styles.heading}>Shop</p>
            <ul className={styles.links}>
              <li>
                <Link to="/products">All products</Link>
              </li>
              <li>
                <Link to="/products?category=supplements">Supplements</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className={styles.heading}>Visit us</p>
            <p className={styles.text}>
              <MapPin size={16} className={styles.inlineIcon} />
              {mockStoreInfo.address}
            </p>
            <a
              href={mockStoreInfo.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.instagram}
            >
              <Instagram size={16} />
              {mockStoreInfo.instagram}
            </a>
          </div>
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} LCG Shop — Marousi / OAKA area
        </p>
      </Container>
    </footer>
  );
}
