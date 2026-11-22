"use client";

import Image from "next/image";
import { useState } from "react";

type Brand = {
  name: string;
  color: string;
  src: string;
  width: number;
  height: number;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
};

function asset(file: string) {
  return "/desktop/brands/" + file;
}

export const brands: Record<string, Brand> = {
  cirgent: {
    name: "CIRGENT",
    color: "#0296f8",
    src: asset("cirgent.webp"),
    width: 860,
    height: 170,
    iconSrc: asset("cirgent-icon.webp"),
    iconWidth: 176,
    iconHeight: 137,
  },
  saeroi: {
    name: "SAEROI",
    color: "#fb9154",
    src: asset("saeroi.svg"),
    width: 1727,
    height: 385,
    iconSrc: asset("saeroi-icon.webp"),
    iconWidth: 156,
    iconHeight: 154,
  },
  potner: {
    name: "PotneR",
    color: "#a9d08d",
    src: asset("potner.webp"),
    width: 480,
    height: 233,
    iconSrc: asset("potner-icon.webp"),
    iconWidth: 128,
    iconHeight: 124,
  },
  neoulteo: {
    name: "너울터",
    color: "#efe7d3",
    src: asset("neoulteo.webp"),
    width: 440,
    height: 237,
    iconSrc: asset("neoulteo-icon.webp"),
    iconWidth: 128,
    iconHeight: 182,
  },
  glople: {
    name: "Glople",
    color: "#5056ef",
    src: asset("glople.webp"),
    width: 310,
    height: 222,
    iconSrc: asset("glople.webp"),
    iconWidth: 310,
    iconHeight: 222,
  },
  bluememories: {
    name: "BlueMemories",
    color: "#9fbead",
    src: asset("bluememories.webp"),
    width: 275,
    height: 207,
    iconSrc: asset("bluememories-icon.webp"),
    iconWidth: 140,
    iconHeight: 101,
  },
  mofy: {
    name: "MOFY",
    color: "#e8818c",
    src: asset("mofy.webp"),
    width: 420,
    height: 198,
    iconSrc: asset("mofy-icon.webp"),
    iconWidth: 128,
    iconHeight: 128,
  },
  saybridge: {
    name: "SayBridge",
    color: "#d8e5fa",
    src: asset("saybridge.svg"),
    width: 320,
    height: 64,
    iconSrc: asset("saybridge-icon.svg"),
    iconWidth: 96,
    iconHeight: 96,
  },
  "aws-deploy": {
    name: "AWS Deploy",
    color: "#e5dacb",
    src: asset("aws-deploy.svg"),
    width: 320,
    height: 64,
    iconSrc: asset("aws-deploy-icon.svg"),
    iconWidth: 96,
    iconHeight: 96,
  },
};

/** Parent buttons and captions provide the accessible project name. */
export function BrandArt({
  slug,
  variant = "icon",
}: {
  slug: string;
  variant?: "exhibit" | "icon";
}) {
  const brand = brands[slug];
  const exhibit = variant === "exhibit";
  const src = brand && (exhibit ? brand.src : brand.iconSrc);
  const [failedSrc, setFailedSrc] = useState("");
  return (
    <span
      className="sys-brand-art"
      data-brand={slug}
      data-variant={variant}
      aria-hidden="true"
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {brand && src && src !== failedSrc ? (
        <Image
          unoptimized
          draggable={false}
          src={src}
          alt=""
          width={exhibit ? brand.width : brand.iconWidth}
          height={exhibit ? brand.height : brand.iconHeight}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
          }}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span
          style={{
            color: brand?.color ?? "currentColor",
            fontSize: exhibit ? "inherit" : ".75em",
          }}
        >
          {exhibit ? (brand?.name ?? slug) : (brand?.name ?? slug).slice(0, 2)}
        </span>
      )}
    </span>
  );
}
