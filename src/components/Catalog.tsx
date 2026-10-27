import { PartCard } from "@/components/PartCard";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { DEFAULT_FILTERS } from "@/domain/catalog";
import {
  KIND_LABELS,
  PART_KINDS,
  type CatalogFilters,
  type Part,
  type PartKind,
  type SortOrder,
} from "@/domain/types";

const SORT_OPTIONS: readonly { value: SortOrder; label: string }[] = [
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "watts-asc", label: "Consumo: menor a mayor" },
];

function toKindFilter(value: string): PartKind | "all" {
  return PART_KINDS.find((kind) => kind === value) ?? "all";
}

function toSortOrder(value: string): SortOrder {
  return SORT_OPTIONS.find((option) => option.value === value)?.value ?? "price-asc";
}

function toMaxPrice(value: string): number | null {
  const price = Number.parseInt(value, 10);
  return Number.isNaN(price) ? null : price;
}

interface CatalogProps {
  parts: readonly Part[];
  onAdd: (part: Part) => void;
}

/**
 * Taller, paso 6. La maqueta ya pinta los filtros, el conteo, el aviso sin
 * resultados y la lista; todavía no guarda los filtros ni filtra nada. Conecta
 * el estado con los tres cambios marcados con "Paso 6".
 */
export function Catalog({ parts, onAdd }: CatalogProps) {
  // Paso 6: guarda los filtros en un solo useState<CatalogFilters>(DEFAULT_FILTERS).
  const filters = DEFAULT_FILTERS;

  // Paso 6: deriva la lista visible con filterParts; sin otro useState ni useEffect.
  const visible = parts;

  // Paso 6: actualiza solo la llave `key` con una copia nueva de los filtros.
  function update<K extends keyof CatalogFilters>(_key: K, _value: CatalogFilters[K]) {}

  return (
    <section aria-labelledby="catalog-title" className="flex flex-col gap-4">
      <h2 id="catalog-title" className="text-lg font-semibold">
        Catálogo
      </h2>
      <FieldGroup className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="catalog-query">Buscar</FieldLabel>
          <Input
            id="catalog-query"
            type="search"
            placeholder="Marca o modelo"
            value={filters.query}
            onChange={(event) => update("query", event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="catalog-kind">Tipo</FieldLabel>
          <NativeSelect
            id="catalog-kind"
            className="w-full"
            value={filters.kind}
            onChange={(event) => update("kind", toKindFilter(event.target.value))}
          >
            <NativeSelectOption value="all">Todos</NativeSelectOption>
            {PART_KINDS.map((kind) => (
              <NativeSelectOption key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="catalog-max-price">Precio máximo (Q)</FieldLabel>
          <Input
            id="catalog-max-price"
            type="number"
            min={0}
            step={1}
            placeholder="Sin límite"
            value={filters.maxPriceGtq ?? ""}
            onChange={(event) => update("maxPriceGtq", toMaxPrice(event.target.value))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="catalog-sort">Ordenar por</FieldLabel>
          <NativeSelect
            id="catalog-sort"
            className="w-full"
            value={filters.sort}
            onChange={(event) => update("sort", toSortOrder(event.target.value))}
          >
            {SORT_OPTIONS.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </FieldGroup>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {visible.length === 1 ? "1 componente" : `${visible.length} componentes`}
      </p>

      {visible.length === 0 ? (
        <p>Ningún componente coincide con los filtros.</p>
      ) : (
        <ul
          aria-label="Resultados del catálogo"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((part) => (
            <li key={part.id}>
              <PartCard
                part={part}
                action={
                  <Button aria-label={`Agregar ${part.name}`} onClick={() => onAdd(part)}>
                    Agregar
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
