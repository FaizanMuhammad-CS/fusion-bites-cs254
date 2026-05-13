/**
 * Maps MenuItems.category (from DB) to the matching folder name under public/photos.
 * Folder names on disk may differ in casing or spelling.
 */
const CATEGORY_TO_PHOTOS_FOLDER: Record<string, string> = {
  appetizers: "Appetizers",
  soups: "Soups",
  "chicken entrees": "Chicken Entrees",
  "beef entrees": "beef entries",
  seafood: "seafood",
  pakistani: "Pakistani",
  pizza: "Pizza",
  desserts: "Desserts",
  drinks: "Drinks",
};

export function categoryToPhotosFolder(category: string): string {
  const key = category.trim().toLowerCase();
  return CATEGORY_TO_PHOTOS_FOLDER[key] ?? category.trim();
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Try these first (exact public URLs) when filenames/extensions differ from the menu name. */
const DISH_IMAGE_PRIORITY: Record<string, readonly string[]> = {
  "vegetable spring rolls": [
    "/photos/Appetizers/Vegetable%20Spring%20Rolls.webp",
  ],
  "thai soup": [
    "/photos/Soups/Thai%20Soup.jpg",
    "/photos/Soups/Thai%20Soupjpg.jpg",
  ],
};

/** Neutral food placeholder when no local/remote asset matches (avoid random Picsum). */
function fallbackImageUrl(itemId: number): string {
  const id = itemId % 3;
  const urls = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=75",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=75",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=75",
  ];
  return urls[id] ?? urls[0];
}

/**
 * Ordered URLs to try for a dish image: dish-specific paths, then name × extension,
 * then kebab-case slug × extension, then a stable food stock image.
 */
export function menuImageCandidates(
  category: string | undefined,
  name: string,
  itemId: number
): string[] {
  const fallback = fallbackImageUrl(itemId);
  if (!category?.trim()) {
    return [fallback];
  }

  const folder = categoryToPhotosFolder(category);
  const folderSeg = encodeURIComponent(folder);
  const encodedName = encodeURIComponent(name);
  const slug = nameToSlug(name);
  const exts = ["jpg", "jpeg", "png", "webp"] as const;
  const base = `/photos/${folderSeg}`;
  const urls: string[] = [];

  const priority = DISH_IMAGE_PRIORITY[name.trim().toLowerCase()];
  if (priority?.length) {
    urls.push(...priority);
  }

  for (const ext of exts) {
    urls.push(`${base}/${encodedName}.${ext}`);
  }
  for (const ext of exts) {
    urls.push(`${base}/${slug}.${ext}`);
  }
  urls.push(fallback);
  return urls;
}
