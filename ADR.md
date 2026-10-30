# ADR-001 · Herramienta de pruebas de interfaz para «Seguros del Valle»

- **Estado:** Propuesta
- **Fecha:** 2026-10-30
- **Equipo:** Cypress (John Erick Hoyos)

## Contexto

Seguros del Valle es una aseguradora de Cali con un equipo de tecnología de 11 personas: ocho desarrolladores Java y tres
testers. Tienen 600 pruebas de interfaz en Selenium WebDriver (Java) que corren en una Selenium Grid propia, ya pagada y
operada por infraestructura. Cerca del 30 % de esas pruebas se rompe cada vez que cambia la interfaz y mantenerlas cuesta
dos días por sprint. Prueban en Chrome, Edge y Firefox, y tienen una aplicación móvil nativa sin automatizar. El equipo no
conoce TypeScript, y una migración completa detendría las entregas durante un trimestre.

## Opciones consideradas

Selenium (con Mocha en el duelo; Java en el cliente), Cypress y Playwright. Como la pregunta de la gerencia es «¿vale la
pena migrar?», cada opción se leyó así: **Selenium = quedarse y mejorar**, **Playwright = migrar (de golpe o por partes)**,
**Cypress = migrar a otro lenguaje**. La matriz está en [`MATRIZ.md`](MATRIZ.md).
Criterios que más pesaron: **Encaje (20)** y **Costo total (20)**, que incluye el costo de migrar; luego **Cobertura (15)**
y **Estabilidad (15)**.

## Decisión

Recomendamos **quedarse con Selenium WebDriver en Java y mejorar las pruebas que ya tienen**, con un piloto de
**Playwright para Java** solo en módulos nuevos (migración por partes, sin detener entregas). Selenium ganó la matriz con
3,90 frente a 3,35 de Playwright y 2,35 de Cypress porque es el único que encaja con el lenguaje del equipo, ya usa la Grid
pagada y tiene camino hacia la app móvil con Appium. El problema del 30 % de roturas se ataca primero con selectores
estables y esperas explícitas, que no requieren cambiar de herramienta. Cypress queda descartado: solo admite
JavaScript/TypeScript y no usa la Grid. En nuestra máquina tardó 3,28 veces lo que tardó el control de Playwright.

## Consecuencias

- **Lo que ganamos:** no se detienen las entregas; se aprovechan las 600 pruebas, la Grid y lo que el equipo ya sabe de Java;
  queda abierta la automatización móvil con Appium (mismo protocolo WebDriver).
- **Lo que perdemos o se complica:**
  - Selenium no espera solo: las esperas explícitas hay que seguir escribiéndolas, y una espera mal puesta da pruebas inestables.
  - El diagnóstico sigue siendo pobre de fábrica: no hay capturas ni trazas sin armarlas nosotros (Cypress y Playwright sí las traen).
  - El refactor también cuesta: durante 2 o 3 sprints parte de los dos días de mantenimiento se irán en reorganizar en lugar de bajar.
  - El piloto de Playwright obliga a convivir con dos herramientas por un tiempo.
- **Lo que tendremos que hacer:** acordar con desarrollo atributos `data-testid` en la interfaz; reorganizar las pruebas en
  Page Objects; reemplazar `Thread.sleep` por esperas explícitas; agregar capturas al fallar (en el `@After` de JUnit o TestNG);
  medir cada sprint el porcentaje de pruebas rotas; y escoger un módulo nuevo para el piloto de Playwright Java.

## Qué nos haría cambiar de opinión

- Si después de tres sprints de refactor sigue rompiéndose más del 15 % de las pruebas con cada cambio de interfaz, o el
  mantenimiento sigue por encima de un día por sprint.
- Si en el piloto las pruebas en Playwright Java se rompen menos de la mitad de veces que las de Selenium en el mismo módulo:
  ahí conviene migrar por partes de forma ordenada.
- Si infraestructura deja de operar la Grid o su contrato vence: se pierde una de las razones más fuertes para quedarse.

## ¿Con capa BDD (Cucumber) o sin ella?

**Sin ella, por ahora.** En el tablero, el equipo de Playwright + Cucumber necesitó 109 líneas contra 48 del control
(2,3 veces más), tardó 1,10 veces el control y perdió la captura y la traza que el control trae configuradas. Además tuvo
que armar a mano el navegador y la lectura de `alert()`. En Seguros del Valle, los archivos `.feature` los leerían los tres
testers y los desarrolladores, que ya leen Java; no hay analistas de negocio escribiendo en Dado/Cuando/Entonces. Sumar
Cucumber-JVM en medio del refactor aumentaría el costo sin resolver el dolor principal (las roturas).

## Evidencia usada

- Tablero de la clase, consultado el 2026-10-__ a las __:__ :
  - Nuestro kit (Cypress): 5/5 corridas, mediana 10,96 s, control 3,34 s (3,28 veces el control), 46 líneas, diagnóstico 5/5.
  - Equipo Playwright + Cucumber: 5/5 corridas, 1,10 veces el control, 109 líneas, diagnóstico 3/5.
  - ⟨Equipo de Selenium: corridas, veces el control, diagnóstico⟩.
- Documentación consultada:
  - Selenium Grid: https://www.selenium.dev/documentation/grid/ · Esperas en Selenium: https://www.selenium.dev/documentation/webdriver/waits/
  - Playwright para Java: https://playwright.dev/java/docs/intro · Playwright con Selenium Grid (experimental): https://playwright.dev/docs/selenium-grid
  - Navegadores en Cypress: https://docs.cypress.io/app/references/launching-browsers
  - Appium (móvil nativo con WebDriver): https://appium.io
  - Estándar W3C WebDriver: https://www.w3.org/TR/webdriver2/
