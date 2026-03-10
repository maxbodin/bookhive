import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import("next").NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "prestelpublishing.penguinrandomhouse.de" },
      { protocol: "https", hostname: "images.noosfere.org" },
      { protocol: "https", hostname: "fr.shopping.rakuten.com" },
      { protocol: "https", hostname: "static.fnac-static.com" },
      { protocol: "https", hostname: "boutique.rsf.org" },
      { protocol: "https", hostname: "www.babelio.com" },
      { protocol: "https", hostname: "www.le-livre.fr" },
      { protocol: "https", hostname: "images.epagine.fr" },
      { protocol: "https", hostname: "www.livrenpoche.com" },
      { protocol: "https", hostname: "www.laparafe.fr" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "www.editionslatableronde.fr" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "images2.medimops.eu" },
      { protocol: "https", hostname: "www.images-chapitre.com" },
      { protocol: "https", hostname: "img.leboncoin.fr" },
      { protocol: "https", hostname: "www.bedetheque.com" },
      { protocol: "https", hostname: "pictures.abebooks.com" },
      { protocol: "https", hostname: "www.bdfugue.com" },
      { protocol: "https", hostname: "www.flammarion-jeunesse.fr" },
      { protocol: "https", hostname: "editions.flammarion.com" },
      { protocol: "https", hostname: "cdn.cultura.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl( nextConfig );