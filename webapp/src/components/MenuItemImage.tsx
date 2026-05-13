"use client";

import { useMemo, useState } from "react";

import { menuImageCandidates } from "@/src/lib/menuImages";

type Props = {
  category: string | undefined;
  name: string;
  itemId: number;
  alt: string;
  className?: string;
};

export default function MenuItemImage({
  category,
  name,
  itemId,
  alt,
  className,
}: Props) {
  const urls = useMemo(
    () => menuImageCandidates(category, name, itemId),
    [category, name, itemId]
  );
  const [index, setIndex] = useState(0);

  return (
    <img
      src={urls[index]}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        setIndex((i) => Math.min(i + 1, urls.length - 1));
      }}
    />
  );
}
