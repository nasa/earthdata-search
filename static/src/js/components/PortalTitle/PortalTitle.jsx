import React from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'
import { startCase } from 'lodash-es'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { buildConfig, isDefaultPortal } from '../../util/portals'

import availablePortals from '../../../../../portals/availablePortals.json'
import useEdscStore from '../../zustand/useEdscStore'

const PortalTitle = () => {
  const { pathname } = useLocation()
  const portal = useEdscStore((state) => state.portal)

  if (pathname !== '/search') return null

  const { portalId, title = {} } = portal || {}

  const { defaultPortal, env } = getApplicationConfig()
  const defaultPortalConfig = availablePortals[defaultPortal]
  if (!defaultPortalConfig) return null

  const defaultConfig = buildConfig(defaultPortalConfig)
  const { title: defaultTitle = {} } = defaultConfig
  const { primary: defaultPrimaryTitle = 'Earthdata Search' } = defaultTitle

  const envUpper = env ? env.toUpperCase() : ''
  const envPrefix = envUpper && envUpper !== 'PROD' ? `[${envUpper}] ` : ''

  let pageTitle = `${envPrefix}${defaultPrimaryTitle}`

  if (portalId && !isDefaultPortal(portalId)) {
    const { primary: portalPrimaryTitle } = title
    const formattedPortalTitle = portalPrimaryTitle || startCase(portalId)
    pageTitle = `${pageTitle} - ${formattedPortalTitle} Portal`
  }

  return (
    <Helmet titleTemplate="%s">
      <title>{pageTitle}</title>
    </Helmet>
  )
}

export default PortalTitle
