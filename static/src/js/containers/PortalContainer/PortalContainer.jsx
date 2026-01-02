import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash-es'
import { parse, stringify } from 'qs'
import { useLocation, useParams } from 'react-router-dom'

import { changePath } from '../../util/url/changePath'
import { changeUrl } from '../../util/url/changeUrl'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal, buildConfig } from '../../util/portals'

// eslint-disable-next-line import/no-unresolved
import availablePortals from '../../../../../portals/availablePortals.json'
import useEdscStore from '../../zustand/useEdscStore'

const PortalContainer = () => {
  const defaultPortalId = getApplicationConfig().defaultPortal
  const portal = useEdscStore((state) => state.portal)
  const location = useLocation()
  const params = useParams()

  useEffect(() => {
    const { portalId } = params

    const { pathname, search } = location

    let newPathname = pathname
    let newSearch = search

    // If portalId exists in the match params, convert it to a query param
    if (portalId) {
      newPathname = pathname.replace(`/portal/${portalId}`, '')

      // If the pathname doesn't exist after replacing the portalPath, set it to /search
      if (!newPathname) newPathname = '/search'

      const newParams = parse(search, {
        parseArrays: false,
        ignoreQueryPrefix: true
      })

      newSearch = stringify({
        ...newParams,
        portal: portalId
      }, {
        addQueryPrefix: true
      })
    }

    if (newPathname !== pathname || newSearch !== search) {
      setTimeout(() => {
        // Update the URL with the new value
        changeUrl({
          pathname: newPathname,
          search: newSearch
        })

        // Reset the store based on the new URL
        changePath(`${newPathname}${newSearch}`)
      }, 0)
    }
  }, [])

  const { portalId, title = {} } = portal
  const { primary: primaryTitle } = title

  let portalTitle = ''
  if (!isDefaultPortal(portalId)) portalTitle = ` - ${primaryTitle || startCase(portalId)} Portal`

  const { [defaultPortalId]: defaultPortal } = availablePortals

  const defaultConfig = buildConfig(defaultPortal, availablePortals)

  // Use the default title for the page title
  const {
    title: defaultTitle
  } = defaultConfig

  const { primary: defaultPrimaryTitle } = defaultTitle

  return (
    <Helmet>
      <title>
        {`${defaultPrimaryTitle}${portalTitle}`}
      </title>
    </Helmet>
  )
}

export default PortalContainer
