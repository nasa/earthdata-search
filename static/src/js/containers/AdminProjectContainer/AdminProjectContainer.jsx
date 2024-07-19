import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminProject from '../../components/AdminProject/AdminProject'

export const mapStateToProps = (state) => ({
  projects: state.admin.projects.byId
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminProject: (id) => dispatch(actions.fetchAdminProject(id))
})

export class AdminProjectContainer extends Component {
  componentDidMount() {
    const {
      match,
      onFetchAdminProject
    } = this.props

    const { params } = match
    const { id } = params

    onFetchAdminProject(id)
  }

  render() {
    const {
      match,
      projects
    } = this.props

    const { params } = match
    const { id } = params

    const { [id]: selectedProject } = projects

    return (
      <AdminProject
        project={selectedProject}
      />
    )
  }
}

AdminProjectContainer.defaultProps = {
  projects: {}
}

AdminProjectContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  onFetchAdminProject: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminProjectContainer)
)
