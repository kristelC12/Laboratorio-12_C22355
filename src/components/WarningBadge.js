class WarningBadge extends HTMLElement {
  static observedAttributes = ["pulsing", "tone", "message"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get pulsing() {
    return this.hasAttribute("pulsing");
  }

  set pulsing(value) {
    this.toggleAttribute("pulsing", Boolean(value));
  }

  get tone() {
    return this.getAttribute("tone") || "warning";
  }

  set tone(value) {
    this.setAttribute("tone", value);
  }

  get message() {
    return this.getAttribute("message") || "Sesión por expirar";
  }

  set message(value) {
    this.setAttribute("message", value);
  }

  render() {
    if (!this.shadowRoot) return;

    const message = this.getAttribute("message") || this.textContent.replace(/\s+/g, " ").trim() || this.message;

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          font-family: var(--app-font, Inter, system-ui, sans-serif);
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          justify-content: center;
          min-height: 30%;
          width: 100%;
          padding: 1rem 1.1rem;
          border-radius: 1.5rem;
          background: var(--warning-bg, #f6e58d);
          color: var(--warning-text, #594400);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 18px 36px rgba(5, 10, 22, 0.15);
        }

        .badge::before {
          content: "";
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 0 0.35rem rgba(255, 255, 255, 0.05);
          flex: none;
        }

        .badge[data-tone="warning"] {
          color: var(--warning-tone, #7a5600);
        }

        .badge[data-tone="success"] {
          color: #34d399;
        }

        .badge[data-tone="info"] {
          color: #38bdf8;
        }

        .badge[pulsing] {
          animation: pulse 1.15s ease-in-out infinite;
        }

        .message {
          font-weight: 700;
          letter-spacing: 0.01em;
          text-align: center;
        }

        ::slotted(*) {
          margin: 0;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            filter: saturate(1);
          }

          50% {
            transform: scale(1.02);
            filter: saturate(1.2);
          }
        }
      </style>

      <div class="badge" part="badge" data-tone="${this.tone}" ${this.pulsing ? "pulsing" : ""}>
        <span class="message" part="message">${message}</span>
      </div>
    `;
  }
}

customElements.define("warning-badge", WarningBadge);