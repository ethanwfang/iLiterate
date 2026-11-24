/** Route prefixes for features that are switched off; the proxy redirects pages and 404s their APIs. */
export const HIDDEN_FEATURE_ROUTES = ["/study-chat", "/karaoke"];

export function isHiddenFeaturePath(pathname: string): boolean {
  return HIDDEN_FEATURE_ROUTES.some((route) =>
    [route, `/api${route}`].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  );
}
