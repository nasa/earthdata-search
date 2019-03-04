import React from 'react'

import Facets from './Facets/Facets'
import SidebarSection from './SidebarSection/SidebarSection'

import Header from './Header/Header'

import './Sidebar.scss'

const Sidebar = () => (
  <section className="sidebar">
    <Header />
    <SidebarSection sectionTitle="Browse Collections">
      <Facets />
    </SidebarSection>
  </section>
)

export default Sidebar
