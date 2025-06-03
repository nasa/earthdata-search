import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash-es'
import { parse, stringify } from 'qs'

import actions from '../../actions/index'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal, buildConfig } from '../../util/portals'

// eslint-disable-next-line import/no-unresolved
import availablePortals from '../../../../../portals/availablePortals.json'

import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (portalId) => dispatch(actions.changePath(portalId)),
  onChangeUrl:
    (data) => dispatch(actions.changeUrl(data))
})

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export const PortalContainer = ({
  portal,
  onChangePath,
  onChangeUrl
}) => {
  const params = useParams()
  console.log('🚀 ~ PortalContainer.jsx:36 ~ params:', params)
  const defaultPortalId = getApplicationConfig().defaultPortal
  const location = useEdscStore((state) => state.location.location)

  useEffect(() => {
    const { portalId } = params
    console.log('🚀 ~ PortalContainer.jsx:42 ~ useEffect ~ portalId:', portalId)

    const { pathname, search } = location
    console.log('🚀 ~ PortalContainer.jsx:45 ~ useEffect ~ location:', location)

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

    console.log('🚀 ~ PortalContainer.jsx:71 ~ useEffect ~ newPathname:', newPathname)
    console.log('🚀 ~ PortalContainer.jsx:72 ~ useEffect ~ newSearch:', newSearch)
    if (newPathname !== pathname || newSearch !== search) {
      // Update the URL with the new value
      onChangeUrl({
        pathname: newPathname,
        search: newSearch
      })

      // Reset the store based on the new URL
      onChangePath(`${newPathname}${newSearch}`)
    }
  }, [])

  const { portalId, title = {} } = portal
  const { primary: primaryTitle } = title

  let portalTitle = ''
  if (!isDefaultPortal(portalId)) portalTitle = ` :: ${primaryTitle || startCase(portalId)} Portal`

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

PortalContainer.propTypes = {
  portal: PropTypes.shape({
    title: PropTypes.shape({
      primary: PropTypes.string
    }),
    portalId: PropTypes.string
  }).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PortalContainer)
