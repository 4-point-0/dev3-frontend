import { File } from "../services/api/dev3Schemas";

// Logo urls are not changed when the asset is patched,
// so the updatedAt is added as an auxiliary query param to bust the browser image cache
export function getLogoUrl(logo: File): string {
  return `${logo.url}?u=${logo.updatedAt}`;
}
