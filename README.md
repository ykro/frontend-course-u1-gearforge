# GearForge Studio — Proyecto base del alumno (Curso 2, Unidad 1)

GearForge Studio es un configurador de workstations para un estudio de diseño en Guatemala: un catálogo de componentes con filtros, una build que suma precio y consumo, un panel de compatibilidad y un formulario para pedir cotización. Usa React 19, Vite, TypeScript estricto, Tailwind CSS v4, componentes de shadcn/ui copiados en `src/components/ui`, React Hook Form y Zod 4.

La tarjeta de cada componente (`PartCard`), los tipos del dominio, el catálogo de demostración, el resumen de la build (`BuildSummary`), el panel de compatibilidad, las maquetas del catálogo y de los dos formularios y la composición de la pantalla (`App`) ya funcionan. Tu trabajo tiene dos partes: el **taller guiado** y el **reto autónomo**.

## Primeros pasos

Necesitas Node.js 24 (`.nvmrc`). En la raíz de tu repositorio:

```bash
npm ci              # instala las versiones exactas de package-lock.json
npm test            # al inicio: 2 tests en verde (demo), el resto en rojo
npm run dev         # la app en http://localhost:5173
npm run verify      # typecheck, lint, format:check, test y build, en ese orden
```

Antes de entregar corre siempre `npm run verify`. Si `format:check` falla, ejecuta `npm run format`.

## Estructura de tests

| Archivo | Qué contiene | Estado inicial |
| :--- | :--- | :--- |
| `tests/setup.ts` | Setup oficial: matchers de Testing Library, limpieza entre tests y red bloqueada | No lo modifiques |
| `tests/factories.ts` | Fábricas oficiales de componentes de prueba (`makeCpu`, `makePsu`, `makeCompatibleBuild`...) | No lo modifiques |
| `tests/demo.test.tsx` | 2 tests de la demo | Verde |
| `tests/workshop.test.tsx` | 18 tests del taller guiado | Rojo |
| `tests/challenge.test.tsx` | 8 tests **públicos** del reto (una muestra) | Rojo |
| `tests/student/my-scenarios.test.tsx` | Tus tests propios (2 plantillas que fallan) | Rojo |

Los archivos oficiales (`tests/setup.ts`, `tests/factories.ts`, `tests/*.test.tsx`), la configuración del proyecto y `.github/workflows/ci.yml` no se modifican. El calificador usa siempre su propia copia y reporta cualquier cambio como sospecha de integridad. Tú editas `src/` y `tests/student/`.

## Parte 1. Taller guiado (60 minutos)

Trabaja en la raíz de tu repositorio y sigue el codelab publicado en el material de la unidad. Implementarás, con el código guiado paso a paso:

1. `filterParts` en `src/domain/catalog.ts`: filtros multicriterio y orden, como función pura.
2. `selectPart`, `removePart`, `buildTotals` y `missingParts` en `src/domain/build.ts`: actualizaciones inmutables y valores derivados de la build. `BuildSummary` ya viene hecho y los usa; mientras no los implementes, `buildTotals` y `missingParts` devuelven un valor provisional para que la app no se caiga.
3. El estado de `Catalog` (`src/components/Catalog.tsx`): la maqueta ya trae los filtros, el conteo y la lista; tú guardas los filtros en un `useState` y derivas la lista visible con `filterParts`, sin `useEffect`.
4. Un formulario guiado con React Hook Form y Zod 4: `createPresetSchema` en `src/domain/preset.ts` y la conexión de la maqueta de `SavePresetForm` (`src/components/SavePresetForm.tsx`): dos campos con `register`, una casilla con `Controller` y un error accesible. Es el mismo patrón que usarás en la parte C del reto.

Al terminar, `tests/demo.test.tsx` y `tests/workshop.test.tsx` quedan en verde.

## Parte 2. Reto autónomo: compatibilidad y cotización

