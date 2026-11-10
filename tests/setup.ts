// Setup oficial de los tests. No lo modifiques: es parte de la suite oficial.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// jsdom no implementa ResizeObserver, que usan algunos componentes de Radix
// (por ejemplo RadioGroup). En los tests basta con una versión que no hace nada.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  // Tests herméticos: ningún test usa la red.
  vi.stubGlobal("fetch", () => Promise.reject(new Error("Los tests no usan la red.")));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
