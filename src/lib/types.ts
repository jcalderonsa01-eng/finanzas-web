export type TxnType = "ingreso" | "egreso";

export interface Transaction {
  id: number;
  desc: string;
  amount: string;
  type: TxnType;
  category: string;
  card: string;
  date: string;
  createdAt: string;
}

export interface TxnFormData {
  desc: string;
  amount: string;
  type: string;
  category: string;
  card: string;
  date: string;
}

export const CATEGORIES = [
  "Alimentación","Transporte","Entretenimiento","Salud",
  "Servicios","Ropa","Sueldo","Freelance","Inversión","Otro",
] as const;

export const CARDS = [
  "BBVA Débito","Banamex Crédito","HSBC Crédito","Efectivo","Ahorro CETES",
] as const;

export function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  }).format(n);
}

export function fmtDate(s: string) {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}
