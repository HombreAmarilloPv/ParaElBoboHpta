# Entrega · Duelo de herramientas

**Equipo:** Cypress  
**Integrantes:** John Erick Hoyos  
**Repositorio:** https://github.com/HombreAmarilloPv/ParaElBoboHpta  
**Herramienta que nos tocó:** ☐ Selenium + Mocha &nbsp; ☑ Cypress &nbsp; ☐ Playwright + Cucumber  
**Escenario que nos tocó:** E3 · Seguros del Valle — Aseguradora con 600 pruebas heredadas en Selenium

> Completa este archivo a medida que avanzas (cada sección dice en qué parte de la guía se llena).
> Lo que se mide con números lo guarda el medidor en `medidas.json`; aquí va lo que un número no dice.
> Escribe con tus palabras: las respuestas copiadas de la guía, de otro equipo o de un asistente sin pasar por tu criterio no cuentan.

Archivos que entregan, todos en el repositorio y con `git push`:

| Archivo | Quién lo escribe | Parte |
|---|---|---|
| `ENTREGA.md` (este) | ustedes | 1 a 6 |
| `autoinforme.json` | ustedes (minutos y diagnóstico) | 2 a 4 |
| `medidas.json` y `medidas-control.json` | los genera el medidor (`npm run medir`) | 4 |
| `MATRIZ.md` | ustedes | 5 |
| `ADR.md` | ustedes | 6 |
| Las pruebas de su kit (las tres historias) | ustedes | 1 a 3 |

---

## 1. Qué hace la herramienta por nosotros (Parte 1)

Lean el ejemplo resuelto (US-01 CA1) en su kit, **línea por línea**, y los archivos de `soporte` o de configuración
que vienen con él. Para cada tarea que alguien debe cumplir en una prueba de interfaz, digan **quién la hace**:
*la herramienta sola*, *una librería que hubo que sumar* (¿cuál?) o *código nuestro*. Escriban el archivo y la línea.

| Tarea | ¿Quién la hace? | ¿Dónde lo vemos? (archivo y línea) |
|---|---|---|
| Abrir el navegador y cerrarlo al terminar | **La herramienta sola** (no hay ninguna línea nuestra que lo haga) | `package.json` script `test`: `cypress run --browser chrome`; `cypress.config.js` L5 (`baseUrl`) y L9-10 (tamaño de ventana) |
| Esperar a que el elemento exista o se pueda usar | **La herramienta sola:** cada comando (`cy.get`, `cy.contains`, `click`) espera hasta 4 s | `cypress/e2e/duelo.cy.js` L13 (`cy.get('h3')`); L25-28 (`within`, `clear().type(7)`, `click`) |
| Reintentar una comprobación que todavía no se cumple | **La herramienta sola:** `.should()` reintenta el comando y la aserción | `duelo.cy.js` L12 (el comentario lo dice) y L13 `.should('have.length', 8)`; L56-58 (la fila Descuento) |
| Ejecutar las pruebas, contarlas y decir cuántas pasaron | **La herramienta sola:** Cypress trae su ejecutor (usa Mocha por dentro: `describe` / `it`) | `duelo.cy.js` L7 y L9; tabla final de `cypress run` con «Passing: 3» (es lo que lee `kit.json`) |
| Comprobar un valor y mostrar «esperado» y «recibido» | **La herramienta sola:** trae Chai incluido (`should('have.length', …)`, `contain.text`) | `duelo.cy.js` L13 → «Found '8', expected '9'» |
| Leer el texto de un `alert()` del navegador *(lo descubren en la Parte 2)* | **Código nuestro** con piezas de la herramienta: Cypress acepta el `alert()` solo, pero para leer su texto hay que escuchar el evento y espiarlo con un *stub* (Sinon, incluido) | `duelo.cy.js` L23 (`cy.stub().as('aviso')`), L24 (`cy.on('window:alert', aviso)`), L29 (`calledWithMatch`) |
| Dejar evidencia (captura, video o traza) cuando una prueba falla | **La herramienta sola** para la captura (en `cypress run` la toma al fallar); el video está apagado por la configuración del kit | Carpeta `cypress/screenshots/` que aparece al fallar; `cypress.config.js` L7 (`video: false`) |

