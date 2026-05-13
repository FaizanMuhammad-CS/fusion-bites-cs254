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

/**
 * Ordered URLs to try for a dish image: exact filename from dish name (common extensions),
 * then kebab-case slug, then placeholder.
 */
export function menuImageCandidates(
  category: string | undefined,
  name: string,
  itemId: number
): string[] {
  const fallback = `https://picsum.photos/seed/${itemId + 100}/600/400`;
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

  for (const ext of exts) {
    urls.push(`${base}/${encodedName}.${ext}`);
  }
  for (const ext of exts) {
    urls.push(`${base}/${slug}.${ext}`);
  }
  urls.push(fallback);
  return urls;
}
