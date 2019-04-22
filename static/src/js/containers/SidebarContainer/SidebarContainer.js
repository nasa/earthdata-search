import React from 'react'

import ConnectedFacetsContainer from '../FacetsContainer/FacetsContainer'
import SidebarSection from './SidebarSection/SidebarSection'

import Header from './Header/Header'

import './SidebarContainer.scss'

const SidebarContainer = () => {
  return (
    <section className="sidebar">
      <Header />
      <SidebarSection sectionTitle="Browse Collections">
        <ConnectedFacetsContainer />
      </SidebarSection>
    </section>
  )
}

export default SidebarContainer
