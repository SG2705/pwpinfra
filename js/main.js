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
    imageAlt: "W&amp;M Sprinkler logo",
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

TRUSTS.forEach((t) => {
  if (trustContainer) {
    const link = document.createElement("a");
    const image = document.createElement("img");
    link.href = t.href;
    link.target = "_blank";
    image.src = t.imageSrc;
    image.alt = t.imageAlt;
    image.width = 130;
    image.height = 70;

    link.appendChild(image);
    trustContainer.appendChild(link);
  }
});

// Clients
const viewport = document.querySelector(".embla__viewport");
const embla = EmblaCarousel(viewport, {
  loop: false,
  align: "start",
  dragFree: false,
});
