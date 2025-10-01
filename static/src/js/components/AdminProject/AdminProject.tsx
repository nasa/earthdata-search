import React from 'react'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectDetails from '../AdminProjectDetails/AdminProjectDetails'

/** A component that displays a admin project */
export const AdminProject: React.FC = () => (
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
    <AdminProjectDetails />
  </AdminPage>
)

export default AdminProject
