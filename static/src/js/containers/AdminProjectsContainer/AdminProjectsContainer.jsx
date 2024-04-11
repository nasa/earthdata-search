import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminProjects from '../../components/AdminProjects/AdminProjects'

export const mapStateToProps = (state) => ({
  projects: state.admin.projects,
  projectsLoading: state.admin.projects.isLoading,
  projectsLoaded: state.admin.projects.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onAdminViewProject:
    (projectId) => dispatch(actions.adminViewProject(projectId)),
  onFetchAdminProjects:
    () => dispatch(actions.fetchAdminProjects()),
  onUpdateAdminProjectsSortKey:
    (sortKey) => dispatch(
      actions.updateAdminProjectsSortKey(sortKey)
    ),
  onUpdateAdminProjectsPageNum:
    (pageNum) => dispatch(
      actions.updateAdminProjectsPageNum(pageNum)
    )
})

export class AdminProjectsContainer extends Component {
  componentDidMount() {
    const {
      onFetchAdminProjects
    } = this.props

    onFetchAdminProjects()
  }

  render() {
    const {
      history,
      onAdminViewProject,
      onFetchAdminProjects,
      onUpdateAdminProjectsSortKey,
      onUpdateAdminProjectsPageNum,
      projects
    } = this.props

    const {
      push: historyPush
    } = history

    return (
      <AdminProjects
        historyPush={historyPush}
        onAdminViewProject={onAdminViewProject}
        onFetchAdminProjects={onFetchAdminProjects}
        onUpdateAdminProjectsSortKey={onUpdateAdminProjectsSortKey}
        onUpdateAdminProjectsPageNum={onUpdateAdminProjectsPageNum}
        projects={projects}
      />
    )
  }
}

AdminProjectsContainer.defaultProps = {
  projects: {}
}

AdminProjectsContainer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  onAdminViewProject: PropTypes.func.isRequired,
  onFetchAdminProjects: PropTypes.func.isRequired,
  onUpdateAdminProjectsPageNum: PropTypes.func.isRequired,
  onUpdateAdminProjectsSortKey: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminProjectsContainer)
)
