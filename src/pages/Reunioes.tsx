import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type Reuniao } from "../lib/supabase";

type ReuniaoComLead = Reuniao & { leads: { nome: string; empresa: string | null } | null };

export function Reunioes() {
  const [reunioes, setReunioes] = useState<ReuniaoComLead[] | null>(null);

  useEffect(() => {
    supabase
      .from("reunioes")
      .select("*, leads(nome, empresa)")
      .order("criado_em", { ascending: false })
      .then(({ data }) => setReunioes((data as ReuniaoComLead[]) ?? []));
  }, []);

  if (!reunioes) return <div className="row" style={{ height: 300, justifyContent: "center" }}><div className="spin" /></div>;

  const tipos: Record<string, string> = { descoberta: "Descoberta", alinhamento: "Alinhamento", fechamento: "Fechamento" };

  return (
    <div>
      <div className="label">Agenda</div>
      <h1 className="serif" style={{ fontWeight: 400, fontSize: 32, margin: "0.4rem 0 2rem", color: "var(--platinum)" }}>
        Reuniões
      </h1>

      <div className="card">
        {reunioes.map((r, i) => (
          <Link
            key={r.id}
            to={`/leads/${r.lead_id}`}
            className="row gap-2"
            style={{ padding: "1.1rem 1.3rem", borderTop: i ? "1px solid var(--line)" : "none", justifyContent: "space-between" }}
          >
            <div className="col" style={{ gap: 3 }}>
              <div style={{ color: "var(--platinum)", fontSize: 13 }}>{r.leads?.nome ?? "—"}</div>
              <div className="muted" style={{ fontSize: 12 }}>{r.titulo}{r.leads?.empresa ? ` · ${r.leads.empresa}` : ""}</div>
            </div>
            <div className="row gap-1">
              <span className="chip" style={{ color: "var(--gold)", borderColor: "var(--gold-dim)" }}>{tipos[r.tipo] ?? r.tipo}</span>
              <span className="chip">{r.status}</span>
            </div>
          </Link>
        ))}
        {reunioes.length === 0 && <div className="muted" style={{ padding: "2rem", textAlign: "center" }}>Nenhuma reunião ainda. Agende a partir da ficha de um lead.</div>}
      </div>
    </div>
  );
}
