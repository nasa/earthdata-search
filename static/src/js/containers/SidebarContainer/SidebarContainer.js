import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'

import FacetsContainer from '../FacetsContainer/FacetsContainer'
import ProjectCollectionsContainer from '../ProjectCollectionsContainer/ProjectCollectionsContainer'
import Sidebar from '../../components/Sidebar/Sidebar'
import SidebarSection from '../../components/Sidebar/SidebarSection'

const SidebarContainer = ({ location }) => {
  const facetsSidebar = () => (
    <SidebarSection sectionTitle="Browse Collections">
      <FacetsContainer />
    </SidebarSection>
  )

  const projectSidebar = () => (
    <ProjectCollectionsContainer />
  )

  const visible = pathname => pathname === 'search' || pathname === 'projects'
  const sidebarVisible = visible(location.pathname.replace(/\//g, ''))

  return (
    <Sidebar
      location={location}
      visible={sidebarVisible}
    >
      <Switch>
        <Route path="/search" component={facetsSidebar} />
        <Route path="/projects" component={projectSidebar} />
      </Switch>
    </Sidebar>
  )
}

SidebarContainer.propTypes = {
  location: PropTypes.shape({}).isRequired
}

export default withRouter(SidebarContainer)
