import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsList } from './AdminRetrievalsList'

export const AdminRetrievals = ({
  historyPush
}) => (
  <AdminPage
    pageTitle="Retrievals"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: '/admin'
        },
        {
          name: 'Retrievals',
          active: true
        }
      ]
    }
  >
    <Row>
      <Col>
        <AdminRetrievalsList
          historyPush={historyPush}
        />
      </Col>
    </Row>
  </AdminPage>
)

AdminRetrievals.propTypes = {
  historyPush: PropTypes.func.isRequired
}

export default AdminRetrievals
