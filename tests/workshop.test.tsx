import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { App } from "@/App";
import { BuildSummary } from "@/components/BuildSummary";
import { Catalog } from "@/components/Catalog";
import { SavePresetForm } from "@/components/SavePresetForm";
import { buildTotals, missingParts, removePart, selectPart } from "@/domain/build";
import { DEFAULT_FILTERS, filterParts } from "@/domain/catalog";
import { createPresetSchema, PRESET_NAME_MESSAGE } from "@/domain/preset";
import type { Build, CatalogFilters, Part } from "@/domain/types";

import {
  makeBoard,
  makeCpu,
  makeGpu,
  makeMemory,
  makePsu,
  makeStorage,
} from "./factories";

const ryzen = makeCpu({ name: "Ryzen 7 9700X", brand: "AMD", priceGtq: 2890, watts: 65 });
const ultra = makeCpu({
  name: "Core Ultra 7 265K",
  brand: "Intel",
  priceGtq: 3350,
  socket: "LGA1851",
  watts: 125,
});
const fury = makeMemory({
  name: "Fury Edición Beast 32 GB",
  brand: "Kingston",
  priceGtq: 890,
});
const vengeance = makeMemory({
  name: "Vengeance 64 GB",
  brand: "Corsair",
  priceGtq: 1790,
});
const radeon = makeGpu({
  name: "Radeon RX 9070 XT",
  brand: "AMD",
  priceGtq: 6190,
  watts: 304,
});
const focus = makePsu({ name: "Focus GX-850", brand: "Seasonic", priceGtq: 1190 });

const PARTS: readonly Part[] = [ultra, fury, radeon, ryzen, focus, vengeance];

function withFilters(changes: Partial<CatalogFilters>): CatalogFilters {
  return { ...DEFAULT_FILTERS, ...changes };
}

function names(parts: readonly Part[]): string[] {
  return parts.map((part) => part.name);
}

describe("filterParts", () => {
  it("filtra por tipo y por precio máximo inclusivo", () => {
    expect(names(filterParts(PARTS, withFilters({ kind: "memory" })))).toEqual([
      "Fury Edición Beast 32 GB",
      "Vengeance 64 GB",
    ]);
    expect(names(filterParts(PARTS, withFilters({ maxPriceGtq: 1190 })))).toEqual([
      "Fury Edición Beast 32 GB",
      "Focus GX-850",
    ]);
  });

  it("busca en nombre y marca sin distinguir mayúsculas ni tildes", () => {
    expect(names(filterParts(PARTS, withFilters({ query: "  EDICION " })))).toEqual([
      "Fury Edición Beast 32 GB",
    ]);
    expect(names(filterParts(PARTS, withFilters({ query: "amd" })))).toEqual([
      "Ryzen 7 9700X",
      "Radeon RX 9070 XT",
    ]);
  });

  it("combina todos los filtros a la vez", () => {
    const filters = withFilters({ kind: "cpu", query: "a", maxPriceGtq: 3000 });

    expect(names(filterParts(PARTS, filters))).toEqual(["Ryzen 7 9700X"]);
  });

  it("ordena por precio en ambos sentidos y por consumo", () => {
    expect(
      names(filterParts(PARTS, withFilters({ sort: "price-desc" }))).slice(0, 2),
    ).toEqual(["Radeon RX 9070 XT", "Core Ultra 7 265K"]);
    expect(names(filterParts(PARTS, withFilters({ sort: "watts-asc" })))).toEqual([
      "Focus GX-850",
      "Fury Edición Beast 32 GB",
      "Vengeance 64 GB",
      "Ryzen 7 9700X",
      "Core Ultra 7 265K",
      "Radeon RX 9070 XT",
    ]);
  });

  it("no muta el arreglo recibido y siempre devuelve uno nuevo", () => {
    const frozen = Object.freeze([...PARTS]);

    const sorted = filterParts(frozen, withFilters({ sort: "price-asc" }));
    const all = filterParts(frozen, withFilters({ sort: "price-desc" }));

    expect(names(sorted)[0]).toBe("Fury Edición Beast 32 GB");
    expect(all).not.toBe(frozen);
    expect(names(frozen)).toEqual(names(PARTS));
  });
});

describe("inmutabilidad de la build", () => {
  it("selectPart coloca el componente en su lugar sin mutar la build", () => {
    const empty: Build = Object.freeze({});

    const next = selectPart(empty, ryzen);

    expect(next).toEqual({ cpu: ryzen });
    expect(next).not.toBe(empty);
    expect(empty).toEqual({});
  });

  it("selectPart reemplaza el componente del mismo tipo", () => {
    const build = selectPart(selectPart({}, ryzen), fury);

    const next = selectPart(build, ultra);

    expect(next).toEqual({ cpu: ultra, memory: fury });
    expect(build.cpu).toBe(ryzen);
  });

  it("removePart quita el tipo indicado y devuelve una build nueva", () => {
    const build: Build = Object.freeze({ cpu: ryzen, memory: fury });

    const next = removePart(build, "cpu");

    expect(next).toEqual({ memory: fury });
    expect(build).toEqual({ cpu: ryzen, memory: fury });
  });

  it("buildTotals suma precio y consumo, y la fuente no consume", () => {
    const build: Build = { cpu: ryzen, gpu: radeon, psu: focus };

    expect(buildTotals(build)).toEqual({ priceGtq: 2890 + 6190 + 1190, watts: 65 + 304 });
    expect(buildTotals({})).toEqual({ priceGtq: 0, watts: 0 });
  });

  it("missingParts lista los obligatorios que faltan, en orden", () => {
    expect(missingParts({ gpu: radeon, memory: fury })).toEqual([
      "cpu",
      "motherboard",
      "storage",
      "psu",
    ]);
    expect(
      missingParts({
        cpu: ryzen,
        motherboard: makeBoard(),
        memory: fury,
        storage: makeStorage(),
        psu: focus,
      }),
    ).toEqual([]);
  });
});

