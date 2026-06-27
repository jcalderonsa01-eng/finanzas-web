"use client";

import { GridIcon, ListIcon, CardIcon, ClockIcon, PiggyIcon } from "./Icons";

interface Props {
  view: string;
  onViewChange: (v: string) => void;
}

export default function Sidebar({ view, onViewChange }: Props) {
  const item = (label: string, v: string, Icon: React.FC) => (
    <button
      onClick={() => onViewChange(v)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 20px", cursor: "pointer",
        color: view === v ? "var(--accent)" : "var(--muted)",
        background: view === v ? "var(--accent-lo)" : "none",
        fontWeight: view === v ? 600 : 500,
        border: "none", width: "100%", textAlign: "left",
        fontSize: 13, transition: "background .15s, color .15s",
      }}
      onMouseEnter={e => { if (view !== v) { (e.currentTarget as HTMLElement).style.background = "var(--accent-lo)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; } }}
      onMouseLeave={e => { if (view !== v) { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; } }}
    >
      <Icon />
      {label}
    </button>
  );

  return (
    <nav style={{
      width: 220, flexShrink: 0,
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", padding: "20px 0",
      position: "sticky", top: 0, height: "100vh", overflowY: "auto",
    }}>
      <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent)" }}>
          HyperFinanzas
        </div>
        <div style={{ fontWeight: 400, color: "var(--muted)", fontSize: 12, marginTop: 2 }}>
          Finanzas personales
        </div>
      </div>

      <SectionLabel>General</SectionLabel>
      {item("Resumen", "dashboard", GridIcon)}
      {item("Transacciones", "transactions", ListIcon)}

      <SectionLabel>Cuentas</SectionLabel>
      {item("Débito", "debit", CardIcon)}
      {item("Crédito", "credit", ClockIcon)}
      {item("Ahorro", "savings", PiggyIcon)}
    </nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: "16px 12px 4px", fontSize: 10, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)",
    }}>
      {children}
    </div>
  );
}
