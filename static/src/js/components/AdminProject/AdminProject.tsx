import React from 'react'

import AdminPage from '../AdminPage/AdminPage'
// @ts-expect-error: This file does not have types
import AdminProjectDetails from '../AdminProjectDetails/AdminProjectDetails'

interface AdminProjectProps {
  /** The project details to display. */
  project?: Record<string, unknown>
}

export const AdminProject: React.FC<AdminProjectProps> = ({ project = {} }) => (
  <AdminPage
    pageTitle="Project Details"
    breadcrumbs={
      [
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
      ]
    }
  >
    <AdminProjectDetails project={project} />
  </AdminPage>
)

export default AdminProject
