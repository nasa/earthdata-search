import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsMetricsList } from './AdminRetrievalsMetricsList'
import { AdminRetrievalsMetricsForm } from './AdminRetrievalsMetricsForm'
import { adminRetrievalMetrics } from '../../util/adminRetrievalMetrics/adminRetrievalMetrics'

export const AdminRetrievalsMetrics = ({
  historyPush,
  onAdminViewRetrieval,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPageNum,
  retrievals
}) => {
  // todo call and parse retrievals
  // todo rename function for consistency
  adminRetrievalMetrics(retrievals)
  return (
    <AdminPage
      pageTitle="Retrieval Metrics"
      breadcrumbs={[
        {
          name: 'Admin',
          href: '/admin'
        },
        {
          name: 'Retrievals Metrics',
          active: true
        }
      ]}
    >
      <Row className="justify-content-end mb-2">
        <Col sm="auto">
          <AdminRetrievalsMetricsForm
            onAdminViewRetrieval={onAdminViewRetrieval}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <AdminRetrievalsMetricsList
            historyPush={historyPush}
            onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
            onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
            retrievals={retrievals}
          />
        </Col>
      </Row>
    </AdminPage>
  )
}

AdminRetrievalsMetrics.defaultProps = {
  retrievals: {}
}

AdminRetrievalsMetrics.propTypes = {
  historyPush: PropTypes.func.isRequired,
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default AdminRetrievalsMetrics
