import type { ComponentProps } from "react";

import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Grupo de radios "Entrega" de la cotización. Es un `RadioGroup` de Radix: no es
 * un `<input>` nativo, así que se controla con `value` y `onValueChange`.
 */
export function DeliveryOptions(props: ComponentProps<typeof RadioGroup>) {
  return (
    <FieldSet>
      <FieldLegend id="order-delivery-legend" variant="label">
        Entrega
      </FieldLegend>
      <RadioGroup aria-labelledby="order-delivery-legend" {...props}>
        <Field orientation="horizontal">
          <RadioGroupItem id="order-delivery-pickup" value="pickup" />
          <FieldLabel htmlFor="order-delivery-pickup">Recoger en tienda</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem id="order-delivery-home" value="delivery" />
          <FieldLabel htmlFor="order-delivery-home">Envío a domicilio</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}
