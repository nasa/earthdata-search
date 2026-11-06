import { isPath } from '../isPath'
import {
  isSavedProjectsPage,
  urlPathsWithoutUrlParams
// @ts-expect-error This file doesn't have types
} from './url'

import routerHelper, { type Router } from '../../router/router'
import useEdscStore from '../../zustand/useEdscStore'

type UpdateUrlParams = {
  /** Parameters for updating the URL */
  options: string | Record<string, unknown>,
  /** The current location before the update */
  oldLocation: Router['state']['location'],
  /** The new pathname after the update */
  newPathname: string,
  /** The new search string after the update */
  newSearch: string
}

// Treat '', '?' and undefined as the same empty search string
const normalizeSearch = (search?: string) => {
  if (!search || search === '?') return ''

  return search.startsWith('?') ? search : `?${search}`
}

const updateUrl = async ({
  options,
  oldLocation,
  newPathname,
  newSearch
}: UpdateUrlParams) => {
  const { pathname: oldPathname, search: oldSearch } = oldLocation

  // Navigating to the URL we're already on would push a duplicate history entry
  // (React Router doesn't dedupe), requiring an extra Back click. Skip it.
  if (
    oldPathname === newPathname
    && normalizeSearch(oldSearch) === normalizeSearch(newSearch)
  ) {
    return
  }

  // Only replace if the pathname stays the same as the current pathname.
  // Push if the pathname is different
  await routerHelper.router?.navigate(options, { replace: oldPathname === newPathname })
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
export const changeUrl = async (options: string | Record<string, unknown>) => {
  const { location } = routerHelper.router?.state || {} as Router['state']
  const { pathname: oldPathname, search: oldSearch } = location

  let newPathname: string

  try {
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

      await updateUrl({
        options: newOptions,
        oldLocation: location,
        newPathname,
        newSearch: stripParameters ? '' : newSearch
      })
    } else {
      // Missing keys keep the current value, so only the provided piece of the url changes
      const {
        pathname = oldPathname,
        search = oldSearch
      } = options as { pathname?: string, search?: string }
      newPathname = pathname

      await updateUrl({
        options,
        oldLocation: location,
        newPathname,
        newSearch: search
      })
    }
  } catch (error) {
    const { errors } = useEdscStore.getState()
    const { handleError } = errors

    handleError({
      error: error as Error,
      action: 'changeUrl',
      title: 'Something went wrong loading the page. Refresh it to return to previous page'
    })
  }

  return null
}
