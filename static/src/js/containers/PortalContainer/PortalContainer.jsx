import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash'
import { parse, stringify } from 'qs'

import actions from '../../actions/index'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal, buildConfig } from '../../util/portals'
import { locationPropType } from '../../util/propTypes/location'

import { availablePortals } from '../../../../../portals'

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
  match,
  portal,
  location,
  onChangePath,
  onChangeUrl
}) => {
  const defaultPortalId = getApplicationConfig().defaultPortal

  useEffect(() => {
    const { params } = match
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
  location: locationPropType.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      portalId: PropTypes.string
    })
  }).isRequired,
  portal: PropTypes.shape({
    title: PropTypes.shape({
      primary: PropTypes.string
    }),
    portalId: PropTypes.string
  }).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalContainer)
)
