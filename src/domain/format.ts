const quetzales = new Intl.NumberFormat("es-GT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatea quetzales como en Guatemala: `formatGtq(14350)` da `"Q14,350.00"`. */
export function formatGtq(amount: number): string {
  return `Q${quetzales.format(amount)}`;
}
