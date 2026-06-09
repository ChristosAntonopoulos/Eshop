import { Link } from "react-router-dom";
import {
  ArrowRight,
  Dumbbell,
  MapPin,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { useAuth } from "@/features/auth/AuthContext";
import { mockStoreInfo } from "@/data/mockStoreInfo";
import { mockCategories } from "@/data/mockCategories";
import styles from "./HomePage.module.css";

const stats = [
  { value: "120+", label: "Products" },
  { value: "6", label: "Categories" },
  { value: "OAKA", label: "Near you" },
  { value: "Guest", label: "Checkout OK" },
];

const steps = [
  {
    icon: ShoppingBag,
    title: "Browse & add to cart",
    text: "Explore supplements, snacks and gear — no account needed.",
  },
  {
    icon: User,
    title: "Guest or member checkout",
    text: "Order instantly as a guest, or sign in to save your details.",
  },
  {
    icon: Truck,
    title: "Pick up or deliver",
    text: "Collect in Marousi near OAKA or arrange delivery.",
  },
];

const testimonials = [
  {
    quote:
      "Great selection for post-swim recovery. Electrolytes and protein always in stock.",
    name: "Elena K.",
    role: "Swimmer, OAKA",
  },
  {
    quote:
      "Friendly staff who actually know supplements. Perfect stop before evening training.",
    name: "George M.",
    role: "Gym regular",
  },
  {
    quote:
      "Ordered online as a guest — super easy. Signed up after for faster checkout.",
    name: "Sofia P.",
    role: "Customer",
  },
];

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <Container>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>
                <Sparkles size={14} />
                LCG Shop · Marousi / OAKA
              </p>
              <h1 className={styles.heroTitle}>
                Fuel every
                <span className={styles.heroAccent}> session</span>
              </h1>
              <p className={styles.heroText}>
                Premium supplements, protein snacks, hydration and training gear
                — curated for athletes training at the Olympic Athletic Center.
              </p>
              <div className={styles.heroCta}>
                <Link to="/products">
                  <Button variant="accent" size="lg">
                    Shop now <ArrowRight size={18} />
                  </Button>
                </Link>
                {!isAuthenticated ? (
                  <Link to="/register">
                    <Button variant="outline" size="lg" className={styles.heroOutline}>
                      Create free account
                    </Button>
                  </Link>
                ) : (
                  <Link to="/account">
                    <Button variant="outline" size="lg" className={styles.heroOutline}>
                      Hi, {user?.firstName} — My account
                    </Button>
                  </Link>
                )}
              </div>
              <p className={styles.heroGuest}>
                <Zap size={14} />
                Guest checkout available — buy without signing in
              </p>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroCard}>
                <img
                  src="https://picsum.photos/seed/lcg-hero-main/520/640"
                  alt=""
                  className={styles.heroImg}
                />
                <div className={styles.heroCardBadge}>
                  <Star size={14} fill="currentColor" />
                  Trusted near OAKA
                </div>
              </div>
              <div className={styles.heroFloat}>
                <Dumbbell size={20} />
                <div>
                  <strong>Performance</strong>
                  <span>Curated for athletes</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className={styles.stats}>
        <Container>
          <ul className={styles.statsList}>
            {stats.map((s) => (
              <li key={s.label}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <section className={styles.howItWorks}>
          <SectionHeader
            title="How it works"
            subtitle="Shop in minutes — account optional"
          />
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepNum}>{i + 1}</span>
                <step.icon size={24} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

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
              <div className={styles.categoryOverlay} />
              <div className={styles.categoryBody}>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <span className={styles.categoryLink}>
                  Explore <ArrowRight size={14} />
                </span>
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

        <section className={styles.testimonials}>
          <SectionHeader
            title="What athletes say"
            subtitle="From swimmers, gym-goers and weekend warriors"
          />
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <blockquote key={t.name} className={styles.testimonial}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
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
          <p>
            Stock up on protein, electrolytes and training essentials — guest
            checkout or sign in for faster orders.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/products">
              <Button variant="accent" size="lg">
                Browse all products
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Join free
                </Button>
              </Link>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
