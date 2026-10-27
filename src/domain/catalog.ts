import type { CatalogFilters, Part } from "./types";

export const DEFAULT_FILTERS: CatalogFilters = {
  kind: "all",
  query: "",
  maxPriceGtq: null,
  sort: "price-asc",
};

/** Minúsculas, sin tildes ni espacios en los extremos: "  Gráfica " -> "grafica". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Taller, paso 4. Aplica todos los filtros a la vez y ordena el resultado.
 * Es una función pura: no muta `parts` y siempre devuelve un arreglo nuevo.
 */
export function filterParts(_parts: readonly Part[], _filters: CatalogFilters): Part[] {
  throw new Error("Pendiente: taller, paso 4 (filterParts).");
}
