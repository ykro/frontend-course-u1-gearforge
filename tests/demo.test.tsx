import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PartCard } from "@/components/PartCard";
import { partWatts } from "@/domain/parts";

import { makeCpu, makeGpu, makePsu } from "./factories";

describe("demo", () => {
  it("partWatts usa el discriminante kind: una fuente consume 0 W", () => {
    expect(partWatts(makeCpu({ watts: 125 }))).toBe(125);
    expect(partWatts(makePsu({ capacityWatts: 850 }))).toBe(0);
  });

  it("PartCard muestra el nombre como encabezado, el precio y el consumo", () => {
    render(
      <PartCard
        part={makeGpu({ name: "GeForce RTX 5070", priceGtq: 5290, watts: 250 })}
      />,
    );

    expect(screen.getByRole("heading", { name: "GeForce RTX 5070" })).toBeInTheDocument();
    expect(screen.getByText("Q5,290.00")).toBeInTheDocument();
    expect(screen.getByText("Consume 250 W")).toBeInTheDocument();
  });
});
