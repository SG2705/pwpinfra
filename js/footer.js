class SiteFooter extends HTMLElement {
  static get observedAttributes() {
    return ["logo", "brand", "theme"];
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

    this.innerHTML = `
      <footer class="Footer" role="contentinfo">
        <div class="Footer-mask"></div>
        <div class="Footer-contentWrapper">
          <div class="Footer-contentInfo">
            <a href="/">
              <img
                src="${logo}"
                alt="${brand}"
                width="194"
                height="52"
              />
            </a>
            <p class="Footer-contentInfoText Typography3">
              PWP is a strategic infrastructure consulting firm delivering
              scalable, execution-focused solutions that drive long-term growth
              and operational excellence.
            </p>
            <div class="Footer-socialInfo">
              <a class="Footer-socialInfoIcon" href="#" aria-label="Follow us on Facebook">
                <img
                  src="/assets/web/meta.svg"
                  alt="Facebook"
                  width="20"
                  height="20"
                />
              </a>
              <a class="Footer-socialInfoIcon" href="#" aria-label="Follow us on Twitter">
                <img
                  src="/assets/web/twitter.svg"
                  alt="Twitter"
                  width="20"
                  height="20"
                />
              </a>
              <a class="Footer-socialInfoIcon" href="#" aria-label="Follow us on Instagram">
                <img
                  src="/assets/web/instagram.svg"
                  alt="Instagram"
                  width="20"
                  height="20"
                />
              </a>
              <a class="Footer-socialInfoIcon" href="#" aria-label="Follow us on LinkedIn">
                <img
                  src="/assets/web/linkedin.svg"
                  alt="LinkedIn"
                  width="20"
                  height="20"
                />
              </a>
            </div>
          </div>
          <div class="Footer-menu">
            <p class="Typography4 Footer-menuLink">Quick Links</p>
            <a class="Typography5 Footer-menuLink" href="/about-us">About Us</a>
            <a class="Typography5 Footer-menuLink" href="/insights">Insights</a>
            <a class="Typography5 Footer-menuLink" href="/projects/">Projects</a>
            <a
              class="Typography5 Footer-menuLink"
              href="/projects/projects-by-type/?category=bfsi"
              >Projects By Type</a
            >
            <a class="Typography5 Footer-menuLink" href="/services">Services</a>
          </div>
          <div class="Footer-address">
            <div class="Footer-addressGroup">
              <span class="Footer-addressGroupIcon location"></span>
              <div class="Footer-addressGroupText">
                <p class="Typography2 Footer-addressGroupTextHeading">Address</p>
                <p class="Typography5 Footer-addressGroupTextContent">
                  Travel Food Services Pvt. Ltd., Shiv Sagar Estate, Block 1-A,
                  1st Floor, Worli Point, Mumbai-400018
                </p>
              </div>
            </div>
            <div class="Footer-addressGroup">
              <span class="Footer-addressGroupIcon contact"></span>
              <div class="Footer-addressGroupText">
                <p class="Typography2 Footer-addressGroupTextHeading">Contact</p>
                <p class="Typography5 Footer-addressGroupTextContent">
                  +91 92651 56306
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="Footer-extrasWrapper">
          <p class="Typography2 Footer-copyrightText">
            Copyright © <span id="year"></span>- Projects With Precision Solutions
          </p>
          <div class="Footer-policyWrapper">
            <a class="Typography2 Footer-policy" href="#">Privacy Policy</a>
            <a class="Typography2 Footer-policy" href="#">Terms of Use</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);

// Copyright Year
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
