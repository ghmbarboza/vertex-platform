import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase, type Lead, type Mensagem, type Etapa, type Reuniao } from "../lib/supabase";

export function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [msgs, setMsgs] = useState<Mensagem[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const [{ data: l }, { data: m }, { data: e }, { data: r }] = await Promise.all([
      supabase.from("leads").select("*").eq("id", id).single(),
      supabase.from("atendente_mensagens").select("*").eq("lead_id", id).order("criado_em"),
      supabase.from("pipeline_etapas").select("*").order("posicao"),
      supabase.from("reunioes").select("*").eq("lead_id", id).order("criado_em", { ascending: false }),
    ]);
    setLead(l);
    setMsgs(m ?? []);
    setEtapas(e ?? []);
    setReunioes(r ?? []);
    setNotas(l?.anotacoes ?? "");
  };
  useEffect(() => { load(); }, [id]);

  const salvarNotas = async () => {
    if (!lead) return;
    setSaving(true);
    await supabase.from("leads").update({ anotacoes: notas }).eq("id", lead.id);
    setSaving(false);
  };

  const mudarEtapa = async (nome: string) => {
    if (!lead) return;
    setLead({ ...lead, etapa_pipeline: nome });
    await supabase.from("leads").update({ etapa_pipeline: nome }).eq("id", lead.id);
  };

  const agendar = async (tipo: "descoberta" | "alinhamento" | "fechamento") => {
    if (!lead) return;
    const titulos = { descoberta: "Conversa de descoberta", alinhamento: "Reunião de alinhamento", fechamento: "Reunião de fechamento" };
    await supabase.from("reunioes").insert({ lead_id: lead.id, titulo: titulos[tipo], tipo, status: "proposta", canal: "video" });
    load();
  };

  if (!lead) return <div className="row" style={{ height: 300, justifyContent: "center" }}><div className="spin" /></div>;

  return (
    <div>
      <Link to="/leads" className="muted" style={{ fontSize: 12 }}>← Pipeline</Link>
      <div className="row gap-2" style={{ justifyContent: "space-between", margin: "0.8rem 0 2rem", alignItems: "flex-start" }}>
        <div>
          <h1 className="serif" style={{ fontWeight: 400, fontSize: 32, color: "var(--platinum)" }}>{lead.nome}</h1>
          <div className="muted" style={{ marginTop: 4 }}>{lead.empresa || "—"} · {lead.telefone}</div>
        </div>
        <div className="row gap-1">
          <span className={`chip ${lead.classificacao}`}>{lead.classificacao}</span>
          <span className="chip">Score {lead.score}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.5rem" }}>
        {/* coluna esquerda: conversa */}
        <div>
          <div className="label" style={{ color: "var(--muted)", marginBottom: "0.8rem" }}>Conversa (WhatsApp)</div>
          <div className="card" style={{ padding: "1.2rem", minHeight: 200, maxHeight: 460, overflowY: "auto" }}>
            {msgs.length === 0 && <div className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>Nenhuma mensagem ainda. Quando o lead escrever no WhatsApp, o atendente responde e o histórico aparece aqui.</div>}
            <div className="col gap-2">
              {msgs.map((m) => (
                <div key={m.id} style={{ alignSelf: m.direcao === "saida" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                  <div
                    style={{
                      background: m.direcao === "saida" ? "var(--sapphire-dim)" : "var(--surface-2)",
                      border: "1px solid var(--line)",
                      borderRadius: 8, padding: "0.6rem 0.8rem", fontSize: 13,
                    }}
                  >
                    {m.texto}
                  </div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 3, textAlign: m.direcao === "saida" ? "right" : "left" }}>
                    {m.direcao === "saida" ? "Atendente" : lead.nome.split(" ")[0]} · {new Date(m.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* coluna direita: ações */}
        <div className="col gap-3">
          <div>
            <div className="label" style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>Etapa</div>
            <select className="field" value={lead.etapa_pipeline} onChange={(e) => mudarEtapa(e.target.value)}>
              {etapas.map((et) => <option key={et.id} value={et.nome}>{et.nome}</option>)}
            </select>
          </div>

          <div>
            <div className="label" style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>Ficha</div>
            <div className="card" style={{ padding: "1rem", fontSize: 13, whiteSpace: "pre-wrap", color: "var(--muted)" }}>
              {lead.anotacoes || "—"}
            </div>
          </div>

          <div>
            <div className="label" style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>Reuniões</div>
            <div className="row gap-1" style={{ marginBottom: "0.8rem", flexWrap: "wrap" }}>
              <button className="btn btn-sm" onClick={() => agendar("descoberta")}>+ Descoberta</button>
              <button className="btn btn-sm" onClick={() => agendar("alinhamento")}>+ Alinhamento</button>
              <button className="btn btn-sm" onClick={() => agendar("fechamento")}>+ Fechamento</button>
            </div>
            <div className="col gap-1">
              {reunioes.map((r) => (
                <div key={r.id} className="card" style={{ padding: "0.7rem 0.9rem" }}>
                  <div className="row gap-1" style={{ justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13 }}>{r.titulo}</span>
                    <span className="chip">{r.status}</span>
                  </div>
                </div>
              ))}
              {reunioes.length === 0 && <div className="muted" style={{ fontSize: 12 }}>Nenhuma reunião agendada.</div>}
            </div>
          </div>

          <div>
            <div className="label" style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>Anotações</div>
            <textarea className="field" rows={4} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Notas internas…" />
            <button className="btn btn-sm btn-primary" style={{ marginTop: "0.6rem" }} onClick={salvarNotas} disabled={saving}>
              {saving ? "Salvando…" : "Salvar notas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
