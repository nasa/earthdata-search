import React from 'react'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
// Import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'

import './AppHeader.scss'

const AppHeader = () => (
  <header className="app-header">
    {/* <AppLogoContainer /> */}
    <SecondaryToolbarContainer />
  </header>
)

export default AppHeader
