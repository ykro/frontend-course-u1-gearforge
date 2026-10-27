import { PART_KINDS } from "./types";
import type { Build, BuildTotals, Part, PartKind } from "./types";

/** Componentes obligatorios para cotizar, en el orden en que se reportan. */
export const REQUIRED_KINDS: readonly PartKind[] = [
  "cpu",
  "motherboard",
  "memory",
  "storage",
  "psu",
];

/** Los componentes de la build, en el orden de `PART_KINDS`. */
export function buildParts(build: Build): Part[] {
  return PART_KINDS.flatMap((kind) => {
    const part = build[kind];
    return part ? [part] : [];
  });
}

/** Taller, paso 5. Devuelve una build nueva con `part` en su lugar. */
export function selectPart(_build: Build, _part: Part): Build {
  throw new Error("Pendiente: taller, paso 5 (selectPart).");
}

/** Taller, paso 5. Devuelve una build nueva sin el componente de ese tipo. */
export function removePart(_build: Build, _kind: PartKind): Build {
  throw new Error("Pendiente: taller, paso 5 (removePart).");
}

/**
 * Taller, paso 5. Precio total y consumo estimado (una fuente consume 0 W).
 * Mientras no la implementes devuelve ceros para que `BuildSummary`, que ya
 * viene hecho, no tumbe la app.
 */
export function buildTotals(_build: Build): BuildTotals {
  return { priceGtq: 0, watts: 0 };
}

/**
 * Taller, paso 5. Tipos obligatorios que faltan, en el orden de `REQUIRED_KINDS`.
 * Mientras no la implementes dice que faltan todos, por la misma razón.
 */
export function missingParts(_build: Build): PartKind[] {
  return [...REQUIRED_KINDS];
}
