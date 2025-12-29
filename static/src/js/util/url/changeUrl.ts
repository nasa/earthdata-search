import { isPath } from '../isPath'
import {
  isSavedProjectsPage,
  urlPathsWithoutUrlParams
// @ts-expect-error This file doesn't have types
} from './url'

import routerHelper, { type Router } from '../../router/router'

type UpdateUrlParams = {
  /** Parameters for updating the URL */
  options: string | Record<string, unknown>,
  /** The current pathname before the update */
  oldPathname: string,
  /** The new pathname after the update */
  newPathname: string
}

const updateUrl = ({
  options,
  oldPathname,
  newPathname
}: UpdateUrlParams) => {
  // Only replace if the pathname stays the same as the current pathname.
  // Push if the pathname is different
  routerHelper.router?.navigate(options, { replace: oldPathname === newPathname })
}

/**
 * Push a new url state to the store.
 * @param {String|Object} options - Pushes the string or an object containing 'pathname' and 'search' keys
 * as the new url. When passing an object, if only one key is passed, only the corresponding piece of the
 * url will be changed.
 *
 * @example
 * // Given the original url '/a-old-url/?some-param=false', changes url to '/a-new-url/?some-param=true'
 * changeUrl('/a-new-url/?some-param=true')
 *
 * // Given the original url '/a-old-url/?some-param=false', changes url to '/a-new-url/?some-param=false'
 * changeUrl({ pathname: '/a-new-url' })
 */
export const changeUrl = (options: string | Record<string, unknown>) => {
  const { location } = routerHelper.router?.state || {} as Router['state']
  const { pathname: oldPathname } = location

  let newPathname: string

  if (typeof options === 'string') {
    [newPathname] = options.split('?')
    const newSearch = options.split('?')[1] || ''

    // Prevent loading from the urls that don't use URL params.
    const stripParameters = (
      isPath(newPathname, urlPathsWithoutUrlParams)
      || isSavedProjectsPage({
        pathname: newPathname,
        search: newSearch
      })
    )

    let newOptions = options
    if (stripParameters) {
      newOptions = newPathname
    }

    updateUrl({
      options: newOptions,
      oldPathname,
      newPathname
    })
  } else {
    ({ pathname: newPathname } = options as { pathname: string })

    updateUrl({
      options,
      oldPathname,
      newPathname
    })
  }

  return null
}
