import React from 'react'
import PropTypes from 'prop-types'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'

import './AppHeader.scss'

const AppHeader = ({ onStartTour }) => (
  <header className="app-header">
    <AppLogoContainer />
    <SecondaryToolbarContainer onStartTour={onStartTour} />
  </header>
)

AppHeader.propTypes = {
  onStartTour: PropTypes.func.isRequired
}

export default AppHeader