Calcula entre 2 y 3 horas para el reto, más 45 minutos para tus tests propios y 45 minutos para los documentos. En total, de 3 h 30 min a 4 h 30 min (270 minutos como máximo). El reto tiene tres partes y no tiene código guiado, pero es transferencia cercana del taller: la parte C repite el patrón del formulario del paso 7. Ya existen los tipos (`CompatibilityIssue`, `BuildOrder`, `OrderFormValues` en `src/domain/types.ts`), los mensajes (`src/domain/order-messages.ts`), el panel que muestra los problemas (`CompatibilityPanel` y `describeIssue`) y la maqueta del formulario (`BuildOrderForm` con `OrderField` y `DeliveryOptions`). Implementa lo que sigue.

### A. Compatibilidad: `requiredPsuWatts` y `checkCompatibility` en `src/domain/compatibility.ts`

#### `requiredPsuWatts(totalWatts)`

Potencia mínima de fuente para un consumo `totalWatts` (entero mayor o igual que 0): el **menor múltiplo de 50 W que sea mayor o igual que el consumo más el 30 %**. Con 0 W devuelve 0.

| Consumo | Consumo + 30 % | Resultado |
| ---: | ---: | ---: |
| 0 | 0 | 0 |
| 100 | 130 | 150 |
| 450 | 585 | 600 |

#### `checkCompatibility(build)`

Devuelve un arreglo nuevo con los problemas de la build, **en este orden** y sin repetir códigos. Cada regla se evalúa solo si están presentes los componentes que compara; una build sin problemas devuelve `[]`. No modifica la build recibida.

| Orden | Código | Cuándo | Campos |
| :---: | :--- | :--- | :--- |
| 1 | `SOCKET_MISMATCH` | Hay procesador y placa madre, y sus `socket` son distintos | `cpuSocket`, `boardSocket` |
| 2 | `MEMORY_TYPE_MISMATCH` | Hay memoria y placa madre, y `memory.memoryType` es distinto de `motherboard.memoryType` | `memoryType`, `boardMemoryType` |
| 3 | `NOT_ENOUGH_SLOTS` | Hay memoria y placa madre, y `memory.modules` es mayor que `motherboard.memorySlots` | `modules`, `slots` |
| 4 | `PSU_TOO_WEAK` | Hay fuente y `psu.capacityWatts` es **menor** que `requiredPsuWatts(consumo)`; el consumo es `buildTotals(build).watts`, es decir, la suma de todos los componentes salvo la fuente. Una fuente con exactamente la potencia requerida alcanza | `requiredWatts`, `capacityWatts` |

Ejemplo: `{ code: "PSU_TOO_WEAK", requiredWatts: 600, capacityWatts: 550 }`.

### B. `createOrderSchema({ totalGtq })` en `src/domain/order.ts`

Devuelve un esquema de Zod 4 que convierte `OrderFormValues` (entrada) en `BuildOrder` (salida). `totalGtq` es el precio total de la build.

| Campo | Regla | Mensaje si falla |
| :--- | :--- | :--- |
| `customerName` | Se recortan los espacios de los extremos; de 3 a 80 caracteres ya recortado | `ORDER_MESSAGES.customerName` |
| `email` | Se recortan los espacios y se pasa a minúsculas; después debe ser un correo válido | `ORDER_MESSAGES.email` |
| `budgetGtq` | Número entero mayor que 0 (`NaN`, decimales, 0 y negativos fallan) | `ORDER_MESSAGES.budget` |
| `budgetGtq` | Como máximo `MAX_BUDGET_GTQ` (500,000) | `ORDER_MESSAGES.budgetMax` |
| `delivery` | `"pickup"` (recoger en tienda) o `"delivery"` (envío a domicilio) | (no aplica: lo elige un grupo de radios) |

Reglas cruzadas, con `superRefine` (las dos se reportan si ambas fallan):

| Regla | Ruta del error | Mensaje |
| :--- | :--- | :--- |
| El presupuesto debe cubrir el total: `budgetGtq >= totalGtq` (igual alcanza) | `budgetGtq` | `budgetBelowTotalMessage(totalGtq)`, por ejemplo "El presupuesto no cubre el total de la build (Q12,200.00)." |
| Si `delivery` es `"delivery"`, la dirección recortada debe tener de 10 a 160 caracteres | `address` | `ORDER_MESSAGES.address` |

