import React from 'react'

import Facets from './Facets/Facets'
import SidebarSection from './SidebarSection/SidebarSection'

import Header from './Header/Header'

import './SidebarContainer.scss'

const SidebarContainer = () => (
  <section className="sidebar">
    <Header />
    <SidebarSection sectionTitle="Browse Collections">
      <Facets />
    </SidebarSection>
  </section>
)

export default SidebarContainer
