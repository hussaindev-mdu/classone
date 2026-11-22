/**
 * Sub-path the site is served from (e.g. "/classone" on GitHub Pages project
 * sites). next/link and the router add it automatically; raw asset URLs
 * (fetch, <link>, next/image with unoptimized images) need `withBase`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function withBase(path: string) {
  return `${BASE_PATH}${path}`;
}
