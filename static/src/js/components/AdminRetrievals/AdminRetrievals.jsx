import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminRetrievalsList from './AdminRetrievalsList'
import { routes } from '../../constants/routes'

const AdminRetrievals = () => (
  <AdminPage
    pageTitle="Retrievals"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: routes.ADMIN
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
