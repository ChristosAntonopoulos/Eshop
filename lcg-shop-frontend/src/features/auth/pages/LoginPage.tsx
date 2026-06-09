import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEMO_CREDENTIALS_HINT } from "@/data/mockUsers";
import { useAuth } from "@/features/auth/AuthContext";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./AuthPages.module.css";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("maria@example.com");
    setPassword("password123");
    setError("");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to save your details for faster checkout — or continue as a guest when you order."
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className={styles.alert} role="alert">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <Button type="submit" variant="accent" size="lg" fullWidth isLoading={loading}>
          Sign in
        </Button>

        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>Demo accounts (mock data)</p>
          <p className={styles.demoHint}>{DEMO_CREDENTIALS_HINT}</p>
          <button type="button" className={styles.demoBtn} onClick={fillDemo}>
            Use Maria&apos;s demo account
          </button>
        </div>

        <p className={styles.guestNote}>
          Prefer not to sign in?{" "}
          <Link to="/products">Shop as guest</Link> — checkout works without an account.
        </p>
      </form>
    </AuthLayout>
  );
}
