// Fábricas oficiales de datos de prueba. Cada test arma sus propios componentes
// para no depender del catálogo de demostración de src/domain/catalog-data.ts.
import type {
  Build,
  Cpu,
  Gpu,
  Memory,
  Motherboard,
  PowerSupply,
  Storage,
} from "@/domain/types";

let sequence = 0;

function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

export function makeCpu(overrides: Partial<Omit<Cpu, "kind">> = {}): Cpu {
  return {
    kind: "cpu",
    id: nextId("cpu"),
    name: "Procesador de prueba",
    brand: "Marca A",
    priceGtq: 3000,
    socket: "AM5",
    cores: 8,
    watts: 100,
    ...overrides,
  };
}

export function makeBoard(
  overrides: Partial<Omit<Motherboard, "kind">> = {},
): Motherboard {
  return {
    kind: "motherboard",
    id: nextId("mb"),
    name: "Placa de prueba",
    brand: "Marca B",
    priceGtq: 1500,
    socket: "AM5",
    memoryType: "DDR5",
    memorySlots: 4,
    watts: 40,
    ...overrides,
  };
}

export function makeMemory(overrides: Partial<Omit<Memory, "kind">> = {}): Memory {
  return {
    kind: "memory",
    id: nextId("ram"),
    name: "Memoria de prueba",
    brand: "Marca C",
    priceGtq: 800,
    memoryType: "DDR5",
    modules: 2,
    capacityGb: 32,
    watts: 10,
    ...overrides,
  };
}

export function makeGpu(overrides: Partial<Omit<Gpu, "kind">> = {}): Gpu {
  return {
    kind: "gpu",
    id: nextId("gpu"),
    name: "Gráfica de prueba",
    brand: "Marca D",
    priceGtq: 5000,
    vramGb: 12,
    watts: 250,
    ...overrides,
  };
}

export function makeStorage(overrides: Partial<Omit<Storage, "kind">> = {}): Storage {
  return {
    kind: "storage",
    id: nextId("ssd"),
    name: "SSD de prueba",
    brand: "Marca E",
    priceGtq: 900,
    capacityGb: 1000,
    watts: 8,
    ...overrides,
  };
}

export function makePsu(overrides: Partial<Omit<PowerSupply, "kind">> = {}): PowerSupply {
  return {
    kind: "psu",
    id: nextId("psu"),
    name: "Fuente de prueba",
    brand: "Marca F",
    priceGtq: 1000,
    capacityWatts: 850,
    ...overrides,
  };
}

/** Build completa y compatible: AM5 + DDR5, 408 W de consumo y fuente de 850 W. */
export function makeCompatibleBuild(): Build {
  return {
    cpu: makeCpu(),
    motherboard: makeBoard(),
    memory: makeMemory(),
    gpu: makeGpu(),
    storage: makeStorage(),
    psu: makePsu(),
  };
}
