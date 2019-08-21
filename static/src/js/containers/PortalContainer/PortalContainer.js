import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { startCase } from 'lodash'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onLoadPortalConfig:
    portalId => dispatch(actions.loadPortalConfig(portalId))
})

const mapStateToProps = state => ({
  portal: state.portal
})

export class PortalContainer extends Component {
  componentWillMount() {
    const { match, onLoadPortalConfig } = this.props
    const { params } = match
    const { portalId } = params

    onLoadPortalConfig(portalId)
  }

  render() {
    const { portal } = this.props
    const { portalId, title } = portal

    let portalTitle = ''
    if (portalId.length > 0) portalTitle = ` :: ${title || startCase(portalId)} Portal`

    return (
      <Helmet>
        <title>
          Earthdata Search
          {portalTitle}
        </title>
      </Helmet>
    )
  }
}

PortalContainer.propTypes = {
  match: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  onLoadPortalConfig: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalContainer)
)
