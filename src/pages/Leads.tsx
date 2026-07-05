import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, type Lead, type Etapa } from "../lib/supabase";

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async () => {
    const [{ data: ls }, { data: es }] = await Promise.all([
      supabase.from("leads").select("*").is("deleted_at", null).order("criado_em", { ascending: false }),
      supabase.from("pipeline_etapas").select("*").order("posicao"),
    ]);
    setLeads(ls ?? []);
    setEtapas(es ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const mover = async (leadId: string, etapaNome: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, etapa_pipeline: etapaNome } : l)));
    await supabase.from("leads").update({ etapa_pipeline: etapaNome, atualizado_em: new Date().toISOString() }).eq("id", leadId);
  };

  if (loading) return <div className="row" style={{ height: 300, justifyContent: "center" }}><div className="spin" /></div>;

  return (
    <div>
      <div className="label">Pipeline</div>
      <h1 className="serif" style={{ fontWeight: 400, fontSize: 32, margin: "0.4rem 0 2rem", color: "var(--platinum)" }}>
        Leads em jogo
      </h1>

      <div style={{ display: "flex", gap: "0.9rem", overflowX: "auto", paddingBottom: "1rem" }}>
        {etapas.map((et) => {
          const col = leads.filter((l) => l.etapa_pipeline === et.nome);
          return (
            <div
              key={et.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) { mover(dragId, et.nome); setDragId(null); } }}
              style={{ minWidth: 244, width: 244, flexShrink: 0 }}
            >
              <div className="row gap-1" style={{ justifyContent: "space-between", marginBottom: "0.8rem", padding: "0 0.2rem" }}>
                <div className="row gap-1">
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: et.cor ?? "var(--muted)" }} />
                  <span style={{ fontSize: 12, letterSpacing: "0.06em", color: "var(--platinum)" }}>{et.nome}</span>
                </div>
                <span className="muted" style={{ fontSize: 12 }}>{col.length}</span>
              </div>

              <div className="col gap-1" style={{ minHeight: 120 }}>
                {col.map((l) => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onClick={() => nav(`/leads/${l.id}`)}
                    className="card"
                    style={{ padding: "0.9rem 1rem", cursor: "grab" }}
                  >
                    <div className="row gap-1" style={{ justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ color: "var(--platinum)", fontSize: 13 }}>{l.nome}</span>
                      <span className={`chip ${l.classificacao}`} style={{ fontSize: 9 }}>{l.classificacao}</span>
                    </div>
                    <div className="muted" style={{ fontSize: 11 }}>{l.empresa || l.telefone}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
