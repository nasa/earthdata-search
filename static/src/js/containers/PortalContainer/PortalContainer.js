import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash'

import actions from '../../actions/index'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal } from '../../util/portals'

export const mapDispatchToProps = (dispatch) => ({
  onLoadPortalConfig:
    (portalId) => dispatch(actions.loadPortalConfig(portalId))
})

export const mapStateToProps = (state) => ({
  availablePortals: state.availablePortals,
  portal: state.portal
})

export class PortalContainer extends Component {
  UNSAFE_componentWillMount() {
    const { match, onLoadPortalConfig } = this.props
    const { params } = match
    const { portalId = getApplicationConfig().defaultPortal } = params

    onLoadPortalConfig(portalId)
  }

  render() {
    const { availablePortals, portal } = this.props
    const { portalId, title = {} } = portal
    const { primary: primaryTitle } = title

    let portalTitle = ''
    if (!isDefaultPortal(portalId)) portalTitle = ` :: ${primaryTitle || startCase(portalId)} Portal`
    // TODO pulls out the primary title from the portal
    // const defaultConfig = getPortalConfig(getApplicationConfig().defaultPortal)
    const { default: defaultPortal } = availablePortals

    const defaultConfig = defaultPortal
    // Use the default portal org and title for the page title
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
}

PortalContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      portalId: PropTypes.string
    })
  }).isRequired,
  availablePortals: PropTypes.shape({
    default:
  PropTypes.shape()
  }).isRequired,
  portal: PropTypes.shape({
    title: PropTypes.shape({
      primary: PropTypes.string
    }),
    portalId: PropTypes.string
  }).isRequired,
  onLoadPortalConfig: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalContainer)
)
