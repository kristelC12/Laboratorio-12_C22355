import "./UserCard.js";
import "./WeatherTime.js";
import "./WarningBadge.js";

class UserDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListener("user-saludar", this.handleGreeting);
  }

  disconnectedCallback() {
    this.removeEventListener("user-saludar", this.handleGreeting);
  }

  handleGreeting = (event) => {
    const { name, role } = event.detail || {};
    const badge = this.querySelector("warning-badge");

    if (!badge) return;

    badge.message = `Saludo capturado de ${name || "usuario"}`;
    badge.tone = "info";
    badge.pulsing = true;

    window.clearTimeout(this.pulseTimer);
    this.pulseTimer = window.setTimeout(() => {
      badge.pulsing = false;
      badge.message = role ? `Sesión por expirar · ${role}` : "Sesión por expirar";
      badge.tone = "warning";
    }, 2200);
  };

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          font-family: var(--app-font, Inter, system-ui, sans-serif);
          background: linear-gradient(180deg, #edf1f7 0%, #e3e8ef 100%);
        }

        .shell {
          width: min(860px, calc(100% - 2rem));
          margin: 0 auto;
          padding: clamp(2rem, 4vw, 3rem) 0;
        }

        .board {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1.7rem 2rem;
          align-items: stretch;
          justify-items: stretch;
          padding: 1.4rem;
          border-radius: 1.9rem;
          background: linear-gradient(145deg, #9e4b4b, #8b3838);
          box-shadow: 0 22px 50px rgba(74, 22, 22, 0.18);
        }

        ::slotted(user-card) {
          grid-column: 1;
          grid-row: 1;
        }

        ::slotted(weather-time) {
          grid-column: 2;
          grid-row: 1;
        }

        ::slotted(warning-badge) {
          grid-column: 1 / -1;
          grid-row: 2;
          width: min(78%, 26rem);
          justify-self: center;
        }

        ::slotted(user-card),
        ::slotted(weather-time),
        ::slotted(warning-badge) {
          height: 100%;
        }

        user-card {
          --user-card-bg: linear-gradient(145deg, #a8d6ff, #86bfff);
          --user-card-avatar-bg: linear-gradient(135deg, #dff0ff, #a7d4ff 65%, #78c5ff);
          --user-card-text: #244468;
          --user-card-fg: #244468;
          --user-card-button-bg: linear-gradient(135deg, #eff9ff, #d6ecff);
          --user-card-button-fg: #244468;
        }

        weather-time {
          --weather-bg: linear-gradient(145deg, #d2f7c8, #b4ecaa);
          --weather-text: #2e5333;
        }

        warning-badge {
          --warning-bg: linear-gradient(145deg, #f6e58d, #edd66d);
          --warning-text: #6c5800;
          --warning-tone: #6c5800;
        }

        @media (max-width: 840px) {
          .board {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          ::slotted(user-card),
          ::slotted(weather-time),
          ::slotted(warning-badge) {
            grid-column: 1;
            grid-row: auto;
            width: 100%;
          }

          ::slotted(warning-badge) {
            width: 100%;
          }
        }
      </style>

      <main class="shell">
        <section class="board" part="board">
          <slot></slot>
        </section>
      </main>
    `;
  }
}

customElements.define("user-dashboard", UserDashboard);