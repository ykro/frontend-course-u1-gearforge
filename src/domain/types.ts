// Modelo de dominio de GearForge Studio.
// Cada componente es una variante de la unión discriminada `Part`: el campo
// `kind` le dice a TypeScript qué propiedades existen en cada caso.

export type Socket = "AM5" | "LGA1851";
export type MemoryType = "DDR4" | "DDR5";

interface PartBase {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  /** Precio en quetzales enteros. */
  readonly priceGtq: number;
}

export interface Cpu extends PartBase {
  readonly kind: "cpu";
  readonly socket: Socket;
  readonly cores: number;
  readonly watts: number;
}

export interface Motherboard extends PartBase {
  readonly kind: "motherboard";
  readonly socket: Socket;
  readonly memoryType: MemoryType;
  readonly memorySlots: number;
  readonly watts: number;
}

export interface Memory extends PartBase {
  readonly kind: "memory";
  readonly memoryType: MemoryType;
  readonly modules: number;
  readonly capacityGb: number;
  readonly watts: number;
}

export interface Gpu extends PartBase {
  readonly kind: "gpu";
  readonly vramGb: number;
  readonly watts: number;
}

export interface Storage extends PartBase {
  readonly kind: "storage";
  readonly capacityGb: number;
  readonly watts: number;
}

export interface PowerSupply extends PartBase {
  readonly kind: "psu";
  /** Potencia que entrega la fuente; una fuente no consume, alimenta. */
  readonly capacityWatts: number;
}

export type Part = Cpu | Motherboard | Memory | Gpu | Storage | PowerSupply;
export type PartKind = Part["kind"];

/** Una build tiene como máximo un componente de cada tipo. */
export type Build = {
  readonly [K in PartKind]?: Extract<Part, { kind: K }>;
};

export type SortOrder = "price-asc" | "price-desc" | "watts-asc";

export interface CatalogFilters {
  readonly kind: PartKind | "all";
  readonly query: string;
  /** Precio máximo en quetzales, inclusivo; `null` significa sin límite. */
  readonly maxPriceGtq: number | null;
  readonly sort: SortOrder;
}

export interface BuildTotals {
  readonly priceGtq: number;
  readonly watts: number;
}

/** Problemas de compatibilidad que detecta `checkCompatibility` (reto). */
export type CompatibilityIssue =
  | {
      readonly code: "SOCKET_MISMATCH";
      readonly cpuSocket: Socket;
      readonly boardSocket: Socket;
    }
  | {
      readonly code: "MEMORY_TYPE_MISMATCH";
      readonly memoryType: MemoryType;
      readonly boardMemoryType: MemoryType;
    }
  | {
      readonly code: "NOT_ENOUGH_SLOTS";
      readonly modules: number;
      readonly slots: number;
    }
  | {
      readonly code: "PSU_TOO_WEAK";
      readonly requiredWatts: number;
      readonly capacityWatts: number;
    };

export const KIND_LABELS: Readonly<Record<PartKind, string>> = {
  cpu: "Procesador",
  motherboard: "Placa madre",
  memory: "Memoria RAM",
  gpu: "Tarjeta gráfica",
  storage: "Almacenamiento",
  psu: "Fuente de poder",
};

/** Orden en que se muestran los tipos de componente en la app. */
export const PART_KINDS: readonly PartKind[] = [
  "cpu",
  "motherboard",
  "memory",
  "gpu",
  "storage",
  "psu",
];

/** Uso principal de una plantilla de build (taller, paso 7). */
export type UseCase = "3d" | "video" | "dev";

/** Valores del formulario de plantilla tal como los captura React Hook Form. */
export interface PresetFormValues {
  name: string;
  useCase: UseCase;
  shared: boolean;
}

/** Plantilla validada que el formulario del taller entrega a `onSave`. */
export interface BuildPreset {
  readonly name: string;
  readonly useCase: UseCase;
  readonly shared: boolean;
}

export type Delivery = "pickup" | "delivery";

/** Valores del formulario de cotización tal como los captura React Hook Form. */
export interface OrderFormValues {
  customerName: string;
  email: string;
  budgetGtq: number;
  delivery: Delivery;
  address: string;
}

/** Cotización validada que el formulario entrega a `onSubmit` (contrato del reto). */
export interface BuildOrder {
  readonly customerName: string;
  readonly email: string;
  readonly budgetGtq: number;
  readonly delivery: Delivery;
  /** Dirección recortada si `delivery` es "delivery"; `null` si se recoge en tienda. */
  readonly address: string | null;
}
