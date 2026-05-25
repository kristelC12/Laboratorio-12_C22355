class UserCard extends HTMLElement {
  static observedAttributes = ["name", "role", "avatar", "button-label"];

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

  get name() {
    return this.getAttribute("name") || "Usuario";
  }

  get role() {
    return this.getAttribute("role") || "Invitado";
  }

  get avatar() {
    return this.getAttribute("avatar") || this.name.charAt(0).toUpperCase();
  }

  get buttonLabel() {
    return this.getAttribute("button-label") || "Saludar";
  }

  get parsedContent() {
    const raw = this.textContent.replace(/\s+/g, " ").trim();

    if (!raw) {
      return {
        avatar: this.avatar,
        name: this.name,
        role: this.role,
        buttonLabel: this.buttonLabel,
      };
    }

    const parts = raw.split(" ");
    const avatar = parts[0] || this.avatar;
    const name = parts[1] || this.name;
    const role = parts[2] || this.role;
    const buttonLabel = parts.slice(3).join(" ").replace(/^\[|\]$/g, "") || this.buttonLabel;

    return {
      avatar: avatar.charAt(0).toUpperCase(),
      name,
      role,
      buttonLabel,
    };
  }

  handleClick = () => {
    const data = this.parsedContent;

    this.dispatchEvent(
      new CustomEvent("user-saludar", {
        bubbles: true,
        composed: true,
        detail: {
          name: data.name,
          role: data.role,
        },
      })
    );
  };

  render() {
    if (!this.shadowRoot) return;

    const content = this.parsedContent;

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          color: var(--user-card-fg, #f5f7fb);
          font-family: var(--app-font, Inter, system-ui, sans-serif);
        }

        .card {
          min-height: 60%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          align-items: center;
          padding: 1.2rem 1.25rem;
          border-radius: 1.6rem;
          background: var(--user-card-bg, #4c9de8);
          border: none;
          color: var(--user-card-text, #eaf6ff);
        }

        .avatar {
          width: 4rem;
          height: 4rem;
          border-radius: 1.1rem;
          display: grid;
          place-items: center;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          background: var(--user-card-avatar-bg, #dff0ff);
        }

        .meta {
          display: grid;
          gap: 0.25rem;
        }

        .name {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        .role {
          color: color-mix(in srgb, currentColor 72%, transparent);
          font-size: 0.96rem;
        }

        button {
          justify-self: start;
          margin-top: 0.1rem;
          border: 0;
          background: var(--user-card-button-bg, #fff9ae);
          padding: 0.78rem 1rem;
          cursor: pointer;
          color: var(--user-card-button-fg, #12324d);
          font: inherit;
          font-weight: 700;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(254, 215, 102, 0.34);
        }

        button:focus-visible {
          outline: 3px solid rgba(157, 212, 255, 0.8);
          outline-offset: 3px;
        }
      </style>

      <article class="card" part="card">
        <div class="avatar" part="avatar">
          ${content.avatar}
        </div>

        <div class="meta">
          <div class="name" part="name">${content.name}</div>
          <div class="role" part="role">${content.role}</div>
        </div>

        <button part="action-button" type="button">${content.buttonLabel}</button>
      </article>
    `;

    this.shadowRoot.querySelector("button")?.addEventListener("click", this.handleClick);
  }
}

customElements.define("user-card", UserCard);