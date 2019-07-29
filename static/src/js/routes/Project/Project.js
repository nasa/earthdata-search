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
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'

import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval())
})

export class Project extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()

    const { onSubmitRetrieval } = this.props
    onSubmitRetrieval()
  }

  render() {
    return (
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
            <SecondaryToolbarContainer />
          </header>
        </div>
        <OverrideTemporalModalContainer />
      </form>
    )
  }
}

Project.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Project)
)
