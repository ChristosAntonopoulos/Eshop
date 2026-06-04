import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { mockStoreInfo } from "@/data/mockStoreInfo";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <Container>
      <h1 className="page-title">About LCG Shop</h1>
      <p className="page-subtitle">{mockStoreInfo.tagline}</p>

      <div className={styles.content}>
        <Card>
          <p>
            LCG Shop is a fitness and sports nutrition store serving athletes,
            swimmers and gym-goers in the Marousi area — minutes from the
            Olympic Athletic Center of Athens (OAKA).
          </p>
          <p>
            Inspired by the energy of @lcgshop_oaka, we stock trusted
            supplements, protein snacks, hydration products, swimming gear and
            training accessories — with advice from people who train like you
            do.
          </p>
        </Card>

        <Card>
          <h2>What we offer</h2>
          <ul>
            <li>Whey protein, creatine, BCAAs and pre-workout</li>
            <li>Protein bars, cookies and on-the-go snacks</li>
            <li>Electrolytes and isotonic drinks</li>
            <li>Swimming goggles, caps and pool essentials</li>
            <li>Shakers, bottles, bags and training accessories</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}
