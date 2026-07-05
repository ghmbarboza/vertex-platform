import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function Login() {
  const { session, signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) setError("Credenciais inválidas.");
    setBusy(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ width: "min(30rem, 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontWeight: 600, letterSpacing: "0.55em", fontSize: 17, color: "var(--platinum)" }}>VERTEX</div>
          <div className="label" style={{ marginTop: "0.6rem" }}>Estúdio · acesso privado</div>
        </div>

        <form onSubmit={submit} className="col gap-2">
          <div className="col gap-1">
            <label className="label" style={{ color: "var(--muted)" }}>E-mail</label>
            <input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@vertexdevs.org" />
          </div>
          <div className="col gap-1">
            <label className="label" style={{ color: "var(--muted)" }}>Senha</label>
            <input className="field" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div style={{ color: "var(--red)", fontSize: 12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ justifyContent: "center", marginTop: "0.6rem" }} disabled={busy}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
