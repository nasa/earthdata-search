import React from 'react'
import PropTypes from 'prop-types'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails/AdminRetrievalDetails'
import { AdminPage } from '../AdminPage/AdminPage'

export const AdminMetrics = ({
  retrieval,
  onRequeueOrder
}) => {
  console.log('🚀 ~ file: AdminMetrics.js:11 ~ retrieval:', retrieval)
  return (
    <AdminPage
      pageTitle="Retrieval Details"
      breadcrumbs={[
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
      ]}
    >
      <AdminRetrievalDetails
        retrieval={retrieval}
        onRequeueOrder={onRequeueOrder}
      />
    </AdminPage>
  )
}

AdminMetrics.defaultProps = {
  retrieval: {}
}

AdminMetrics.propTypes = {
  retrieval: PropTypes.shape({}),
  onRequeueOrder: PropTypes.func.isRequired
}

export default AdminMetrics
