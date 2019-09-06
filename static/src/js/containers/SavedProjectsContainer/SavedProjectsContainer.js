import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { SavedProjects } from '../../components/SavedProjects/SavedProjects'

const mapStateToProps = state => ({
  savedProjects: state.savedProjects
})

const mapDispatchToProps = dispatch => ({
  onDeleteSavedProject: projectId => dispatch(actions.deleteSavedProject(projectId)),
  onFetchSavedProjects: () => dispatch(actions.fetchSavedProjects())
})

export class SavedProjectsContainer extends Component {
  componentDidMount() {
    const {
      onFetchSavedProjects
    } = this.props

    onFetchSavedProjects()
  }

  render() {
    const { savedProjects, onDeleteSavedProject } = this.props

    return (
      <SavedProjects
        savedProjects={savedProjects}
        onDeleteSavedProject={onDeleteSavedProject}
      />
    )
  }
}

SavedProjectsContainer.defaultProps = {
  savedProjects: []
}

SavedProjectsContainer.propTypes = {
  savedProjects: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  onDeleteSavedProject: PropTypes.func.isRequired,
  onFetchSavedProjects: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SavedProjectsContainer)
)
