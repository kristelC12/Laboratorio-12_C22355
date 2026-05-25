# Tests del componente WeatherTime

Este proyecto incluye pruebas para el componente `weather-time`. A continuación se explica, en lenguaje sencillo, la función de cada test que está en `src/components/WeatherTime.test.js`.

- **Se registra como custom element**: comprueba que el componente está correctamente definido en `customElements`.

- **Tests unitarios**:
	- *city usa Liberia por defecto*: verifica que la propiedad `city` devuelve `Liberia` si no se suministra ninguna ciudad.
	- *temperature y condition devuelven null sin datos*: asegura que, antes de hacer la petición a la API, las propiedades derivadas `temperature` y `condition` son `null`.
	- *condition usa forecast[0].description si no hay description raíz*: simula una respuesta de la API para comprobar que `condition` toma el primer elemento de `forecast` cuando no existe `description` en el nivel raíz.

- **Tests de integración** (simulan la interacción completa con `fetch`):
	- *crea un shadow root y renderiza el panel*: valida que el componente crea un `shadowRoot` y que se renderiza el elemento con la parte `panel`.
	- *muestra temperatura y condición al resolver fetch*: mockea `fetch` con datos de ejemplo y comprueba que la UI muestra la temperatura y la descripción recibidas.
	- *consulta la API de la ciudad actual y renderiza su respuesta*: el mock de `fetch` responde distinto según la ciudad (por ejemplo `Liberia` y `Nicoya`), y el test verifica que el componente muestra la información correspondiente a la ciudad consultada.
	- *muestra error cuando fetch falla*: fuerza que `fetch` falle y verifica que el componente muestra un mensaje de error.
	- *muestra 'Cargando...' mientras fetch no resuelve*: simula una petición de red lenta y comprueba que la interfaz muestra el texto de carga mientras no hay respuesta.

Estas pruebas combinan casos aislados (unitarios) y casos que comprueban la integración con la API (mockeando `fetch`) para garantizar que `weather-time` funciona correctamente en diferentes situaciones.

Cómo ejecutar las pruebas:

```bash
pnpm install
pnpm test
```