**Con esta tabla:** ¿la herramienta que nos tocó es una *librería*, un *framework*, o una librería con piezas que
tuvimos que armar nosotros? Respondan en dos frases con la idea «la librería la llamas tú; el framework te llama a ti».

> _Respuesta:_ Cypress es un **framework**: nosotros no abrimos el navegador ni llamamos al ejecutor; escribimos `it(...)`
> y Cypress nos llama, espera, reintenta, compara y deja la captura. Lo único que tuvimos que armar fue la lectura del
> `alert()` con un *stub*, y aun así con piezas que Cypress ya trae.

## 2. Bitácora de las historias (Partes 2 y 3)

Una columna por historia. «Minutos» son los mismos que anotan en `autoinforme.json`: desde que empiezan a escribir
hasta que ven la prueba en verde.

| | US-04 CA2 (7 mochilas, stock 6) | US-09 CA1 (DESC10) |
|---|---|---|
| Minutos hasta el verde | 10 | 30 |
| Primer intento que **no** funcionó: qué escribimos y qué dijo la herramienta | Buscamos el aviso en la página con `cy.contains('Solo hay 6 unidades')` y Cypress respondió `Expected to find content: 'Solo hay 6 unidades' but never did`, porque el texto está en un `alert()` y no en la página | Buscamos el campo «Código de descuento» dentro del contenedor equivocado y Cypress respondió `Expected to find element: input[placeholder="Código de descuento"], but never found it`. Lo resolvimos ubicando primero la tarjeta por su título «Carrito» (`cy.contains('h2', 'Carrito').parent()`) |
| Mensaje de error que nos ayudó (o que nos confundió) | Confundió al principio: no dice que hubo un `alert()`. Ayudó el registro de comandos, donde se ve el `window:alert`, y la pista de la guía de usar `cy.on` con un *stub* | Ayudó: dice desde qué elemento buscó (`Queried from`), y así vimos que estábamos dentro del contenedor equivocado |
| Qué tuvimos que buscar en la documentación (enlace) | Eventos del navegador (`window:alert`): https://docs.cypress.io/api/cypress-api/catalog-of-events · Stubs: https://docs.cypress.io/api/commands/stub | `within`: https://docs.cypress.io/api/commands/within · `siblings`: https://docs.cypress.io/api/commands/siblings |
| Qué haría distinto un equipo con más experiencia en esta herramienta | Pondría el stub y la búsqueda de la tarjeta en un comando propio (`Cypress.Commands.add`) para reutilizarlo | Usaría atributos `data-cy` en la tienda en lugar de depender de `.parent()`, que se rompe si cambia el diseño; quitaría el `.should('be.visible').and('be.enabled')` antes del clic, porque `click` ya lo espera solo |

**Lo más distinto frente a US-01 CA1** (el ejemplo resuelto): ¿qué cambió al leer un `alert()`, al elegir *dentro de
una tarjeta* y al leer un valor del carrito? Piensen en esperas, selectores y en cómo leyeron el resultado.

> _Respuesta:_ En US-01 bastaba `cy.get('h3').should(...)`. En US-04 el resultado no está en la página: hubo que preparar
> el *stub* **antes** del clic y comprobar el *stub*, no un elemento. En los selectores pasamos de buscar en toda la
> página a buscar dentro de la tarjeta con `cy.contains('h3', 'Mochila escolar').parent().within(...)`, porque hay 8
> botones «Agregar». También usamos `clear()` antes de `type(7)`, porque el campo ya trae un 1 y sin borrarlo habría
> quedado 17. En US-09 la fila «Descuento» aparece después de aplicar el código; no escribimos ninguna espera, el
> `should('contain.text', '6.500')` reintentó hasta que apareció.

## 3. Lo que medimos (Parte 4)

Pega el resumen que imprimió `npm run medir` en tu kit y en el control (Playwright Test):

```text
Midiendo: Cypress · 5 corridas · carpeta kits/cypress
Resumen
  Velocidad ......... mediana 10.96 s  (mínimo 10.62 · máximo 11.23)
  Estabilidad ....... 5 de 5 corridas completas
  Código ............ 35 líneas de pruebas + 11 de soporte = 46
  cypress ........... 16.2.0 instalada · última publicación hace 2 días (v16.2.1)
  Autoinforme ....... minutos {"instalacion":4,"ca2":10,"ca3":30}, diagnóstico 5/5
```

