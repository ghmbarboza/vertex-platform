import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type Lead } from "../lib/supabase";

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .is("deleted_at", null)
      .order("criado_em", { ascending: false })
      .then(({ data }) => setLeads(data ?? []));
  }, []);

  if (!leads) return <div className="row" style={{ height: 300, justifyContent: "center" }}><div className="spin" /></div>;

  const hoje = new Date().toISOString().slice(0, 10);
  const novosHoje = leads.filter((l) => l.criado_em.slice(0, 10) === hoje).length;
  const quentes = leads.filter((l) => l.classificacao === "quente").length;
  const emJogo = leads.filter((l) => !["Ganhou", "Perdido"].includes(l.etapa_pipeline)).length;

  const stats = [
    { label: "Leads no total", value: leads.length },
    { label: "Novos hoje", value: novosHoje },
    { label: "Quentes", value: quentes, accent: "var(--red)" },
    { label: "Em jogo", value: emJogo },
  ];

  return (
    <div>
      <div className="label">Painel</div>
      <h1 className="serif" style={{ fontWeight: 400, fontSize: 34, margin: "0.4rem 0 2.4rem", color: "var(--platinum)" }}>
        Bom trabalho, estúdio.
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.6rem 1.4rem" }}>
            <div className="serif" style={{ fontSize: 42, color: s.accent ?? "var(--platinum)", lineHeight: 1 }}>{s.value}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: "0.5rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="row gap-2" style={{ justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <div className="label" style={{ color: "var(--muted)" }}>Últimos leads</div>
        <Link to="/leads" className="btn btn-sm">Ver pipeline</Link>
      </div>

      <div className="card">
        {leads.slice(0, 8).map((l, i) => (
          <Link
            key={l.id}
            to={`/leads/${l.id}`}
            className="row gap-2"
            style={{ padding: "1rem 1.2rem", borderTop: i ? "1px solid var(--line)" : "none", justifyContent: "space-between" }}
          >
            <div className="col" style={{ gap: 2 }}>
              <div style={{ color: "var(--platinum)" }}>{l.nome}</div>
              <div className="muted" style={{ fontSize: 12 }}>{l.empresa || l.telefone}</div>
            </div>
            <div className="row gap-1">
              <span className={`chip ${l.classificacao}`}>{l.classificacao}</span>
              <span className="chip">{l.etapa_pipeline}</span>
            </div>
          </Link>
        ))}
        {leads.length === 0 && <div className="muted" style={{ padding: "2rem", textAlign: "center" }}>Nenhum lead ainda. Assim que o formulário do site receber uma consulta, ela aparece aqui.</div>}
      </div>
    </div>
  );
}
