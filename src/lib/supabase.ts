import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kmgnjlcmswbbsntwdvef.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9DJQOz3zsSm4s-WRkv31IA_Gu55pVCQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  empresa: string | null;
  origem: string;
  classificacao: "frio" | "morno" | "quente" | string;
  etapa_pipeline: string;
  score: number;
  anotacoes: string | null;
  criado_em: string;
};

export type Etapa = {
  id: string;
  nome: string;
  posicao: number;
  probabilidade: number;
  ganhou: boolean;
  perdeu: boolean;
  cor: string | null;
};

export type Mensagem = {
  id: string;
  conversation_id: string;
  lead_id: string | null;
  direcao: "entrada" | "saida";
  texto: string;
  telefone: string | null;
  criado_em: string;
};

export type Reuniao = {
  id: string;
  lead_id: string;
  titulo: string;
  tipo: "descoberta" | "alinhamento" | "fechamento";
  agendada_para: string | null;
  duracao_min: number;
  status: string;
  canal: string | null;
  notas: string | null;
  criado_em: string;
};
