import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type Mensagem } from "../lib/supabase";

type Conversa = {
  conversation_id: string;
  lead_id: string | null;
  ultima: string;
  quando: string;
  total: number;
};

export function Inbox() {
  const [conversas, setConversas] = useState<Conversa[] | null>(null);

  useEffect(() => {
    supabase
      .from("atendente_mensagens")
      .select("*")
      .order("criado_em", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        const msgs = (data ?? []) as Mensagem[];
        const map = new Map<string, Conversa>();
        for (const m of msgs) {
          if (!map.has(m.conversation_id)) {
            map.set(m.conversation_id, {
              conversation_id: m.conversation_id,
              lead_id: m.lead_id,
              ultima: m.texto,
              quando: m.criado_em,
              total: 1,
            });
          } else {
            map.get(m.conversation_id)!.total++;
          }
        }
        setConversas([...map.values()]);
      });
  }, []);

  if (!conversas) return <div className="row" style={{ height: 300, justifyContent: "center" }}><div className="spin" /></div>;

  return (
    <div>
      <div className="label">Inbox</div>
      <h1 className="serif" style={{ fontWeight: 400, fontSize: 32, margin: "0.4rem 0 2rem", color: "var(--platinum)" }}>
        Conversas
      </h1>

      <div className="card">
        {conversas.map((c, i) => (
          <Link
            key={c.conversation_id}
            to={c.lead_id ? `/leads/${c.lead_id}` : "#"}
            className="row gap-2"
            style={{ padding: "1.1rem 1.3rem", borderTop: i ? "1px solid var(--line)" : "none", justifyContent: "space-between" }}
          >
            <div className="col grow" style={{ gap: 3, minWidth: 0 }}>
              <div style={{ color: "var(--platinum)", fontSize: 13 }}>Conversa · {c.conversation_id.slice(-6)}</div>
              <div className="muted" style={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 520 }}>{c.ultima}</div>
            </div>
            <div className="col" style={{ alignItems: "flex-end", gap: 4 }}>
              <span className="muted" style={{ fontSize: 11 }}>{new Date(c.quando).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              <span className="chip">{c.total} msg</span>
            </div>
          </Link>
        ))}
        {conversas.length === 0 && <div className="muted" style={{ padding: "2rem", textAlign: "center" }}>Nenhuma conversa ainda.</div>}
      </div>
    </div>
  );
}
