import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminPreferencesMetricsList from './AdminPreferencesMetricsList'

const AdminPreferencesMetrics = ({
  preferencesMetrics
}) => (
  <AdminPage
    pageTitle="Preferences Metrics"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: '/admin'
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
        <AdminPreferencesMetricsList
          preferencesMetrics={preferencesMetrics}
        />
      </Col>
    </Row>
  </AdminPage>
)

AdminPreferencesMetrics.defaultProps = {
  preferencesMetrics: {}
}

AdminPreferencesMetrics.propTypes = {
  preferencesMetrics: PropTypes.shape({})
}

export default AdminPreferencesMetrics
