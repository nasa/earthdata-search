import React from 'react'
import { useParams } from 'react-router-dom'

import AdminRetrievalDetails from '../AdminRetrievalDetails/AdminRetrievalDetails'
import AdminPage from '../AdminPage/AdminPage'
import { routes } from '../../constants/routes'

const AdminRetrieval = () => {
  const params = useParams()
  const { obfuscatedId } = params

  return (
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
      <AdminRetrievalDetails
        obfuscatedId={obfuscatedId}
      />
    </AdminPage>
  )
}

export default AdminRetrieval
