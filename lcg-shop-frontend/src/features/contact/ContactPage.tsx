import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { mockStoreInfo } from "@/data/mockStoreInfo";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import styles from "./ContactPage.module.css";

export function ContactPage() {
  return (
    <Container>
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">Visit us near OAKA or send a message</p>

      <div className={styles.grid}>
        <Card className={styles.info}>
          <ul className={styles.list}>
            <li>
              <MapPin size={18} />
              <span>{mockStoreInfo.address}</span>
            </li>
            <li>
              <Phone size={18} />
              <a href={`tel:${mockStoreInfo.phone}`}>{mockStoreInfo.phone}</a>
            </li>
            <li>
              <Mail size={18} />
              <a href={`mailto:${mockStoreInfo.email}`}>{mockStoreInfo.email}</a>
            </li>
            <li>
              <Instagram size={18} />
              <a href={mockStoreInfo.instagramUrl} target="_blank" rel="noreferrer">
                {mockStoreInfo.instagram}
              </a>
            </li>
          </ul>
          <h2>Hours</h2>
          <ul className={styles.hours}>
            {mockStoreInfo.openingHours.map((row) => (
              <li key={row.day}>
                <span>{row.day}</span>
                <span>{row.hours}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent (demo)");
            }}
          >
            <h2>Send a message</h2>
            <Input label="Name" name="name" required />
            <Input label="Email" type="email" name="email" required />
            <Input label="Message" name="message" required />
            <Button type="submit" variant="accent">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
