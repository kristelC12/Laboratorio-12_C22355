import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./WeatherTime.js";

const MOCK_DATA = {
  temperature: "28 °C",
  description: "Parcialmente nublado",
  forecast: [{ description: "Lluvioso" }],
};

describe("WeatherTime", () => {
  let element;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => MOCK_DATA,
      })
    );

    element = document.createElement("weather-time");
    element.setAttribute("city", "Liberia");
    document.body.append(element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("se registra y crea shadow DOM", () => {
    expect(customElements.get("weather-time")).toBeDefined();
    expect(element.shadowRoot).not.toBeNull();
  });

  it("muestra datos de la API cuando fetch responde bien", async () => {
    await element.init();

    expect(element.shadowRoot.textContent).toContain("28 °C");
    expect(element.shadowRoot.textContent).toContain("Parcialmente nublado");
    expect(element.shadowRoot.querySelector(".error")).toBeNull();
  });

  it("construye la URL con ciudad y guanacaste", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    element.setAttribute("city", "Nicoya");
    await element.init();

    const calledUrl = fetchSpy.mock.calls.at(-1)?.[0];
    expect(calledUrl).toContain("nicoya");
    expect(calledUrl).toContain("guanacaste");
  });
});
