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
              We are a Strategic expansion and Turnkey delivery partner helping brands grow confidently into new regions
            </p>
            <div class="Footer-socialInfo">
              <a class="Footer-socialInfoIcon" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/pwp-gujarat/posts/?feedView=all" aria-label="Follow us on LinkedIn">
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
            <a class="Typography5 Footer-menuLink" href="/about-us/">About Us</a>
            <a class="Typography5 Footer-menuLink" href="/insights/">Insights</a>
            <a class="Typography5 Footer-menuLink" href="/projects/">Projects</a>
            <a
              class="Typography5 Footer-menuLink"
              href="/projects/projects-by-type/?category=bfsi"
              >Projects by Category</a
            >
            <a class="Typography5 Footer-menuLink" href="/services/">Services</a>
          </div>
          <div class="Footer-address">
            <div class="Footer-addressGroup">
              <span class="Footer-addressGroupIcon location"></span>
              <div class="Footer-addressGroupText">
                <p class="Typography2 Footer-addressGroupTextHeading">Address</p>
                <p class="Typography5 Footer-addressGroupTextContent">
                  J-1004, Shilp Ananta, Stanza Road, Oppo. Club O7, Shela, Ahmedabad, Gujarat - 380058
                </p>
              </div>
            </div>
            <div class="Footer-addressGroup">
              <span class="Footer-addressGroupIcon contact"></span>
              <div class="Footer-addressGroupText">
                <p class="Typography2 Footer-addressGroupTextHeading">Contact</p>
                <p class="Typography5 Footer-addressGroupTextContent">
                  +91 92651 56306, +91 70163 50982
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="Footer-extrasWrapper">
          <p class="Typography2 Footer-copyrightText">
            Copyright © ${new Date().getFullYear()} - Projects With Precision
          </p>
          <div class="Footer-policyWrapper">
            <a class="Typography2 Footer-policy" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/sagar-gupta27/">Sagar Gupta</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
