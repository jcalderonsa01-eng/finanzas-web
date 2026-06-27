"use client";

import { fmt, Transaction } from "@/lib/types";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const HIST = [
  { mes: "Ene", ingresos: 24000, egresos: 18000 },
  { mes: "Feb", ingresos: 26500, egresos: 19200 },
  { mes: "Mar", ingresos: 25000, egresos: 17400 },
  { mes: "Abr", ingresos: 30000, egresos: 22000 },
  { mes: "May", ingresos: 27500, egresos: 21300 },
];

const PALETTE = [
  "oklch(58% 0.18 255)","oklch(56% 0.16 155)","oklch(57% 0.19 25)",
  "oklch(72% 0.16 75)","oklch(58% 0.15 300)","oklch(60% 0.14 200)","oklch(55% 0.13 30)",
];

interface Props { transactions: Transaction[] }

export default function Charts({ transactions }: Props) {
  const cats: Record<string, number> = {};
  transactions.filter(t => t.type === "egreso").forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
  });
  const donutData = Object.entries(cats).map(([name, value]) => ({ name, value }));
  const totalEgr = donutData.reduce((s, d) => s + d.value, 0);

  // Add current month totals to line data
  const curIng = transactions.filter(t => t.type === "ingreso").reduce((s, t) => s + Number(t.amount), 0);
  const curEgr = transactions.filter(t => t.type === "egreso" ).reduce((s, t) => s + Number(t.amount), 0);
  const lineData = [...HIST, { mes: "Jun", ingresos: curIng, egresos: curEgr }];

  const tickStyle = { fill: "var(--muted)", fontSize: 11 };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14, marginBottom: 24 }}>
      {/* Line chart */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          Ingresos vs Egresos
          <span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted)" }}>Últimos 6 meses</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="0" />
            <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => "$" + v.toLocaleString("es-MX")} width={80} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Line type="monotone" dataKey="ingresos" stroke="oklch(56% 0.16 155)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="egresos"  stroke="oklch(57% 0.19 25)"  strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut chart */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          Gastos por categoría
          <span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted)" }}>{fmt(totalEgr)}</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={donutData} dataKey="value" innerRadius="65%" outerRadius="90%" paddingAngle={2}>
              {donutData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />)}
            </Pie>
            <Tooltip formatter={(v: number) => fmt(v)} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          {donutData.map((d, i) => (
            <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: PALETTE[i % PALETTE.length], flexShrink: 0, display: "inline-block" }} />
                <span>{d.name}</span>
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--muted)" }}>{fmt(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
