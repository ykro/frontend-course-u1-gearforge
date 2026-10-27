import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { USE_CASES } from "@/domain/preset";
import type { BuildPreset } from "@/domain/types";

interface SavePresetFormProps {
  onSave: (preset: BuildPreset) => void;
}

/**
 * Taller, paso 7. La maqueta ya pinta el formulario con sus etiquetas, pero
 * todavía no valida ni guarda nada. Conéctala con React Hook Form y
 * `createPresetSchema`: `register` para el input y el select, `Controller` para
 * la casilla de Radix y el error accesible del nombre.
 */
export function SavePresetForm(_props: SavePresetFormProps) {
  return (
    <form
      aria-label="Guardar como plantilla"
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-4"
    >
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="preset-name">Nombre de la plantilla</FieldLabel>
          <Input id="preset-name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="preset-use">Uso principal</FieldLabel>
          <NativeSelect id="preset-use" className="w-full">
            {USE_CASES.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="preset-shared" />
          <FieldLabel htmlFor="preset-shared">Compartir con el equipo</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" variant="outline">
        Guardar plantilla
      </Button>
    </form>
  );
}
