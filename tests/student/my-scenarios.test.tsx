// Tus tests propios (15 puntos de la rúbrica).
//
// Tus tests propios suman si pasan contra la solución de referencia y detectan
// mutantes que la suite pública no detecta (errores sembrados en el
// reto). Reescribir un test público no suma.
//
// Escribe al menos 2 tests: detectar 2 o más grupos de esos mutantes da el
// puntaje completo, 1 da la mitad. Usa las fábricas de ../factories y consultas
// por rol (getByRole). No uses la red, no leas archivos y no modifiques los
// tests oficiales ni tests/setup.ts.
import { assert, describe, it } from "vitest";

describe("mis escenarios", () => {
  it("mi escenario 1: renómbralo y describe qué error del reto atrapa", () => {
    assert.fail("Escribe tu primer test propio");
  });

  it("mi escenario 2: renómbralo y describe qué error del reto atrapa", () => {
    assert.fail("Escribe tu segundo test propio");
  });
});
