import type { Build, CompatibilityIssue } from "./types";

/** Margen de seguridad de la fuente sobre el consumo estimado, en porcentaje. */
export const PSU_MARGIN_PERCENT = 30;

/**
 * Reto. Potencia mínima de fuente para un consumo dado (contrato en el README).
 */
export function requiredPsuWatts(_totalWatts: number): number {
  throw new Error("Pendiente: reto (requiredPsuWatts).");
}

/**
 * Reto. Reglas de compatibilidad de la build (contrato en el README).
 * Mientras no la implementes devuelve una lista vacía para que la app no se
 * caiga: el panel de compatibilidad dirá que no hay problemas.
 */
export function checkCompatibility(_build: Build): CompatibilityIssue[] {
  return [];
}

/** Mensaje en español de cada problema. El `switch` cubre todas las variantes. */
export function describeIssue(issue: CompatibilityIssue): string {
  switch (issue.code) {
    case "SOCKET_MISMATCH":
      return `El procesador usa socket ${issue.cpuSocket} y la placa madre, ${issue.boardSocket}.`;
    case "MEMORY_TYPE_MISMATCH":
      return `La memoria es ${issue.memoryType} y la placa madre solo acepta ${issue.boardMemoryType}.`;
    case "NOT_ENOUGH_SLOTS":
      return `La memoria trae ${issue.modules} módulos y la placa madre tiene ${issue.slots} ranuras.`;
    case "PSU_TOO_WEAK":
      return `La fuente entrega ${issue.capacityWatts} W y la build necesita al menos ${issue.requiredWatts} W (consumo + 30 %).`;
  }
}
