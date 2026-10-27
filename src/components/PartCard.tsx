import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatGtq } from "@/domain/format";
import { describePart, wattsLabel } from "@/domain/parts";
import { KIND_LABELS, type Part } from "@/domain/types";

interface PartCardProps {
  part: Part;
  /** Acción opcional al pie de la tarjeta (composición: quien usa la tarjeta decide). */
  action?: ReactNode;
}

export function PartCard({ part, action }: PartCardProps) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <Badge variant="secondary">{KIND_LABELS[part.kind]}</Badge>
        <CardTitle>
          <h3>{part.name}</h3>
        </CardTitle>
        <CardDescription>
          {part.brand} · {describePart(part)}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-baseline justify-between gap-2">
        <span className="text-base font-semibold">{formatGtq(part.priceGtq)}</span>
        <span className="text-muted-foreground">{wattsLabel(part)}</span>
      </CardContent>
      {action ? <CardFooter>{action}</CardFooter> : null}
    </Card>
  );
}
