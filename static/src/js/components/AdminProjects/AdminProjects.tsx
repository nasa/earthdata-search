import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectsList from './AdminProjectsList'

const AdminProjects = () => (
  <AdminPage
    pageTitle="Projects"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: '/admin'
        },
        {
          name: 'Projects',
          active: true
        }
      ]
    }
  >
    <Row>
      <Col>
        <AdminProjectsList />
      </Col>
    </Row>
  </AdminPage>
)

export default AdminProjects