describe("Catalog", () => {
  it("escribir en Buscar filtra la lista y actualiza el conteo", async () => {
    const user = userEvent.setup();
    render(<Catalog parts={PARTS} onAdd={vi.fn()} />);

    await user.type(screen.getByRole("searchbox", { name: "Buscar" }), "ryzen");

    const list = screen.getByRole("list", { name: "Resultados del catálogo" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(
      within(list).getByRole("heading", { name: "Ryzen 7 9700X" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 componente")).toBeInTheDocument();
  });

  it("Tipo y Precio máximo se combinan; sin resultados muestra un aviso", async () => {
    const user = userEvent.setup();
    render(<Catalog parts={PARTS} onAdd={vi.fn()} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Tipo" }), "memory");
    expect(screen.getByText("2 componentes")).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton", { name: "Precio máximo (Q)" }), "500");

    expect(
      screen.queryByRole("list", { name: "Resultados del catálogo" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Ningún componente coincide con los filtros."),
    ).toBeInTheDocument();
  });

  it("Agregar entrega a onAdd el componente de la lista filtrada", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<Catalog parts={PARTS} onAdd={onAdd} />);

    await user.type(screen.getByRole("searchbox", { name: "Buscar" }), "seasonic");
    expect(screen.getByText("1 componente")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Agregar Focus GX-850" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(focus);
  });
});

describe("BuildSummary", () => {
  it("muestra los componentes, los totales y lo que falta", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<BuildSummary build={{ cpu: ryzen, gpu: radeon }} onRemove={onRemove} />);

    const summary = screen.getByRole("region", { name: "Tu build" });
    const list = within(summary).getByRole("list", { name: "Componentes de la build" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(summary).getByText("Precio total: Q9,080.00")).toBeInTheDocument();
    expect(within(summary).getByText("Consumo estimado: 369 W")).toBeInTheDocument();
    expect(
      within(summary).getByText(
        "Faltan: Placa madre, Memoria RAM, Almacenamiento, Fuente de poder",
      ),
    ).toBeInTheDocument();

    await user.click(
      within(summary).getByRole("button", { name: "Quitar Radeon RX 9070 XT" }),
    );
    expect(onRemove).toHaveBeenCalledWith("gpu");
  });
});

describe("SavePresetForm", () => {
  it("createPresetSchema recorta el nombre y mide la longitud ya recortada", () => {
    const schema = createPresetSchema();

    expect(
      schema.parse({ name: "  Torre de render  ", useCase: "3d", shared: false }),
    ).toEqual({ name: "Torre de render", useCase: "3d", shared: false });
    const result = schema.safeParse({ name: "  ab  ", useCase: "dev", shared: true });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(PRESET_NAME_MESSAGE);
  });

  it("al guardar sin nombre marca el campo con un error accesible y no llama a onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SavePresetForm onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: "Guardar plantilla" }));

    const name = screen.getByRole("textbox", { name: "Nombre de la plantilla" });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(PRESET_NAME_MESSAGE);
    expect(screen.getByRole("combobox", { name: "Uso principal" })).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("con datos válidos entrega el nombre recortado, el uso y la casilla", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SavePresetForm onSave={onSave} />);

    await user.type(
      screen.getByRole("textbox", { name: "Nombre de la plantilla" }),
      "  Edición nocturna ",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Uso principal" }),
      "Edición de video",
    );
    await user.click(screen.getByRole("checkbox", { name: "Compartir con el equipo" }));
    await user.click(screen.getByRole("button", { name: "Guardar plantilla" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0]?.[0]).toEqual({
      name: "Edición nocturna",
      useCase: "video",
      shared: true,
    });
  });
});

describe("App", () => {
  it("agregar dos procesadores deja solo el último y Quitar lo elimina", async () => {
    const user = userEvent.setup();
    render(<App parts={PARTS} />);
    const summary = screen.getByRole("region", { name: "Tu build" });

    await user.click(screen.getByRole("button", { name: "Agregar Ryzen 7 9700X" }));
    await user.click(screen.getByRole("button", { name: "Agregar Core Ultra 7 265K" }));

    expect(
      within(summary).getByText("Procesador: Core Ultra 7 265K"),
    ).toBeInTheDocument();
    expect(
      within(summary).queryByText("Procesador: Ryzen 7 9700X"),
    ).not.toBeInTheDocument();
    expect(within(summary).getByText("Precio total: Q3,350.00")).toBeInTheDocument();

    await user.click(
      within(summary).getByRole("button", { name: "Quitar Core Ultra 7 265K" }),
    );
    expect(
      within(summary).getByText("Todavía no agregas componentes."),
    ).toBeInTheDocument();
  });
});
