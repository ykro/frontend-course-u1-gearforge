import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { describeIssue } from "@/domain/compatibility";
import type { CompatibilityIssue } from "@/domain/types";

interface CompatibilityPanelProps {
  issues: readonly CompatibilityIssue[];
}

/** Muestra los problemas que calcula `checkCompatibility` (ya resuelto). */
export function CompatibilityPanel({ issues }: CompatibilityPanelProps) {
  return (
    <Card role="region" aria-labelledby="compat-title">
      <CardHeader>
        <CardTitle>
          <h2 id="compat-title">Compatibilidad</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <p className="text-success">Sin problemas de compatibilidad.</p>
        ) : (
          <ul aria-label="Problemas de compatibilidad" className="flex flex-col gap-2">
            {issues.map((issue) => (
              <li
                key={issue.code}
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive"
              >
                {describeIssue(issue)}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
