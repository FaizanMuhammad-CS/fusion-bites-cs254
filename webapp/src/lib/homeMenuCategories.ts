/**
 * Category chips on the home page — values must match `MenuItems.category` in the DB seed
 * (`database/data/data.sql`) so deep links to `/menu?category=…` filter correctly.
 */
export const HOME_MENU_CATEGORY_CHIPS = [
  "All",
  "Appetizers",
  "Soups",
  "Chicken Entrees",
  "Beef Entrees",
  "Seafood",
  "Pakistani",
  "Pizza",
  "Desserts",
  "Drinks",
] as const;

export function menuCategoryHref(label: string): string {
  if (label === "All") return "/menu";
  return `/menu?category=${encodeURIComponent(label)}`;
}