Salida (`BuildOrder`): `customerName` y `email` normalizados, `budgetGtq` como número, `delivery` y `address`: la dirección recortada si `delivery` es `"delivery"`, o `null` si es `"pickup"` (aunque haya quedado texto escrito en el campo). Zod evalúa las reglas cruzadas cuando los campos ya tienen el tipo correcto: si el presupuesto está vacío (`NaN`), primero verás ese error.

### C. Conectar `BuildOrderForm` (`src/components/BuildOrderForm.tsx`)

Props: `build: Build` y `onSubmit: (order: BuildOrder) => void`. La maqueta ya pinta el formulario con su nombre accesible, los campos con sus etiquetas y el botón; no la rediseñes, conéctala. Usa React Hook Form con `zodResolver(createOrderSchema({ totalGtq }))`, donde `totalGtq` es `buildTotals(build).priceGtq`; si la build cambia, el esquema debe usar el total nuevo.

| Elemento | Rol y nombre accesible | Qué ya trae la maqueta |
| :--- | :--- | :--- |
| Formulario | `form` "Datos de la cotización" | Completo; falta el envío con `handleSubmit` |
| Nombre, correo y presupuesto | `textbox` "Nombre completo", `textbox` "Correo" y `spinbutton` "Presupuesto en quetzales" | `OrderField`: recibe las props de `register(...)` y el `error` del campo, y ya pone `aria-invalid` y `aria-describedby` cuando hay error. El presupuesto debe llegar como número |
| Entrega | dos `radio`: "Recoger en tienda" (`pickup`, seleccionado al inicio) y "Envío a domicilio" (`delivery`) | `DeliveryOptions`: un `RadioGroup` de Radix, que no es un `<input>` nativo. Se controla con `value` y `onValueChange` |
| Dirección | `textbox` "Dirección de envío": existe solo mientras está elegido "Envío a domicilio" | Hoy se muestra siempre |
| Aviso de bloqueo | párrafo con `ORDER_MESSAGES.blocked` | Hoy se muestra siempre |
| Enviar | `button` "Solicitar cotización" | Hoy nunca se deshabilita |

Comportamiento:

1. **Build lista.** La build está lista si no le falta ningún obligatorio (`missingParts(build)` vacío) y `checkCompatibility(build)` no reporta problemas. Si no está lista, el botón está deshabilitado y su descripción accesible es exactamente `ORDER_MESSAGES.blocked`. Si está lista, el aviso no aparece y el botón queda habilitado.
2. **Validación al enviar.** Al pulsar el botón se valida con el esquema. Cada campo con error tiene `aria-invalid="true"` y su descripción accesible (`aria-describedby`) es exactamente el mensaje de su error; los campos sin error no tienen `aria-invalid="true"`. Mientras haya errores no se llama a `onSubmit`.
3. **Envío.** Si todo es válido, se llama a `onSubmit` una sola vez con el `BuildOrder` ya transformado como primer argumento.

### Restricciones de arquitectura (ver `AGENTS.md`)

Funciones del dominio puras e inmutables; nada de `useEffect` para derivar estado; sin `dangerouslySetInnerHTML`; los mensajes salen de `src/domain/order-messages.ts`.

### Tus tests propios

Tus tests propios suman si pasan contra la solución de referencia y detectan mutantes que la suite pública no detecta (errores sembrados en el reto). Reescribir un test público no suma. Los errores sembrados se agrupan por concepto: varios errores del mismo concepto cuentan como uno, así que dos tests que atrapan el mismo concepto valen la mitad. Para el puntaje completo, detecta errores de 2 conceptos distintos del reto. Reemplaza las 2 plantillas de `tests/student/my-scenarios.test.tsx` por al menos 2 tests con nombres que digan qué verifican. Usa las fábricas de `tests/factories.ts` y consultas por rol.

### Decisiones y checklist

Responde `ARCHITECTURE_DECISIONS.md` (incluye ampliar `AGENTS.md` con una regla propia y la declaración de uso de IA) y marca con criterio `SECURITY_AND_QUALITY.md`.

