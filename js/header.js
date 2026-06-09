class SiteHeader extends HTMLElement {
  static get observedAttributes() {
    return ["logo", "brand", "theme", "gradient", "show-contact"];
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const logo = this.getAttribute("logo") || "/assets/logo.svg";
    const brand = this.getAttribute("brand") || "PWP Infra";
    const theme = this.getAttribute("theme") || "light";
    const showContact = this.getAttribute("show-contact") !== "false";

    this.innerHTML = `
     <a class="Header-skipToContent" href="#main-content">Skip to content</a>
     <header class="Header" role="banner">
      <nav class="Header-navWrapper" aria-label="Main navigation">
        <a href="/" aria-label="${brand} - Home">
          <img
            src="${logo}"
            alt="${brand}"
            width="120"
            height="40"
          />
        </a>
        <button class="Header-menuToggle" aria-label="Toggle menu" aria-expanded="false">
          <span class="Header-menuToggleBar"></span>
          <span class="Header-menuToggleBar"></span>
          <span class="Header-menuToggleBar"></span>
        </button>
        <ul class="Header-navList">
          <li class="Header-navListItem Typography1">
            <a href="/services/">Services</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/projects/">Projects</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/about-us/">About Us</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/insights/">Insights</a>
          </li>
        </ul>
        ${
          showContact
            ? `<a
          href="/contact-us/"
          class="Header-navListItem Header-navListItem-contactUsBtn Typography1"
          >Contact Us</a
        >`
            : ""
        }
      </nav>
    </header>
    `;

    const toggle = this.querySelector(".Header-menuToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        this.querySelector(".Header-navList").classList.toggle(
          "Header-navList--open",
        );
        const contactBtn = this.querySelector(
          ".Header-navListItem-contactUsBtn",
        );
        if (contactBtn)
          contactBtn.classList.toggle("Header-navListItem-contactUsBtn--open");
      });
    }
  }
}

customElements.define("site-header", SiteHeader);
