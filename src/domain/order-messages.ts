import { formatGtq } from "./format";

/** Presupuesto máximo que acepta el formulario, en quetzales. */
export const MAX_BUDGET_GTQ = 500_000;

/** Mensajes exactos del contrato del reto (README, sección "Mensajes"). */
export const ORDER_MESSAGES = {
  customerName: "Escribe tu nombre completo (de 3 a 80 caracteres).",
  email: "Escribe un correo válido, por ejemplo ana@estudio.gt.",
  budget: "Escribe un presupuesto en quetzales: un número entero mayor que 0.",
  budgetMax: "El presupuesto máximo es de Q500,000.00.",
  address: "Escribe la dirección de envío (de 10 a 160 caracteres).",
  blocked: "Completa la build y resuelve los problemas de compatibilidad para cotizar.",
} as const;

export function budgetBelowTotalMessage(totalGtq: number): string {
  return `El presupuesto no cubre el total de la build (${formatGtq(totalGtq)}).`;
}
