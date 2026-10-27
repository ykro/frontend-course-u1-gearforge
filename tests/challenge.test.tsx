// Tests PÚBLICOS del reto: una muestra del contrato. La nota también usa tests
// ocultos con otros datos y más casos borde.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BuildOrderForm } from "@/components/BuildOrderForm";
import { checkCompatibility, requiredPsuWatts } from "@/domain/compatibility";
import type { Build } from "@/domain/types";

import {
  makeBoard,
  makeCompatibleBuild,
  makeCpu,
  makeGpu,
  makeMemory,
  makePsu,
} from "./factories";

describe("requiredPsuWatts", () => {
  it("agrega 30 % al consumo y sube al siguiente múltiplo de 50", () => {
    expect(requiredPsuWatts(450)).toBe(600);
    expect(requiredPsuWatts(100)).toBe(150);
    expect(requiredPsuWatts(0)).toBe(0);
  });
});

describe("checkCompatibility", () => {
  it("una build compatible no tiene problemas y un socket distinto sí", () => {
    const build = makeCompatibleBuild();

    expect(checkCompatibility(build)).toEqual([]);
    expect(
      checkCompatibility({ ...build, motherboard: makeBoard({ socket: "LGA1851" }) }),
    ).toEqual([{ code: "SOCKET_MISMATCH", cpuSocket: "AM5", boardSocket: "LGA1851" }]);
  });

  it("reporta la fuente insuficiente con la potencia requerida", () => {
    const build: Build = {
      gpu: makeGpu({ watts: 450 }),
      psu: makePsu({ capacityWatts: 550 }),
    };

    expect(checkCompatibility(build)).toEqual([
      { code: "PSU_TOO_WEAK", requiredWatts: 600, capacityWatts: 550 },
    ]);
  });

  it("reporta varios problemas en el orden del contrato", () => {
    const build: Build = {
      ...makeCompatibleBuild(),
      cpu: makeCpu({ socket: "LGA1851" }),
      memory: makeMemory({ memoryType: "DDR4" }),
    };

    expect(checkCompatibility(build).map((issue) => issue.code)).toEqual([
      "SOCKET_MISMATCH",
      "MEMORY_TYPE_MISMATCH",
    ]);
  });
});

describe("BuildOrderForm", () => {
  it("con una build incompatible deshabilita el botón y explica por qué", () => {
    const build: Build = {
      ...makeCompatibleBuild(),
      cpu: makeCpu({ socket: "LGA1851" }),
    };
    render(<BuildOrderForm build={build} onSubmit={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Solicitar cotización" });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(
      "Completa la build y resuelve los problemas de compatibilidad para cotizar.",
    );
  });

  it("al enviar vacío marca nombre, correo y presupuesto con mensajes accesibles", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BuildOrderForm build={makeCompatibleBuild()} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Solicitar cotización" }));

    const name = screen.getByRole("textbox", { name: "Nombre completo" });
    const email = screen.getByRole("textbox", { name: "Correo" });
    const budget = screen.getByRole("spinbutton", { name: "Presupuesto en quetzales" });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(
      "Escribe tu nombre completo (de 3 a 80 caracteres).",
    );
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(
      "Escribe un correo válido, por ejemplo ana@estudio.gt.",
    );
    expect(budget).toHaveAttribute("aria-invalid", "true");
    expect(budget).toHaveAccessibleDescription(
      "Escribe un presupuesto en quetzales: un número entero mayor que 0.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("con datos válidos llama a onSubmit con la cotización ya normalizada", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BuildOrderForm build={makeCompatibleBuild()} onSubmit={onSubmit} />);

    await user.type(
      screen.getByRole("textbox", { name: "Nombre completo" }),
      "  Ana López  ",
    );
    await user.type(screen.getByRole("textbox", { name: "Correo" }), "ana@estudio.gt");
    await user.type(
      screen.getByRole("spinbutton", { name: "Presupuesto en quetzales" }),
      "20000",
    );
    await user.click(screen.getByRole("radio", { name: "Envío a domicilio" }));
    await user.type(
      screen.getByRole("textbox", { name: "Dirección de envío" }),
      "  6a. avenida 10-50, zona 1  ",
    );
    await user.click(screen.getByRole("button", { name: "Solicitar cotización" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      customerName: "Ana López",
      email: "ana@estudio.gt",
      budgetGtq: 20000,
      delivery: "delivery",
      address: "6a. avenida 10-50, zona 1",
    });
  });

  it("Envío a domicilio muestra la dirección y la exige", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BuildOrderForm build={makeCompatibleBuild()} onSubmit={onSubmit} />);
    expect(
      screen.queryByRole("textbox", { name: "Dirección de envío" }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Nombre completo" }),
      "Luis Pérez",
    );
    await user.type(screen.getByRole("textbox", { name: "Correo" }), "luis@estudio.gt");
    await user.type(
      screen.getByRole("spinbutton", { name: "Presupuesto en quetzales" }),
      "30000",
    );
    await user.click(screen.getByRole("radio", { name: "Envío a domicilio" }));
    await user.type(
      screen.getByRole("textbox", { name: "Dirección de envío" }),
      "Zona 1",
    );
    await user.click(screen.getByRole("button", { name: "Solicitar cotización" }));

    const address = screen.getByRole("textbox", { name: "Dirección de envío" });
    expect(address).toHaveAttribute("aria-invalid", "true");
    expect(address).toHaveAccessibleDescription(
      "Escribe la dirección de envío (de 10 a 160 caracteres).",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
