"use client";

import { useEffect, useState } from "react";
import { Transaction, TxnFormData } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import KpiGrid from "@/components/KpiGrid";
import Charts from "@/components/Charts";
import TxnTable from "@/components/TxnTable";
import TxnModal from "@/components/TxnModal";
import { PlusIcon } from "@/components/Icons";

const VIEW_TITLES: Record<string, string> = {
  dashboard: "Resumen general",
  transactions: "Historial de transacciones",
  debit: "Cuenta Débito",
  credit: "Cuenta Crédito",
  savings: "Ahorro",
};

export default function Dashboard({ initial }: { initial: Transaction[] }) {
  const [txns, setTxns]       = useState<Transaction[]>(initial);
  const [view, setView]       = useState("dashboard");
  const [dark, setDark]       = useState(false);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hf-dark");
    if (saved === "1") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("hf-dark", next ? "1" : "0");
  }

  function openNew()             { setEditing(null); setModal(true); }
  function openEdit(t: Transaction) { setEditing(t);   setModal(true); }
  function closeModal()          { setModal(false); setEditing(null); }

  async function handleSave(data: TxnFormData) {
    if (editing) {
      const res = await fetch(`/api/transactions/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await res.json();
      setTxns(ts => ts.map(t => t.id === editing.id ? updated : t));
    } else {
      const res = await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const created = await res.json();
      setTxns(ts => [created, ...ts]);
    }
    closeModal();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTxns(ts => ts.filter(t => t.id !== id));
    closeModal();
  }

  const sorted   = [...txns].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = search ? sorted.filter(t =>
    [t.desc, t.category, t.card].some(f => f.toLowerCase().includes(search.toLowerCase()))
  ) : sorted;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar view={view} onViewChange={setView} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar
          title={VIEW_TITLES[view] ?? ""}
          dark={dark}
          onToggleDark={toggleDark}
          onBackup={() => window.open("/api/backup")}
        />

        <main style={{ padding: "24px 28px", flex: 1 }}>
          {view === "dashboard" && (
            <>
              <KpiGrid transactions={txns} />
              <Charts transactions={txns} />
              <SectionHeader title="Últimas transacciones" onNew={openNew} />
              <TxnTable transactions={sorted.slice(0, 6)} onEdit={openEdit} onDelete={handleDelete} />
            </>
          )}

          {view === "transactions" && (
            <>
              <SectionHeader title="Historial de transacciones" onNew={openNew}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar…"
                  style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", fontSize: 13, background: "var(--bg)", color: "var(--fg)", outline: "none", width: 200 }}
                />
              </SectionHeader>
              <TxnTable transactions={filtered} onEdit={openEdit} onDelete={handleDelete} />
            </>
          )}

          {["debit", "credit", "savings"].includes(view) && (
            <div style={{ color: "var(--muted)", marginTop: 40, textAlign: "center" }}>Vista en construcción</div>
          )}
        </main>
      </div>

      <TxnModal open={modal} editing={editing} onClose={closeModal} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}

function SectionHeader({ title, onNew, children }: { title: string; onNew: () => void; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {children}
        <button
          onClick={onNew}
          style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <PlusIcon /> Nueva transacción
        </button>
      </div>
    </div>
  );
}
