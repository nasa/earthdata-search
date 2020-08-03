import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { getProjectCollectionsRequiringChunking } from '../../selectors/project'

import SidebarContainer
  from '../../containers/SidebarContainer/SidebarContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import ProjectCollectionsContainer
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import ProjectPanelsContainer
  from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
import EdscMapContainer
  from '../../containers/MapContainer/MapContainer'
import SavedProjectsContainer from '../../containers/SavedProjectsContainer/SavedProjectsContainer'
import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'
import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'


const mapDispatchToProps = dispatch => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval()),
  onToggleChunkedOrderModal:
    isOpen => dispatch(actions.toggleChunkedOrderModal(isOpen))
})

const mapStateToProps = state => ({
  projectCollectionsRequiringChunking: getProjectCollectionsRequiringChunking(state)
})

export class Project extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()

    const {
      onSubmitRetrieval,
      onToggleChunkedOrderModal,
      projectCollectionsRequiringChunking
    } = this.props

    if (Object.keys(projectCollectionsRequiringChunking).length > 1) {
      onToggleChunkedOrderModal(true)
    } else {
      onSubmitRetrieval()
    }
  }

  render() {
    const {
      location
    } = this.props
    const { search } = location

    // If there are no params in the URL, show the saved projects page
    if (search === '') {
      return (
        <AuthRequiredContainer>
          <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
            <div className="route-wrapper__content">
              <header className="route-wrapper__header">
                <div className="route-wrapper__header-primary">
                  <AppLogoContainer />
                  <SecondaryToolbarContainer />
                </div>
              </header>
              <div className="route-wrapper__content-inner">
                <SavedProjectsContainer />
              </div>
            </div>
          </div>
        </AuthRequiredContainer>
      )
    }

    // Show the project page
    return (
      <AuthRequiredContainer>
        <form
          id="form__project"
          onSubmit={this.handleSubmit}
          method="post"
          className="route-wrapper route-wrapper--project"
        >
          <SidebarContainer
            panels={<ProjectPanelsContainer />}
          >
            <ProjectCollectionsContainer />
          </SidebarContainer>
          <div className="route-wrapper__content">
            <header className="route-wrapper__header">
              <div className="route-wrapper__header-primary">
                <SecondaryToolbarContainer />
              </div>
            </header>
          </div>
          <OverrideTemporalModalContainer />
        </form>
        <EdscMapContainer />
      </AuthRequiredContainer>
    )
  }
}

Project.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  projectCollectionsRequiringChunking: PropTypes.shape({}).isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Project)
)
