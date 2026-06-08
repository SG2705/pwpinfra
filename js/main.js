// Trust
const TRUSTS = [
  {
    href: "https://www.hyatt.com/",
    imageSrc: "https://1000logos.net/wp-content/uploads/2019/11/Hyatt-Logo.png",
    imageAlt: "Hyatt Regency",
  },
  {
    href: "https://www.welcomheritagehotels.in/",
    imageSrc:
      "https://www.manimansion.com/wp-content/uploads/2024/01/Hotel-MM-Logo-288x100-1.jpg",
    imageAlt: "Welcome Heritage",
  },
  {
    href: "https://coffeeshopcompany.co.in/",
    imageSrc: "/assets/web/trust-2.png",
    imageAlt: "Coffeeshop Company",
  },
  {
    href: "https://ticketing.theconnplex.com/",
    imageSrc: "https://ticketing.theconnplex.com/assets/logoNew-77XN372e.png",
    imageAlt: "Connplex Cinemas",
  },
  {
    href: "https://www.bluewingconstruction.com/",
    imageSrc:
      "https://www.bluewingconstruction.com/wp-content/uploads/2024/02/BWDCPL-logo_Website.png",
    imageAlt: "Blue Wing Construction",
  },

  {
    href: "https://www.baselineworld.com/",
    imageSrc:
      "https://www.baselineworld.com/wp-content/uploads/2024/12/logo.png",
    imageAlt: "BaseLine Project Management Services",
  },
  {
    href: "https://www.hitechprojects.co.in/",
    imageSrc:
      "http://hitechprojects.co.in/static/media/hitech_logo.441af66c973ea5b6921a.png",
    imageAlt: "HiTech Projects",
  },
  {
    href: "https://www.lntmhipower.com/",
    imageSrc:
      "https://2025prodstorageaccount-eqdyc8g8hpccdfez.a02.azurefd.net/ltprod/media/0m1f223j/meta-mhi-boiler.webp",
    imageAlt: "L&T MHI Power Boilers",
  },
  {
    href: "  https://www.gomaec.in/",
    imageSrc: "https://www.gomaec.in/img/index/logo.png",
    imageAlt: "Gomaec Engineering",
  },
  {
    href: "https://asopalav.in/",
    imageSrc:
      "https://asopalav.in/cdn/shop/files/Asopalav-logo-leaf1_300x.png?v=1748939234",
    imageAlt: "Asopalav",
  },
  {
    href: "https://www.miabytanishq.com/",
    imageSrc:
      "https://www.miabytanishq.com/on/demandware.static/-/Sites-Mia-Library/default/dw4d1da9aa/images/logo/mia-logo-1000x1000.svg",
    imageAlt: "Mia by tanishq",
  },
  {
    href: "https://goearthorganic.com/",
    imageSrc:
      "https://goearthorganic.com/cdn/shop/files/Asset_1_1.png?v=1735807336&width=180",
    imageAlt: "Go Earth Organic",
  },
  {
    href: "https://airport-plaza.ahmedabadhotels.net/en/",
    imageSrc: "/assets/web/trust-1.png",
    imageAlt: "Hotel Airport Plaza",
  },
  {
    href: "https://anandrathi.com/",
    imageSrc:
      "https://anandrathi.com/_next/static/media/footer-logo.acabddf5.svg",
    imageAlt: "Anand Rathi",
  },
  {
    href: " https://www.subsidymitra.com/",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4tInBN6yyqN9-tbAC6-V3DFOdmujGa0b2EQ&s",
    imageAlt: "Subsidy Mitra",
  },
  {
    href: "https://www.instagram.com/studiomaroon_/?hl=en",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr8GpWijxulRgpenpW7gr9egib1giE5YstbQ&s",
    imageAlt: "Studio Maroon",
  },
  {
    href: "https://www.viraasatarchitects.in/",
    imageSrc:
      "http://static.wixstatic.com/media/7a6215_e161aa6cece741f0808cb6578a055e76~mv2.png/v1/fill/w_566,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Viraasat%20Architects-Color%20copy.png",
    imageAlt: "Viraasaat Architects",
  },
];

const trustContainer = document.getElementById("trust-list-container");

if (trustContainer) {
  TRUSTS.forEach((t) => {
    const link = document.createElement("a");
    const image = document.createElement("img");
    link.href = t.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    image.src = t.imageSrc;
    image.alt = t.imageAlt;
    image.width = 130;
    image.height = 70;

    link.appendChild(image);
    trustContainer.appendChild(link);
  });
}

// Clients Carousel
document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".embla__viewport");

  if (viewport && typeof EmblaCarousel !== "undefined") {
    try {
      EmblaCarousel(viewport, {
        loop: false,
        align: "start",
        dragFree: false,
      });
    } catch (error) {
      console.error("Failed to initialize carousel:", error);
    }
  }
});
