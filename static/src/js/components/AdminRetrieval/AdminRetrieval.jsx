import React from 'react'
import PropTypes from 'prop-types'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails/AdminRetrievalDetails'
import { AdminPage } from '../AdminPage/AdminPage'

export const AdminRetrieval = ({
  obfuscatedId,
  onRequeueOrder
}) => (
  <AdminPage
    pageTitle="Retrieval Details"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: '/admin'
        },
        {
          name: 'Retrievals',
          href: '/admin/retrievals'
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
