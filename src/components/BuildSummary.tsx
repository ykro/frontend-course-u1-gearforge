import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildParts, buildTotals, missingParts } from "@/domain/build";
import { formatGtq } from "@/domain/format";
import { KIND_LABELS, type Build, type PartKind } from "@/domain/types";

interface BuildSummaryProps {
  build: Build;
  onRemove: (kind: PartKind) => void;
}

/**
 * Ya viene hecho. Resumen de la build: todo se deriva de `build` con las
 * funciones del paso 5 (`buildParts`, `buildTotals` y `missingParts`).
 */
export function BuildSummary({ build, onRemove }: BuildSummaryProps) {
  const parts = buildParts(build);
  const totals = buildTotals(build);
  const missing = missingParts(build);

  return (
    <Card role="region" aria-labelledby="summary-title">
      <CardHeader>
        <CardTitle>
          <h2 id="summary-title">Tu build</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {parts.length === 0 ? (
          <p className="text-muted-foreground">Todavía no agregas componentes.</p>
        ) : (
          <ul aria-label="Componentes de la build" className="flex flex-col gap-2">
            {parts.map((part) => (
              <li key={part.id} className="flex items-center justify-between gap-2">
                <span>{`${KIND_LABELS[part.kind]}: ${part.name}`}</span>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={`Quitar ${part.name}`}
                  onClick={() => onRemove(part.kind)}
                >
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
        )}
        <p className="font-semibold">{`Precio total: ${formatGtq(totals.priceGtq)}`}</p>
        <p>{`Consumo estimado: ${totals.watts} W`}</p>
        <p className="text-sm text-muted-foreground">
          {missing.length === 0
            ? "Build completa: tiene todos los componentes obligatorios."
            : `Faltan: ${missing.map((kind) => KIND_LABELS[kind]).join(", ")}`}
        </p>
      </CardContent>
    </Card>
  );
}
