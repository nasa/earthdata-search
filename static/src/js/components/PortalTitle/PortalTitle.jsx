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
  if (!portal) return null

  const { portalId, title = {} } = portal
  if (!portalId || isDefaultPortal(portalId)) return null

  const { defaultPortal, env } = getApplicationConfig()
  const defaultPortalConfig = availablePortals[defaultPortal]
  if (!defaultPortalConfig) return null

  const defaultConfig = buildConfig(defaultPortalConfig)
  const { title: defaultTitle = {} } = defaultConfig
  const { primary: defaultPrimaryTitle = 'Earthdata Search' } = defaultTitle

  const { primary: portalPrimaryTitle } = title
  const formattedPortalTitle = portalPrimaryTitle || startCase(portalId)
  const envPrefix = env && env.toUpperCase() !== 'PROD' ? `[${env.toUpperCase()}] ` : ''
  const pageTitle = `${envPrefix}${defaultPrimaryTitle} - ${formattedPortalTitle} Portal`

  return (
    <Helmet titleTemplate="%s">
      <title>{pageTitle}</title>
    </Helmet>
  )
}

export default PortalTitle
