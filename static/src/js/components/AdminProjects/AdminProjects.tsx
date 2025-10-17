import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectsList from './AdminProjectsList'
import { routes } from '../../constants/routes'

const AdminProjects = () => (
  <AdminPage
    pageTitle="Projects"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: routes.ADMIN
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
