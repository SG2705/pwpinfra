class SiteHeader extends HTMLElement {
  static get observedAttributes() {
    return ["logo", "brand", "theme", "gradient"];
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

    this.innerHTML = `
     <header class="Header">
      <nav class="Header-navWrapper">
        <a href="/">
          <img
            src="${logo}"
            alt="${brand}"
            width="120"
            height="40"
          />
        </a>
        <ul class="Header-navList">
          <li class="Header-navListItem Typography1">
            <a href="/services">Services</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/projects">Projects</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/about-us">About Us</a>
          </li>
          <li class="Header-navListItem Typography1">
            <a href="/insights">Insights</a>
          </li>
        </ul>
        <a
          href="#contact-us"
          class="Header-navListItem Header-navListItem-contactUsBtn Typography1"
          >Contact Us</a
        >
      </nav>
    </header>
    `;
  }
}

customElements.define("site-header", SiteHeader);
