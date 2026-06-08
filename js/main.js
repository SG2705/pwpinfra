// Trust
const TRUSTS = [
  {
    href: "https://www.davisulmer.com/",
    imageSrc: "https://media.apigroupinc.com/logos/dusco.svg?align=c",
    imageAlt: "Davis-Ulmer logo",
  },
  {
    href: "https://www.beachlakesprinkler.com/",
    imageSrc: "https://media.apigroupinc.com/logos/blsc.svg?align=c",
    imageAlt: "Beach Lake Sprinkler logo",
  },
  {
    href: "https://ellisfire.com/",
    imageSrc: "https://media.apigroupinc.com/logos/ellis.svg?align=c",
    imageAlt: "Ellis Fire logo",
  },
  {
    href: "https://www.islandfirespk.com/",
    imageSrc: "https://media.apigroupinc.com/logos/reliance.svg?align=c",
    imageAlt: "Island Fire logo",
  },
  {
    href: "https://www.reliancefireprotection.com/",
    imageSrc: "https://media.apigroupinc.com/logos/reliance.svg?align=c",
    imageAlt: "Reliance logo",
  },
  {
    href: "https://www.richfire.com/",
    imageSrc: "https://media.apigroupinc.com/logos/richfire.svg?align=c",
    imageAlt: "W&M Sprinkler logo",
  },
  {
    href: "https://www.beachlakesprinkler.com/",
    imageSrc: "https://media.apigroupinc.com/logos/blsc.svg?align=c",
    imageAlt: "Beach Lake Sprinkler logo",
  },
  {
    href: "https://ellisfire.com/",
    imageSrc: "https://media.apigroupinc.com/logos/ellis.svg?align=c",
    imageAlt: "Ellis Fire logo",
  },
  {
    href: "https://www.islandfirespk.com/",
    imageSrc: "https://media.apigroupinc.com/logos/reliance.svg?align=c",
    imageAlt: "Island Fire logo",
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
