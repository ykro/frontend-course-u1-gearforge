import { DeliveryOptions } from "@/components/DeliveryOptions";
import { OrderField } from "@/components/OrderField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { ORDER_MESSAGES } from "@/domain/order-messages";
import type { Build, BuildOrder } from "@/domain/types";

interface BuildOrderFormProps {
  build: Build;
  onSubmit: (order: BuildOrder) => void;
}

/**
 * Reto, parte C. La maqueta ya tiene los campos con sus etiquetas, `OrderField`
 * (campo con error accesible) y `DeliveryOptions` (radios de Radix), pero
 * todavía no valida ni envía nada. Conéctala con React Hook Form y
 * `createOrderSchema` siguiendo el contrato de la guía del reto.
 */
export function BuildOrderForm(_props: BuildOrderFormProps) {
  return (
    <form
      aria-label="Datos de la cotización"
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-4"
    >
      <FieldGroup className="gap-4">
        <OrderField id="order-name" label="Nombre completo" autoComplete="name" />
        <OrderField id="order-email" label="Correo" type="email" autoComplete="email" />
        <OrderField
          id="order-budget"
          label="Presupuesto en quetzales"
          type="number"
          min={1}
          step={1}
        />
        <DeliveryOptions name="delivery" defaultValue="pickup" />
        {/* Debe existir solo mientras está elegido "Envío a domicilio". */}
        <OrderField
          id="order-address"
          label="Dirección de envío"
          autoComplete="street-address"
        />
      </FieldGroup>
      {/* Debe mostrarse (y describir el botón) solo si la build no está lista. */}
      <p id="order-blocked" className="text-sm text-muted-foreground">
        {ORDER_MESSAGES.blocked}
      </p>
      <Button type="submit">Solicitar cotización</Button>
    </form>
  );
}
