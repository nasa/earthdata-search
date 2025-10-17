import React from 'react'
import PropTypes from 'prop-types'

import AdminRetrievalDetails from '../AdminRetrievalDetails/AdminRetrievalDetails'
import AdminPage from '../AdminPage/AdminPage'
import { routes } from '../../constants/routes'

const AdminRetrieval = ({
  obfuscatedId,
  onRequeueOrder
}) => (
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
      onRequeueOrder={onRequeueOrder}
    />
  </AdminPage>
)

AdminRetrieval.propTypes = {
  obfuscatedId: PropTypes.string.isRequired,
  onRequeueOrder: PropTypes.func.isRequired
}

export default AdminRetrieval