## Cómo se califica (100 puntos)

| Componente | Puntos | Cómo se mide |
| :--- | ---: | :--- |
| Taller guiado | 20 | `tests/workshop.test.tsx`, proporcional |
| Reto, tests públicos | 10 | `tests/challenge.test.tsx`, proporcional |
| Reto, tests ocultos | 30 | tests ocultos, proporcional |
| Tests propios | 15 | pasan contra la referencia y detectan mutantes que la suite pública no detecta; los errores sembrados se agrupan por concepto: 2 conceptos distintos detectados = completo, 1 = mitad |
| ADR y checklist | 15 | revisión manual: ADR 10, checklist 2, sección propia de `AGENTS.md` 2 y declaración de uso de IA 1 |
| Calidad e integridad | 10 | `typecheck`, `lint` y `format:check` limpios (5) + sin sospechas de integridad (5) |
| **Total** | **100** | |

**La nota no sale de tu CI.** El workflow de GitHub Actions solo te da retroalimentación. El calificador del curso calcula la nota sobre una copia limpia del proyecto: toma tu `src/`, tus tests propios y tus documentos, y corre los tests oficiales más un conjunto de **tests ocultos** del reto con otros datos y más casos borde. Te lo decimos de frente para que no pierdas tiempo: memorizar las respuestas de `challenge.test.tsx` o detectar si el código corre bajo el runner de pruebas no sirve, y además se reporta. Implementa el contrato completo y pruébalo con tus propios casos.

Se marca como sospecha de integridad: modificar archivos oficiales (tests, setup, fábricas, configuración o workflow), agregar archivos fuera de `src/` y `tests/student/`, y que tu código use `eval`, `Function`, `import()` dinámico, módulos de Node como `fs` o `child_process`, `process.exit` o `process.env` con nombres dinámicos, manipule prototipos, mencione el runner de pruebas o concatene literales de texto con `+` (usa plantillas de texto).

<!-- texto-escaner:inicio (generado por scripts/texto_escaner.py; no editar a mano) -->

### Qué marca el escáner del calificador

El calificador revisa tu código y tus tests antes de correrlos. Si encuentra algo de esta lista, tu nota queda **retenida** hasta que el docente la revise: no pierdes puntos automáticamente, pero tampoco se publica. Nada de esto hace falta para resolver los retos.

**Por qué existe.** Tus tests corren en la misma máquina que los tests ocultos. Lo que se marca es lo que permitiría leer esos tests, cambiar el resultado de las pruebas o salir a internet desde el calificador.

**En este proyecto (TypeScript).**

- Se marca: importar módulos de Node con acceso al sistema (`fs`, `child_process`, `os`, `net`, `http`, `vm`, `worker_threads`…; sí puedes `crypto`, `path`, `url`, `util`, `events`, `buffer`, `assert`, `timers`); `import()` o `require()` con un nombre calculado; `eval` y `Function()`; `process.argv`, `process.exit`, `process.binding`, `process.env[nombre calculado]`; `globalThis`, `window` o `process` indexados con un nombre calculado; `__proto__` y `constructor.constructor`; en `src/`, mencionar el runner (`vitest`, `junit`, `AWA_`, `afterAll(`), también armado por partes; en tests, `process.cwd`, `__dirname`, `import.meta.url`.
- Sí puedes unir textos (`"btn " + "primary"`), usar rutas como `/sitemap.xml` y `window["dataLayer"]`.

**En todos los proyectos** se marca además: modificar o borrar archivos oficiales, agregar archivos fuera de tus carpetas, enlaces simbólicos, y archivos como `sitecustomize.py`, `pytest.ini`, `init.gradle` o `.npmrc`. Y tus tests deben dar siempre el mismo resultado: un test que falla al azar no cuenta.

<!-- texto-escaner:fin -->

## Uso de asistentes de IA

Puedes usar asistentes de IA. Eres responsable de todo lo que entregas: revisa que el código cumpla el contrato y `AGENTS.md`, y declara cómo los usaste en `ARCHITECTURE_DECISIONS.md`.
