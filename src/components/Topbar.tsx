"use client";

import { MoonIcon, SunIcon } from "./Icons";

interface Props {
  title: string;
  dark: boolean;
  onToggleDark: () => void;
  onBackup: () => void;
}

export default function Topbar({ title, dark, onToggleDark, onBackup }: Props) {
  return (
    <header style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "0 28px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBackup}
          title="Descargar backup JSON"
          style={{
            height: 34, padding: "0 12px", borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--surface)",
            cursor: "pointer", fontSize: 12, color: "var(--muted)",
          }}
        >
          Backup
        </button>
        <button
          onClick={onToggleDark}
          title="Modo oscuro"
          style={{
            width: 34, height: 34, borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--surface)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted)",
          }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--accent)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
        }}>
          MG
        </div>
      </div>
    </header>
  );
}
