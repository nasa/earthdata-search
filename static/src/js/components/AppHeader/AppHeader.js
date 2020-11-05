import React from 'react'
// import PropTypes from 'prop-types'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'

import './AppHeader.scss'

const AppHeader = () => (
  <header className="app-header">
    <AppLogoContainer />
    <SecondaryToolbarContainer />
  </header>
)

AppHeader.propTypes = {
  // portal: PropTypes.shape({}).isRequired
}

export default AppHeader
