import React from 'react'
import PropTypes from 'prop-types'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails/AdminRetrievalDetails'
import { AdminPage } from '../AdminPage/AdminPage'

export const AdminRetrieval = ({
  retrieval
}) => (
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
    />
  </AdminPage>
)

AdminRetrieval.defaultProps = {
  retrieval: {}
}

AdminRetrieval.propTypes = {
  retrieval: PropTypes.shape({})
}

export default AdminRetrieval
