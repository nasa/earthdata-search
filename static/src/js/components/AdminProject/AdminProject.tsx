import React from 'react'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectDetails from '../AdminProjectDetails/AdminProjectDetails'

/** An interface for the AdminProject component props */
interface AdminProjectProps {}

/** A component that displays a admin project */
export const AdminProject: React.FC<AdminProjectProps> = () => (
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
