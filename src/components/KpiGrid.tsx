import { fmt, Transaction } from "@/lib/types";

interface Props { transactions: Transaction[] }

export default function KpiGrid({ transactions }: Props) {
  const ing  = transactions.filter(t => t.type === "ingreso").reduce((s, t) => s + Number(t.amount), 0);
  const egr  = transactions.filter(t => t.type === "egreso" ).reduce((s, t) => s + Number(t.amount), 0);
  const saldo = ing - egr;
  const pct = Math.min(100, Math.round((saldo / 10000) * 100));

  const cards = [
    { label: "Saldo disponible", value: fmt(saldo), delta: "+12.4% vs mes ant.", dir: "up",   color: "var(--accent)", bar: "var(--accent)" },
    { label: "Ingresos",          value: fmt(ing),   delta: "+8.2% vs mes ant.",  dir: "up",   color: "var(--green)",  bar: "var(--green)"  },
    { label: "Egresos",           value: fmt(egr),   delta: "-3.1% vs mes ant.",  dir: "down", color: "var(--red)",    bar: "var(--red)"    },
    { label: "Meta de ahorro",    value: pct + "%",  delta: fmt(saldo) + " / $10 K", dir: "up", color: "var(--amber)", bar: "var(--amber)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "18px 20px", boxShadow: "var(--shadow)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--muted)", marginBottom: 8 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1, color: c.color }}>
            {c.value}
          </div>
          <div style={{ fontSize: 11, marginTop: 6, display: "flex", alignItems: "center", gap: 4, color: c.dir === "up" ? "var(--green)" : "var(--red)" }}>
            {c.dir === "up" ? "▲" : "▼"} {c.delta}
          </div>
          <div style={{ height: 3, borderRadius: 2, marginTop: 14, background: c.bar, opacity: .35 }} />
        </div>
      ))}
    </div>
  );
}
