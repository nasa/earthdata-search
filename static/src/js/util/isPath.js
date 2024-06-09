import { castArray } from 'lodash'

/**
 * Returns true if the pathname matches one of the paths
 * @param {string} pathname - The pathname to check.
 * @param {string|array} paths - The path(s) to check against.
 * @return {boolean}
 */
export const isPath = (pathname, paths) => castArray(paths).some((path = '') => {
  const pathnameWithoutTrailingSlash = pathname.replace(/\/+$/, '')

  if (path && typeof path.test === 'function') {
    return path.test(pathnameWithoutTrailingSlash)
  }

  const pathWithoutTrailingSlash = path.replace(/\/+$/, '')
  const pathnameWithoutPortal = pathnameWithoutTrailingSlash.replace(/portal\/[^/]*\//, '')

  return pathnameWithoutTrailingSlash === pathWithoutTrailingSlash
    || pathnameWithoutPortal === pathWithoutTrailingSlash
})

export default isPath
