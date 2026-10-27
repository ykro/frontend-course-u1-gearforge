# Decisiones de arquitectura — GearForge Studio (Unidad 1)

Responde con tus palabras y con ejemplos de tu propio código. Respuestas genéricas que podrían aplicar a cualquier proyecto reciben poco puntaje. Extensión sugerida: de 3 a 8 líneas por pregunta. Puntos (15 en total, con el checklist): preguntas 1 a 4 (ADR), 10; pregunta 5 (tu sección de `AGENTS.md`), 2; pregunta 6 (declaración de IA), 1; `SECURITY_AND_QUALITY.md`, 2. Puntos (15 en total, con el checklist): preguntas 1 a 4 (ADR), 10; pregunta 5 (tu sección de `AGENTS.md`), 2; pregunta 6 (declaración de IA), 1; `SECURITY_AND_QUALITY.md`, 2.

## 1. Estado derivado

La lista visible del catálogo, los totales de la build y los problemas de compatibilidad no se guardan en `useState`. ¿Qué pasaría si los guardaras en un estado aparte y los sincronizaras con `useEffect`? Usa un caso concreto de tu app (qué ve el usuario y en qué render).

**Tu respuesta:**

> 

## 2. Inmutabilidad y `Object.is`

¿Por qué `selectPart` y `filterParts` devuelven objetos y arreglos nuevos? Explica qué compara React con `Object.is` y qué verías en pantalla si `selectPart` hiciera `build.cpu = part` y devolviera la misma build.

**Tu respuesta:**

> 

## 3. Zod en tiempo de ejecución

Los tipos de TypeScript desaparecen al compilar. ¿Qué garantiza `createOrderSchema` que el tipo `OrderFormValues` no puede garantizar? Explica por qué la regla del presupuesto contra el total va en `superRefine` y por qué el esquema recibe `totalGtq` como parámetro.

**Tu respuesta:**

> 

## 4. Tus tests propios

Para cada test de `tests/student/my-scenarios.test.tsx`: ¿qué error plausible del reto atrapa? Describe un cambio concreto en `src/` que lo haría fallar.

**Tu respuesta:**

> 

## 5. Tu regla en AGENTS.md

Copia la regla que agregaste a `AGENTS.md`. Describe qué generó el asistente de IA antes de tener esa regla y qué cambió después (si no usaste asistente, explica qué error evitaría la regla).

**Tu respuesta:**

> 

## 6. Declaración de uso de IA

Completa con honestidad; declarar el uso no resta puntos, ocultarlo sí.

- Herramientas usadas (o "ninguna"):
- Partes del trabajo en las que las usaste:
- Algo que el asistente propuso y aceptaste después de verificarlo:
- Algo que el asistente propuso y corregiste o rechazaste, y por qué:
