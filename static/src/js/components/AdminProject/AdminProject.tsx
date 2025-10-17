import React from 'react'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectDetails from '../AdminProjectDetails/AdminProjectDetails'
import { routes } from '../../constants/routes'

/** A component that displays a admin project */
export const AdminProject: React.FC = () => (
  <AdminPage
    pageTitle="Project Details"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: routes.ADMIN
        },
        {
          name: 'Projects',
          href: routes.ADMIN_PROJECTS
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
