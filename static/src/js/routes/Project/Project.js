import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import ProjectCollectionsContainer
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import ProjectPanelsContainer
  from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onMasterOverlayHeightChange:
    newHeight => dispatch(actions.masterOverlayPanelResize(newHeight))
})

export class Project extends Component {
  componentDidMount() {
    const { onMasterOverlayHeightChange } = this.props

    // Set the height of the master overlay to 0px by default. This makes sure the
    // .leaflet-control-container is set to 100% height
    onMasterOverlayHeightChange(0)
  }

  render() {
    return (
      <div className="route-wrapper route-wrapper--project">
        <SidebarContainer
          panels={<ProjectPanelsContainer />}
        >
          <ProjectCollectionsContainer />
        </SidebarContainer>
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            <SecondaryToolbarContainer />
          </header>
        </div>
      </div>
    )
  }
}

Project.propTypes = {
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Project)
)
