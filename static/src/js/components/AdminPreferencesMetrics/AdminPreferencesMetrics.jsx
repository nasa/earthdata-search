import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminPreferencesMetricsList } from './AdminPreferencesMetricsList'

export const AdminPreferencesMetrics = ({
  onFetchAdminMetricsPreferences,
  metricsPreferences
}) => {
  useEffect(async () => {
    await onFetchAdminMetricsPreferences()
  }, [])

  return (
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
            metricsPreferences={metricsPreferences}
          />
        </Col>
      </Row>
    </AdminPage>
  )
}

AdminPreferencesMetrics.defaultProps = {
  metricsPreferences: {}
}

AdminPreferencesMetrics.propTypes = {
  onFetchAdminMetricsPreferences: PropTypes.func.isRequired,
  metricsPreferences: PropTypes.shape({})
}

export default AdminPreferencesMetrics
