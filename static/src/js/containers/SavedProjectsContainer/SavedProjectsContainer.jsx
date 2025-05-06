import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { SavedProjects } from '../../components/SavedProjects/SavedProjects'

export const mapStateToProps = (state) => ({
  savedProjects: state.savedProjects.projects,
  savedProjectsIsLoading: state.savedProjects.isLoading,
  savedProjectsIsLoaded: state.savedProjects.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onDeleteSavedProject: (projectId) => dispatch(actions.deleteSavedProject(projectId)),
  onFetchSavedProjects: () => dispatch(actions.fetchSavedProjects()),
  onChangePath: (path) => dispatch(actions.changePath(path))
})

export const SavedProjectsContainer = (props) => {
  const {
    onFetchSavedProjects,
    savedProjects,
    savedProjectsIsLoading,
    savedProjectsIsLoaded,
    onChangePath,
    onDeleteSavedProject
  } = props

  useEffect(() => {
    onFetchSavedProjects()
  }, [onFetchSavedProjects])

  return (
    <SavedProjects
      savedProjects={savedProjects}
      savedProjectsIsLoading={savedProjectsIsLoading}
      savedProjectsIsLoaded={savedProjectsIsLoaded}
      onChangePath={onChangePath}
      onDeleteSavedProject={onDeleteSavedProject}
    />
  )
}

SavedProjectsContainer.defaultProps = {
  savedProjects: []
}

SavedProjectsContainer.propTypes = {
  savedProjects: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  savedProjectsIsLoading: PropTypes.bool.isRequired,
  savedProjectsIsLoaded: PropTypes.bool.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onDeleteSavedProject: PropTypes.func.isRequired,
  onFetchSavedProjects: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SavedProjectsContainer)
)
