import type { z } from "zod";

import type { BuildOrder, OrderFormValues } from "./types";

export interface OrderContext {
  /** Precio total de la build en quetzales. */
  readonly totalGtq: number;
}

/**
 * Reto. Esquema de la cotización (contrato en la guía del reto). Recibe el total de
 * la build porque una de las reglas cruzadas compara el presupuesto con ese total.
 */
export function createOrderSchema(
  _context: OrderContext,
): z.ZodType<BuildOrder, OrderFormValues> {
  throw new Error("Pendiente: reto (createOrderSchema).");
}
