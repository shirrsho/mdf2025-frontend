import { match } from 'path-to-regexp';

export const isRouteAllowed = (
  currentPath: string,
  allowedRoutes: string[]
): boolean => {
  return allowedRoutes.some((routePattern) => {
    const matcher = match(routePattern, { decode: decodeURIComponent });
    return matcher(currentPath) !== false;
  });
};
