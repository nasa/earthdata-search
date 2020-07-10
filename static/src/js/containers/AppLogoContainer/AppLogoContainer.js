import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AppLogo from '../../components/AppLogo/AppLogo'

const mapStateToProps = state => ({
  portal: state.portal
})

export const AppLogoContainer = ({
  portal
}) => (
  <AppLogo
    portal={portal}
  />
)

AppLogoContainer.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(AppLogoContainer)
