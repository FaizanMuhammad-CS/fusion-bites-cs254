"use client";

import MenuItemImage from "@/src/components/MenuItemImage";

type UrlProps = {
  mode: "url";
  src: string;
  alt: string;
  className?: string;
};

type MenuProps = {
  mode: "menu";
  category: string;
  /** Filename base in public/photos — often matches a MenuItems.name row */
  imageName: string;
  itemId: number;
  alt: string;
  className?: string;
};

/**
 * Home featured dishes: remote URL or same /photos resolution as the main menu.
 */
export default function FeaturedDishImage(props: UrlProps | MenuProps) {
  if (props.mode === "url") {
    return (
      <img
        src={props.src}
        alt={props.alt}
        className={props.className}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <MenuItemImage
      category={props.category}
      name={props.imageName}
      itemId={props.itemId}
      alt={props.alt}
      className={props.className}
    />
  );
}
