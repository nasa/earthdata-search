import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash'

import actions from '../../actions/index'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal, getPortalConfig } from '../../util/portals'

export const mapDispatchToProps = (dispatch) => ({
  onLoadPortalConfig:
    (portalId) => dispatch(actions.loadPortalConfig(portalId))
})

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export class PortalContainer extends Component {
  componentWillMount() {
    const { match, onLoadPortalConfig } = this.props
    const { params } = match
    const { portalId = getApplicationConfig().defaultPortal } = params

    onLoadPortalConfig(portalId)
  }

  render() {
    const { portal } = this.props
    const { portalId, pageTitle } = portal

    let portalTitle = ''
    if (!isDefaultPortal(portalId)) portalTitle = ` :: ${pageTitle || startCase(portalId)} Portal`

    const { env } = getApplicationConfig()
    const titleEnv = env.toUpperCase() === 'PROD' ? '' : `[${env.toUpperCase()}] `

    const defaultConfig = getPortalConfig(getApplicationConfig().defaultPortal)

    // Use the default portal org and title for the page title
    const {
      org: defaultOrg,
      title: defaultTitle
    } = defaultConfig

    return (
      <Helmet>
        <title>
          {titleEnv}
          {defaultOrg}
          {' '}
          {defaultTitle}
          {portalTitle}
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
  portal: PropTypes.shape({
    pageTitle: PropTypes.string,
    portalId: PropTypes.string
  }).isRequired,
  onLoadPortalConfig: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalContainer)
)
