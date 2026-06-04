import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell, MapPin, Shield, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { mockStoreInfo } from "@/data/mockStoreInfo";
import { mockCategories } from "@/data/mockCategories";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>LCG Shop · Marousi / OAKA</p>
            <h1 className={styles.heroTitle}>Fuel Your Training</h1>
            <p className={styles.heroText}>
              Supplements, protein snacks, hydration and training gear — curated
              for athletes training near the Olympic Athletic Center.
            </p>
            <div className={styles.heroCta}>
              <Link to="/products">
                <Button variant="accent" size="lg">
                  Shop products <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Visit our store
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <SectionHeader
          title="Shop by category"
          subtitle="Everything you need for gym, pool and recovery"
        />
        <div className={styles.categories}>
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className={styles.categoryCard}
            >
              {cat.imageUrl && (
                <img src={cat.imageUrl} alt="" className={styles.categoryImg} />
              )}
              <div className={styles.categoryBody}>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <FeaturedProducts />

        <section className={styles.why}>
          <SectionHeader title="Why LCG Shop" />
          <ul className={styles.whyGrid}>
            <li>
              <Dumbbell size={28} />
              <h3>Performance focused</h3>
              <p>Products selected for serious training near OAKA.</p>
            </li>
            <li>
              <MapPin size={28} />
              <h3>Local & convenient</h3>
              <p>Pick up in Marousi — steps from your daily sessions.</p>
            </li>
            <li>
              <Truck size={28} />
              <h3>Fast advice</h3>
              <p>Staff who understand supplements and sports nutrition.</p>
            </li>
            <li>
              <Shield size={28} />
              <h3>Trusted brands</h3>
              <p>Quality protein, hydration and accessories in stock.</p>
            </li>
          </ul>
        </section>

        <section className={styles.instagram}>
          <SectionHeader
            title="Follow us on Instagram"
            subtitle={`@${mockStoreInfo.instagram.replace("@", "")} — training tips & new arrivals`}
          />
          <div className={styles.instaGrid}>
            {[1, 2, 3, 4].map((n) => (
              <a
                key={n}
                href={mockStoreInfo.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.instaTile}
              >
                <img
                  src={`https://picsum.photos/seed/lcg-insta-${n}/400/400`}
                  alt=""
                />
              </a>
            ))}
          </div>
        </section>

        <section className={styles.location}>
          <SectionHeader
            title="Find us near OAKA"
            subtitle={mockStoreInfo.address}
          />
          <div className={styles.locationGrid}>
            <div className={styles.hours}>
              <h3>Opening hours</h3>
              <ul>
                {mockStoreInfo.openingHours.map((row) => (
                  <li key={row.day}>
                    <span>{row.day}</span>
                    <span>{row.hours}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="primary">Contact & directions</Button>
              </Link>
            </div>
            <iframe
              title="Map near OAKA Marousi"
              src={mockStoreInfo.mapEmbedUrl}
              className={styles.map}
              loading="lazy"
            />
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Ready for your next session?</h2>
          <p>Stock up on protein, electrolytes and training essentials.</p>
          <Link to="/products">
            <Button variant="accent" size="lg">
              Browse all products
            </Button>
          </Link>
        </section>
      </Container>
    </>
  );
}
