/**
 * Returns true if the pathname matches one of the paths
 * @param {string} pathname - The pathname to check.
 * @param {string|array} paths - The path(s) to check against.
 * @return {boolean}
 */
export const isPath = (pathname: string, paths: string[] | RegExp[]): boolean => paths.some((path = '') => {
  const pathnameWithoutTrailingSlash = pathname.replace(/\/+$/, '')

  if (path instanceof RegExp) {
    return path.test(pathnameWithoutTrailingSlash)
  }

  const pathWithoutTrailingSlash = path.replace(/\/+$/, '')
  const pathnameWithoutPortal = pathnameWithoutTrailingSlash.replace(/portal\/[^/]*\//, '')

  return pathnameWithoutTrailingSlash === pathWithoutTrailingSlash
    || pathnameWithoutPortal === pathWithoutTrailingSlash
})

export default isPath
