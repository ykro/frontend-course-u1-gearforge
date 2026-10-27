# Checklist de seguridad y calidad — GearForge Studio (Unidad 1)

Marca cada casilla solo si la verificaste en tu código y escribe la evidencia (archivo y función, comando o test). Una casilla marcada sin evidencia no cuenta.

- [ ] **Dominio puro.** Las funciones de `src/domain/` no importan React, no mutan sus argumentos y devuelven arreglos u objetos nuevos. Evidencia:
- [ ] **Estado derivado.** Ningún componente usa `useEffect` para calcular la lista visible, los totales o la compatibilidad; `npm run lint` no reporta `react-hooks/set-state-in-effect`. Evidencia:
- [ ] **Listas con `key` estable.** Todas las listas usan el `id` del dato (o un código único) como `key`, nunca el índice. Evidencia:
- [ ] **Validación en tiempo de ejecución.** Todo lo que entra por el formulario pasa por `createOrderSchema` antes de llegar a `onSubmit`; el correo se normaliza, el presupuesto es entero y las reglas cruzadas se cumplen. Evidencia:
- [ ] **Errores accesibles.** Cada campo con error tiene `aria-invalid="true"` y `aria-describedby` hacia su mensaje; el botón deshabilitado explica por qué. Evidencia:
- [ ] **Sin HTML crudo.** No hay `dangerouslySetInnerHTML` ni asignaciones a `innerHTML` en `src/`. Evidencia:
- [ ] **Sin secretos en el cliente.** Ningún token, clave ni contraseña en `src/`, `index.html` o variables `VITE_*`. Evidencia:
- [ ] **Cabeceras de seguridad.** `npm run preview` responde con `Content-Security-Policy`, `X-Content-Type-Options: nosniff` y `Referrer-Policy: no-referrer` (revisado con las herramientas del navegador o `curl -I`). Evidencia:
- [ ] **Calidad.** `npm run verify` termina sin errores y ningún archivo oficial fue modificado. Evidencia:
