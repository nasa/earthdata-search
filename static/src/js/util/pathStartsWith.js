import { castArray } from 'lodash'

/**
 * Returns true if the pathname starts with one of the paths
 * @param {string} pathname - The pathname to check.
 * @param {string|array} paths - The path(s) to check against.
 * @return {boolean}
 */
export const pathStartsWith = (pathname, paths) => castArray(paths).some((path = '') => {
  const pathnameWithoutTrailingSlash = pathname.replace(/\/+$/, '')
  const pathWithoutTrailingSlash = path.replace(/\/+$/, '')

  const pathnameWithoutPortal = pathnameWithoutTrailingSlash.replace(/portal\/[^/]*\//, '')

  return pathnameWithoutTrailingSlash.startsWith(pathWithoutTrailingSlash)
    || pathnameWithoutPortal.startsWith(pathWithoutTrailingSlash)
})

export default pathStartsWith
