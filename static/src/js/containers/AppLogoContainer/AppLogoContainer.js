import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import AppLogo from '../../components/AppLogo/AppLogo'

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export const AppLogoContainer = ({
  match,
  portal
}) => (
  <AppLogo
    match={match}
    portal={portal}
  />
)

AppLogoContainer.propTypes = {
  match: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(AppLogoContainer)
)