```text
Midiendo: Playwright Test (control) · 5 corridas · carpeta control/playwright
Resumen
  Velocidad ......... mediana 3.34 s  (mínimo 3.31 · máximo 3.47)
  Estabilidad ....... 5 de 5 corridas completas
  Código ............ 34 líneas de pruebas + 14 de soporte = 48
  @playwright/test .. 1.64.1 instalada · última publicación hace 16 días (v1.64.1)
```

- Mediana de nuestro kit: **10,96** s · Mediana del control en **nuestra** máquina: **3,34** s · **Veces el control** (kit ÷ control): **3,28**
- Corridas completas de nuestro kit: **5** de **5**
- Líneas de código (pruebas + soporte): **46** (35 + 11)
- Puntos de diagnóstico (de 5): **5**

**El fallo a propósito.** ¿Qué rompieron y cómo? Pega las primeras 10 líneas de lo que dijo la herramienta y señala
qué ayudaba a encontrar la causa y qué faltaba.

Cambiamos `.should('have.length', 8)` por `.should('have.length', 9)` en `cypress/e2e/duelo.cy.js` (L13) y corrimos `npm test`:

```text
  1) Duelo · tres criterios de aceptación
       US-01 CA1: el catálogo muestra 8 productos:
     AssertionError: Timed out retrying after 4000ms: Not enough elements found. Found '8', expected '9'.
      at Context.eval (webpack:///./cypress/e2e/duelo.cy.js:13:15)

  (Screenshots)
  -  cypress/screenshots/duelo.cy.js/Duelo · tres criterios de aceptación -- US-01 CA1
     el catálogo muestra 8 productos (failed).png
```

**Lo que ayudaba:** nombra la prueba que falló, dice qué comprobación falló con «Found '8', expected '9'», señala
`duelo.cy.js:13`, avisa que reintentó durante 4 s y deja una captura de cómo estaba la página.
**Lo que faltaba:** no hay video (el kit lo apaga) ni una traza para repasar paso a paso sin volver a correr: el
«viaje en el tiempo» de Cypress solo existe en `npm run abrir` (modo interactivo), no queda en el disco.

**Las cinco preguntas del diagnóstico** (se contestan **con el kit tal como llegó**, y el «sí» o «no» va en `autoinforme.json`).
En la última columna digan *de dónde vino* cada evidencia: de la **herramienta** (sola), de la **configuración del kit** o de
**código nuestro**.

| Pregunta (campo en `autoinforme.json`) | ¿Sí o no? | ¿De dónde vino? |
|---|:---:|---|
| ¿El mensaje dice **qué** falló (el elemento o la comprobación), sin que haya que adivinar? (`diceQueFallo`) | Sí | **Herramienta:** nombra la prueba y la aserción («Not enough elements found») |
| ¿Muestra el valor **esperado** y el **recibido**? (`esperadoYRecibido`) | Sí | **Herramienta:** Chai incluido en Cypress («Found '8', expected '9'») |
| ¿Señala la **línea de nuestra prueba** donde falló? (`lineaDeLaPrueba`) | Sí | **Herramienta:** `duelo.cy.js:13` en la pila del error |
| ¿Quedó una **captura de pantalla** (o un video) de la falla en el disco? (`capturaOVideo`) | Sí | **Herramienta:** `cypress run` guarda la captura al fallar en `cypress/screenshots/`. El video lo apaga la **configuración del kit** (`cypress.config.js` L7) |
| ¿Quedó una **traza o un informe** para repasar la falla paso a paso sin volver a correrla? (`trazaOInforme`) | Sí | **Herramienta:** el resumen que imprime `cypress run` (pruebas, tiempos y capturas) junto con la captura. Ojo: no es una traza paso a paso como la de Playwright |

**Tres cosas que nuestra medición NO demuestra** (pistas: cuántas pruebas, cuántas corridas, cuántas máquinas,
qué mide el tiempo, qué cuenta una «línea de código»):

