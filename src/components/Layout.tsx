import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Painel", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/inbox", label: "Inbox" },
  { to: "/reunioes", label: "Reuniões" },
];

export function Layout() {
  const { signOut, session } = useAuth();
  const nav = useNavigate();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          borderRight: "1px solid var(--line)",
          background: "var(--bg-2)",
          padding: "1.6rem 1.2rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ fontFamily: "var(--sans)", fontWeight: 600, letterSpacing: "0.5em", fontSize: 15, color: "var(--platinum)", marginBottom: "0.4rem" }}>
          VERTEX
        </div>
        <div className="label" style={{ marginBottom: "2.4rem" }}>Estúdio</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              style={({ isActive }) => ({
                padding: "0.7rem 0.9rem",
                borderRadius: "var(--radius)",
                fontSize: 13,
                letterSpacing: "0.03em",
                color: isActive ? "var(--platinum)" : "var(--muted)",
                background: isActive ? "var(--surface)" : "transparent",
                borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
          <div className="muted" style={{ fontSize: 11, marginBottom: "0.7rem", wordBreak: "break-all" }}>
            {session?.user.email}
          </div>
          <button
            className="btn btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={async () => { await signOut(); nav("/login"); }}
          >
            Sair
          </button>
        </div>
      </aside>

      <main style={{ padding: "2.4rem 2.6rem", maxWidth: 1400, width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}
