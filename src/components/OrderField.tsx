import type { ComponentProps } from "react";
import type { FieldError as FormError } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface OrderFieldProps extends ComponentProps<typeof Input> {
  id: string;
  label: string;
  /** Error de React Hook Form de este campo; sin error, el campo no se marca. */
  error?: FormError;
}

/**
 * Campo de texto de la cotización con su error accesible (el mismo patrón del
 * paso 7 del taller): con error, el input lleva `aria-invalid` y su descripción
 * accesible (`aria-describedby`) es exactamente el mensaje.
 */
export function OrderField({ id, label, error, ...inputProps }: OrderFieldProps) {
  const errorId = `${id}-error`;
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      <FieldError id={errorId} errors={[error]} />
    </Field>
  );
}
