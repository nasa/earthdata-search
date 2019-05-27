import React from 'react'

import ConnectedEdscMapContainer
  from '../../containers/MapContainer/MapContainer'
import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'

const Project = () => (
  <div className="route-wrapper route-wrapper--project">
    <ConnectedEdscMapContainer />
    <SidebarContainer />
    <SecondaryToolbarContainer />
    Project
  </div>
)

export default Project
