import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <Container>
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-subtitle">
          The page you are looking for does not exist or was moved.
        </p>
        <Link to="/">
          <Button variant="accent">Back to home</Button>
        </Link>
      </div>
    </Container>
  );
}
