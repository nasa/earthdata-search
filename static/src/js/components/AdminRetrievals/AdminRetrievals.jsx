import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsList } from './AdminRetrievalsList'

export const AdminRetrievals = () => (
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
        <AdminRetrievalsList />
      </Col>
    </Row>
  </AdminPage>
)

export default AdminRetrievals
