import type { z } from "zod";

import type { BuildPreset, PresetFormValues, UseCase } from "./types";

/** Opciones del selector "Uso principal", en el orden en que se muestran. */
export const USE_CASES: readonly { value: UseCase; label: string }[] = [
  { value: "3d", label: "Diseño 3D" },
  { value: "video", label: "Edición de video" },
  { value: "dev", label: "Desarrollo de software" },
];

export const PRESET_NAME_MESSAGE = "Escribe un nombre de 3 a 40 caracteres.";

/** Taller, paso 7. Esquema de la plantilla: recorta el nombre antes de medirlo. */
export function createPresetSchema(): z.ZodType<BuildPreset, PresetFormValues> {
  throw new Error("Pendiente: taller, paso 7 (createPresetSchema).");
}
