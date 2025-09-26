import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import actions from '../../actions'
import AdminProject from '../../components/AdminProject/AdminProject'

export const mapStateToProps = (state) => ({
  projects: state.admin.projects.byId
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminProject: (id) => dispatch(actions.fetchAdminProject(id))
})

export const AdminProjectContainer = ({
  projects = {},
  onFetchAdminProject
}) => {
  const params = useParams()
  const { id } = params

  useEffect(() => {
    onFetchAdminProject(id)
  }, [])

  const { [id]: selectedProject } = projects

  return (
    <AdminProject
      project={selectedProject}
    />
  )
}

AdminProjectContainer.propTypes = {
  onFetchAdminProject: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProjectContainer)
