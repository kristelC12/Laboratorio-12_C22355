import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./WeatherTime.js";

const LIBERIA_DATA = {
  temperature: "28 °C",
  description: "Parcialmente nublado",
  forecast: [{ description: "Lluvioso" }],
};

const NICOYA_DATA = {
  temperature: "31 °C",
  description: "Soleado",
  forecast: [{ description: "Caluroso" }],
};

describe("WeatherTime", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("weather-time"); 
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("se registra como custom element", () => {
    expect(customElements.get("weather-time")).toBeDefined();
  });

  describe("tests unitarios", () => {
    it("city usa Liberia por defecto", () => {
      expect(element.city).toBe("Liberia");
    });

    it("city usa Liberia por defecto", () => {
      expect(element.city).toBe("Liberia");
    });

    it("temperature y condition devuelven null sin datos", () => {
      expect(element.temperature).toBeNull();
      expect(element.condition).toBeNull();
    });

    it("condition usa forecast[0].description si no hay description raíz", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ temperature: "30 °C", forecast: [{ description: "Tormenta" }] }),
      }));
      document.body.append(element);
      await element.init();
      expect(element.condition).toBe("Tormenta");
    });
  });

  describe("tests de integración", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn().mockImplementation((url) => {
        const payload = String(url).includes("nicoya") ? NICOYA_DATA : LIBERIA_DATA;
        return Promise.resolve({ ok: true, json: async () => payload });
      }));
      element.setAttribute("city", "Liberia");
      document.body.append(element); 
    });

    it("crea un shadow root y renderiza el panel", () => {
      expect(element.shadowRoot).not.toBeNull();
      expect(element.shadowRoot.querySelector("[part='panel']")).not.toBeNull();
    });

    it("muestra temperatura y condición al resolver fetch", async () => {
      await element.init();

      expect(element.shadowRoot.textContent).toContain("28 °C");
      expect(element.shadowRoot.textContent).toContain("Parcialmente nublado");
      expect(element.shadowRoot.querySelector(".error")).toBeNull();
    });

    it("consulta la API de la ciudad actual y renderiza su respuesta", async () => {
      await element.init();

      element.setAttribute("city", "Nicoya");
      await element.init();

      expect(element.city).toBe("Nicoya");
      expect(element.shadowRoot.textContent).toContain("31 °C");
      expect(element.shadowRoot.textContent).toContain("Soleado");
      expect(element.shadowRoot.textContent).toContain("Nicoya");
    });

  it("muestra error cuando fetch falla", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network Error")));
      await element.init();
      expect(element.shadowRoot.querySelector(".error")).not.toBeNull();
    });

    it("muestra 'Cargando...' mientras fetch no resuelve", () => {
      vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
      element.init(); // sin await
      expect(element.shadowRoot.textContent).toContain("Cargando...");
    });
  });
});


