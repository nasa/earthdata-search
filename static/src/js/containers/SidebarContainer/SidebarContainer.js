import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

import ConnectedFacetsContainer from '../FacetsContainer/FacetsContainer'
import ConnectedProjectCollectionsContainer from '../ProjectCollectionsContainer/ProjectCollectionsContainer'
import SidebarSection from './SidebarSection/SidebarSection'

import Header from './Header/Header'

import './SidebarContainer.scss'

const SidebarContainer = () => {
  const facetsSidebar = () => (
    <SidebarSection sectionTitle="Browse Collections">
      <ConnectedFacetsContainer />
    </SidebarSection>
  )

  const projectSidebar = () => (
    <ConnectedProjectCollectionsContainer />
  )

  return (
    <section className="sidebar">
      <Header />
      <Switch>
        <Route path="/search" component={facetsSidebar} />
        <Route path="/projects" component={projectSidebar} />
      </Switch>
    </section>
  )
}

export default withRouter(SidebarContainer)
