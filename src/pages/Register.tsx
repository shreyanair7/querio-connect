import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = t("invalidEmail");
    if (!password) newErrors.password = t("passwordRequired");
    if (password !== confirmPassword) newErrors.confirmPassword = t("passwordMismatch");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">Querio</Link>
        </div>
        <div className="bg-card rounded-lg border border-border p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">{t("createAccount")}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("emailLabel")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@university.edu"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("passwordLabel")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("confirmPasswordLabel")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("registerBtn")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">{t("loginBtn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
