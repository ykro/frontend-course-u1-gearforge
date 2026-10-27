import type { Part } from "./types";

/**
 * Consumo eléctrico de un componente en watts.
 * Después del `if`, TypeScript sabe que `part` no es una fuente de poder y
 * por eso permite leer `part.watts` (narrowing por el discriminante `kind`).
 */
export function partWatts(part: Part): number {
  if (part.kind === "psu") {
    return 0;
  }
  return part.watts;
}

/** Texto de consumo para la tarjeta: una fuente entrega, el resto consume. */
export function wattsLabel(part: Part): string {
  if (part.kind === "psu") {
    return `Entrega ${part.capacityWatts} W`;
  }
  return `Consume ${part.watts} W`;
}

/** Ficha técnica breve. El `switch` es exhaustivo: un `kind` nuevo no compila. */
export function describePart(part: Part): string {
  switch (part.kind) {
    case "cpu":
      return `Socket ${part.socket} · ${part.cores} núcleos`;
    case "motherboard":
      return `Socket ${part.socket} · ${part.memoryType} · ${part.memorySlots} ranuras`;
    case "memory":
      return `${part.memoryType} · ${part.modules} módulos · ${part.capacityGb} GB`;
    case "gpu":
      return `${part.vramGb} GB de VRAM`;
    case "storage":
      return `${part.capacityGb} GB`;
    case "psu":
      return `${part.capacityWatts} W de capacidad`;
    default:
      return assertNever(part);
  }
}

function assertNever(value: never): never {
  throw new Error(`Tipo de componente no soportado: ${JSON.stringify(value)}`);
}
