class WeatherTime extends HTMLElement {
  static observedAttributes = ["city"];

  data = null;
  loading = false;
  error = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.init();
  }

  attributeChangedCallback(name, oldV, newV) {
    if (name === "city" && oldV !== newV) {
      this.init();
    }
  }

  get city() {
    // Allow light-DOM text fallback when no attribute provided
    const txt = this.textContent.replace(/\s+/g, " ").trim();
    if (!this.hasAttribute("city") && txt) {
      // first token is city in the simple markup
      const parts = txt.split(" ");
      return parts[0] || "Liberia";
    }

    return this.getAttribute("city") || "Liberia";
  }

  async init() {
    const L = encodeURIComponent(this.city.toLowerCase().replace(/\s+/g, "+") + "+guanacaste");
    const URL = `https://goweather.xyz/v2/weather/${L}`;

    this.loading = true;
    this.error = null;
    this.render();

    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.data = await response.json();
    } catch (err) {
      this.error = err.message || String(err);
      this.data = null;
    } finally {
      this.loading = false;
      this.render();
    }
  }

  get temperature() {
    return this.data?.temperature || null;
  }

  get condition() {
    return this.data?.description || this.data?.forecast?.[0]?.description || null;
  }

  render() {
    if (!this.shadowRoot) return;

    const loadingHtml = `<div class="loading">Cargando...</div>`;
    const temp = this.temperature ? `<div class="reading" part="temperature"><span>${this.temperature}</span></div>` : loadingHtml;
    const cond = this.condition ? `<div class="condition" part="condition">${this.condition}</div>` : "";
    const cityLabel = this.city || "Liberia";

    const errorHtml = this.error ? `<div class="error">Error: ${this.error}</div>` : "";

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host { display:block; font-family: var(--app-font, Inter, system-ui, sans-serif); }
        .panel { padding: 1.1rem 1.2rem; border-radius: 1.5rem; min-height: 6rem; background: var(--weather-bg, #b4ecaa); color: var(--weather-text, #2e5333); }
        .city { font-size: 1rem; text-transform: uppercase; opacity: 0.9; }
        .reading { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; }
        .condition { font-size: 1rem; font-weight: 600; }
        .loading { opacity: 0.7; }
        .error { color: #8b1a1a; font-weight: 700; }
      </style>

      <section class="panel" part="panel">
        <div class="city" part="city">${cityLabel}</div>
        ${this.loading ? loadingHtml : temp}
        ${cond}
        ${errorHtml}
      </section>
    `;
  }
}

customElements.define("weather-time", WeatherTime);
