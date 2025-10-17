import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminPreferencesMetricsList from './AdminPreferencesMetricsList'
import { routes } from '../../constants/routes'

const AdminPreferencesMetrics = () => (
  <AdminPage
    pageTitle="Preferences Metrics"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: routes.ADMIN
        },
        {
          name: 'Preferences Metrics',
          active: true
        }
      ]
    }
  >
    <Row>
      <Col>
        <AdminPreferencesMetricsList />
      </Col>
    </Row>
  </AdminPage>
)

export default AdminPreferencesMetrics
