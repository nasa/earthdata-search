import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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

export const AdminProjectsContainer = ({
  onAdminViewProject,
  onFetchAdminProjects,
  onUpdateAdminProjectsSortKey,
  onUpdateAdminProjectsPageNum,
  projects
}) => {
  useEffect(() => {
    onFetchAdminProjects()
  }, [])

  return (
    <AdminProjects
      onAdminViewProject={onAdminViewProject}
      onFetchAdminProjects={onFetchAdminProjects}
      onUpdateAdminProjectsSortKey={onUpdateAdminProjectsSortKey}
      onUpdateAdminProjectsPageNum={onUpdateAdminProjectsPageNum}
      projects={projects}
    />
  )
}

AdminProjectsContainer.defaultProps = {
  projects: {}
}

AdminProjectsContainer.propTypes = {
  onAdminViewProject: PropTypes.func.isRequired,
  onFetchAdminProjects: PropTypes.func.isRequired,
  onUpdateAdminProjectsPageNum: PropTypes.func.isRequired,
  onUpdateAdminProjectsSortKey: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProjectsContainer)