1. **Son 3 pruebas en JavaScript, no 600 en Java.** No dice cuánto costaría mantener o migrar la suite real de Seguros
   del Valle, ni cómo se comporta cada herramienta con 600 pruebas en paralelo en una Grid.
2. **Son 5 corridas en una sola máquina (Windows) y solo en Chrome.** 5 de 5 no demuestra que no haya pruebas
   inestables, y no dice nada de Edge ni de Firefox, que el cliente también usa.
3. **El tiempo y las líneas no miden lo que parecen.** El tiempo incluye el arranque de Cypress y del navegador (en 3
   pruebas eso es casi todo el tiempo), y las líneas no miden lo frágil que es un selector: el 30 % de roturas del
   cliente depende de eso, no de cuántas líneas tenga la prueba.

## 4. Mirando el tablero (Parte 5)

Abran el tablero de la clase (el enlace lo da el docente) y respondan **con datos del tablero**, no con opiniones:

1. ¿Qué herramienta fue más rápida, medida en «veces el control»? ¿Y la más estable? ¿Hubo diferencias grandes **dentro** de una misma herramienta entre equipos? ¿A qué lo atribuyen?
2. ¿Qué herramienta dejó mejor diagnóstico y qué parte vino «de fábrica» o la tuvo que armar el equipo?
3. Un dato del tablero que les pareció raro. ¿Qué preguntarían a ese equipo antes de usarlo como evidencia?

> _Respuestas:_
>
> 1. Según los datos que tenemos, la más rápida fue Playwright: el equipo de Playwright + Cucumber quedó en 1,10× el
>    control, mientras que nuestro Cypress quedó en 3,28×. En estabilidad, los dos equipos que conocemos tuvieron 5/5
>    corridas. ⟨Completar con el dato del equipo de Selenium⟩. Las diferencias dentro de una misma herramienta las
>    atribuimos a la máquina, a correr 5 o 10 corridas y a cómo escribió cada equipo sus pruebas.
> 2. Cypress dejó el mejor diagnóstico: 5/5 en nuestro kit, casi todo de fábrica (mensaje, esperado y recibido, línea y
>    captura). El equipo de Playwright + Cucumber sacó 3/5, porque la captura y la traza no venían y había que armarlas.
>    ⟨Completar con el diagnóstico del equipo de Selenium⟩.
> 3. ⟨Completar con un dato raro del tablero⟩. Antes de usarlo preguntaríamos: ¿cuántas corridas hicieron?, ¿midieron el
>    control en la misma máquina?, ¿midieron contra la tienda local o contra Vercel?, ¿cómo contestaron el diagnóstico?
>    (por ejemplo, si un equipo marcó «traza o informe» con una captura sola, el 5/5 no se compara con el de otro equipo).

## 5. Matriz y decisión (Partes 5 y 6)

☑ `MATRIZ.md` completa (pesos que suman 100, puntajes con evidencia, total y prueba de sensibilidad)  
☑ `ADR.md` completo (una página, con consecuencias negativas y qué nos haría cambiar de opinión)  
☑ `medidas.json`, `medidas-control.json` y `autoinforme.json` en el repositorio, con `git push`

| Criterio | Peso | Selenium | Cypress | Playwright | ¿Por qué ese peso? · Evidencia de los puntajes |
|---|---:|:---:|:---:|:---:|---|
| 1 · Encaje | 20 | 5 | 1 | 3 | El equipo sabe Java, no TypeScript, y ya tiene 600 pruebas en Selenium. [doc] Selenium y Playwright tienen Java; Cypress solo JS/TS |
| 2 · Cobertura | 15 | 5 | 3 | 3 | Chrome, Edge, Firefox y una app móvil nativa. [doc] Las tres cubren los navegadores; solo Selenium tiene camino al móvil con Appium |
| 3 · Estabilidad | 15 | 2 | 4 | 5 | El 30 % de las pruebas se rompe con cada cambio. [tablero] Cypress y Playwright + Cucumber, 5/5 corridas · [exp] no escribimos esperas en Cypress |
| 4 · Diagnóstico | 5 | 2 | 5 | 4 | Hay 3 testers para depurar. [tablero] Cypress 5/5, Playwright + Cucumber 3/5 |
| 5 · Velocidad | 5 | 3 | 3 | 5 | Su problema es el mantenimiento, no el tiempo. [tablero] Cypress 3,28×, Playwright + Cucumber 1,10× el control |
| 6 · Integración | 10 | 5 | 2 | 3 | La Grid ya está pagada. [doc] Selenium la usa tal cual; Playwright solo de forma experimental; Cypress no |
| 7 · Comunidad y futuro | 10 | 5 | 3 | 4 | Es una decisión para años. [doc] WebDriver es estándar del W3C; Playwright lo respalda Microsoft |
| 8 · Costo total | 20 | 3 | 1 | 2 | Hoy pierden 2 días por sprint; migrar todo frena un trimestre. Solo Selenium no exige reescribir las 600 pruebas |
| **Total ponderado** (máx. 5,00) | **100** | **3,90** | **2,35** | **3,35** | Gana Selenium; no cambia en la prueba de sensibilidad (Estabilidad +10, Costo −10: 3,80 contra 3,65) |

