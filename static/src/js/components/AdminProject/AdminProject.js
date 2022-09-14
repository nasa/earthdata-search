import React from 'react'
import PropTypes from 'prop-types'

import { AdminProjectDetails } from '../AdminProjectDetails/AdminProjectDetails'
import { AdminPage } from '../AdminPage/AdminPage'

export const AdminProject = ({ project }) => (
  <AdminPage
    pageTitle="Project Details"
    breadcrumbs={[
      {
        name: 'Admin',
        href: '/admin'
      },
      {
        name: 'Projects',
        href: '/admin/projects'
      },
      {
        name: 'Project Details',
        active: true
      }
    ]}
  >
    <AdminProjectDetails
      project={project}
    />
  </AdminPage>
)

AdminProject.defaultProps = {
  project: {}
}

AdminProject.propTypes = {
  project: PropTypes.shape({})
}

export default AdminProject
