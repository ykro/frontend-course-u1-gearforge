# AGENTS.md — Reglas para asistentes de IA en GearForge Studio (Unidad 1)

Este archivo le da contexto permanente a cualquier asistente de código que trabaje en el repositorio. Es una base: como parte de tu entrega debes ampliarlo con al menos una regla propia (ver `ARCHITECTURE_DECISIONS.md`, pregunta 5).

## 1. Entorno y comandos

- Node.js 24 (`.nvmrc`) y npm. Instala con `npm ci`; no cambies versiones ni agregues dependencias sin que la persona lo pida.
- Comandos: `npm run dev`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`, `npm run verify`.
- TypeScript estricto: prohibido `any`, `@ts-ignore` y `as` para silenciar errores. Si un tipo no encaja, corrige el modelo o usa narrowing.

## 2. Capas

- `src/domain/` es TypeScript puro: tipos, reglas y esquemas de Zod. No importa React ni componentes.
- `src/components/` contiene componentes de React. La lógica de negocio vive en `src/domain/` y los componentes la llaman.
- `src/components/ui/` son componentes de shadcn/ui copiados al repositorio. Se usan por composición; no les agregues lógica de negocio.
- `App` es la única dueña del estado de la build. Los hijos reciben datos y callbacks por props.

## 3. Estado e inmutabilidad

- Nunca mutes props ni estado: nada de `push`, `splice`, `sort` en sitio ni asignar propiedades de un objeto recibido. Crea arreglos y objetos nuevos (`toSorted`, `filter`, `map`, spread).
- Todo lo que se pueda calcular a partir del estado se calcula durante el render (estado derivado). Prohibido `useEffect` + `useState` para sincronizar datos derivados.
- Las listas usan como `key` el `id` estable del dato, nunca el índice.

## 4. Formularios y validación

- Los formularios usan React Hook Form con `zodResolver`. Los tipos de entrada y salida coinciden con `OrderFormValues` y `BuildOrder`.
- Los mensajes de error salen de `src/domain/order-messages.ts`, sin copiarlos a mano.
- Cada campo con error lleva `aria-invalid="true"` y `aria-describedby` hacia el texto del error.
- Los campos de texto de la cotización usan `OrderField` (ya resuelve el error accesible); los componentes de Radix que no son `<input>` nativos (`RadioGroup`, `Checkbox`) se conectan con `Controller`, no con `register`.

## 5. Pruebas

- No modifiques `tests/setup.ts`, `tests/factories.ts`, `tests/*.test.tsx`, la configuración del proyecto ni `.github/workflows/ci.yml`.
- Los tests propios viven en `tests/student/`, usan las fábricas oficiales y consultas por rol (`getByRole`), no usan la red ni leen archivos.
- Ningún código de `src/` puede detectar si corre bajo el runner de pruebas.

## 6. Seguridad y estilo

- Sin `dangerouslySetInnerHTML` ni asignaciones a `innerHTML`: React ya escapa el texto (ESLint lo bloquea).
- Ningún secreto, token ni credencial en el código: todo lo que va en `src/` termina en el navegador.
- Solo modo claro: no agregues variantes `dark:` ni media queries de tema oscuro.
- Textos de la interfaz en español de Guatemala; identificadores en inglés.

## 7. Reglas propias del alumno

(Agrega aquí tus reglas y explica su efecto en `ARCHITECTURE_DECISIONS.md`.)