**Nuestra recomendación en una frase:**

> _A Seguros del Valle le recomendamos quedarse con Selenium en Java y bajar sus roturas con mejores selectores y esperas,
> probando Playwright para Java solo en módulos nuevos, porque migrar las 600 pruebas costaría un trimestre sin entregas y
> Cypress ni siquiera usa su lenguaje ni su Grid._

## 6. Reflexión

1. Antes de medir, ¿qué herramienta habríamos recomendado? ¿Cambió algo después de ver los datos de **todas** las herramientas? Si la que recomendamos no es la que nos tocó, ¿por qué? Si lo es, ¿qué habría pasado si nos hubiera tocado otra?
2. ¿Qué evidencia nos hizo falta y no pudimos medir en esta actividad (por ejemplo: 300 pruebas en lugar de 3, otros navegadores, un mes de mantenimiento)?
3. En una automatización real, ¿qué parte del esfuerzo creen que es **escribir** las primeras pruebas y qué parte es **mantenerlas**? ¿Qué parte de esto no capta nuestra actividad?
4. Si el cliente fuera la empresa donde quieren trabajar, ¿qué pesos cambiarían en la matriz?
5. Si usaron un asistente de IA: ¿en qué momentos ayudó y en cuáles hubo que corregirlo? ¿Cómo cambia eso lo que significan los minutos de `autoinforme.json`?

>
> 1. Antes de medir habríamos recomendado Cypress o Playwright, porque esperan solos y Cypress nos dio el mejor
>    diagnóstico. Después de ver los datos y el escenario cambiamos: la herramienta que nos tocó es la que peor queda para
>    este cliente (2,35), porque no usa Java ni la Grid. Lo que más pesó no fue la herramienta en sí, sino el costo de
>    migrar 600 pruebas. Si nos hubiera tocado Selenium, quizás lo habríamos defendido por costumbre sin ver lo frágil
>    que es sin esperas automáticas.
> 2. Nos faltó medir con Java en lugar de JavaScript, con cientos de pruebas en una Grid, en Edge y Firefox, y sobre todo
>    medir el mantenimiento: cuántas pruebas se rompen cuando cambia la interfaz, que es justo el dolor del cliente.
> 3. Creemos que escribir las primeras pruebas es la parte pequeña; la grande es mantenerlas. El caso de Seguros del
>    Valle lo muestra: dos días por sprint solo en arreglar pruebas. La actividad mide unos 40 minutos de escritura y no
>    capta qué pasa cuando cambia el diseño de la tienda.
> 4. En una empresa de producto con equipos en JavaScript subiríamos «Encaje» para Cypress o Playwright y bajaríamos
>    «Integración» (no habría una Grid heredada). En una empresa con mucho código heredado, como esta, «Costo total»
>    seguiría siendo de los más pesados.
> 5. Usamos un asistente de IA para resolver errores mientras escribíamos las pruebas (así quedó en `autoinforme.json`) y
>    también para organizar y redactar esta entrega, que luego revisamos. Eso significa que nuestros minutos (10 y 30)
>    son más bajos de lo que serían sin ayuda: no comparan solo la herramienta, también la ayuda que tuvimos.
