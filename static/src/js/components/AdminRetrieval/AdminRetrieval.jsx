import React from 'react'

import AdminRetrievalDetails from '../AdminRetrievalDetails/AdminRetrievalDetails'
import AdminPage from '../AdminPage/AdminPage'
import { routes } from '../../constants/routes'

const AdminRetrieval = () => (
  <AdminPage
    pageTitle="Retrieval Details"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: routes.ADMIN
        },
        {
          name: 'Retrievals',
          href: routes.ADMIN_RETRIEVALS
        },
        {
          name: 'Retrieval Details',
          active: true
        }
      ]
    }
  >
    <AdminRetrievalDetails />
  </AdminPage>
)

export default AdminRetrieval
