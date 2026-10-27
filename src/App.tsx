import { useState } from "react";

import { BuildOrderForm } from "@/components/BuildOrderForm";
import { BuildSummary } from "@/components/BuildSummary";
import { Catalog } from "@/components/Catalog";
import { CompatibilityPanel } from "@/components/CompatibilityPanel";
import { SavePresetForm } from "@/components/SavePresetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removePart, selectPart } from "@/domain/build";
import { CATALOG } from "@/domain/catalog-data";
import { checkCompatibility } from "@/domain/compatibility";
import type { Build, BuildOrder, BuildPreset, Part } from "@/domain/types";

interface AppProps {
  /** Catálogo a mostrar; los tests pasan el suyo para no depender de los datos de demo. */
  parts?: readonly Part[];
}

export function App({ parts = CATALOG }: AppProps) {
  // Única fuente de verdad de la build: el resto de la pantalla se deriva de aquí.
  const [build, setBuild] = useState<Build>({});
  const [lastOrder, setLastOrder] = useState<BuildOrder | null>(null);
  const [preset, setPreset] = useState<BuildPreset | null>(null);
  const issues = checkCompatibility(build);

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold tracking-tight">GearForge Studio</h1>
          <p className="text-sm text-muted-foreground">
            Configura una workstation compatible y solicita tu cotización.
          </p>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Catalog
          parts={parts}
          onAdd={(part) => setBuild((current) => selectPart(current, part))}
        />
        <aside className="flex flex-col gap-4" aria-label="Configurador">
          <BuildSummary
            build={build}
            onRemove={(kind) => setBuild((current) => removePart(current, kind))}
          />
          <CompatibilityPanel issues={issues} />
          <Card role="region" aria-labelledby="order-title">
            <CardHeader>
              <CardTitle>
                <h2 id="order-title">Cotización</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <BuildOrderForm build={build} onSubmit={setLastOrder} />
              {lastOrder ? (
                <p role="status" className="text-sm text-success">
                  {`Solicitud registrada para ${lastOrder.customerName}.`}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card role="region" aria-labelledby="preset-title">
            <CardHeader>
              <CardTitle>
                <h2 id="preset-title">Plantilla</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <SavePresetForm onSave={setPreset} />
              {preset ? (
                <p role="status" className="text-sm text-success">
                  {`Plantilla "${preset.name}" guardada.`}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
