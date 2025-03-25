import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsMetricsList } from './AdminRetrievalsMetricsList'
import TemporalSelectionDropdown from '../TemporalDisplay/TemporalSelectionDropdown'
import setTemporalFilters from './setTemporalFilters'

export const AdminRetrievalsMetrics = ({
  onFetchAdminRetrievalsMetrics,
  onUpdateAdminRetrievalsMetricsStartDate,
  onUpdateAdminRetrievalsMetricsEndDate,
  retrievalsMetrics
}) => {
  const [temporalFilterEndDate, setTemporalFilterEndDate] = useState('')
  const [temporalFilterStartDate, setTemporalFilterStartDate] = useState('')

  const onChangeQuery = (event) => {
    setTemporalFilters(event, {
      onUpdateAdminRetrievalsMetricsStartDate,
      onUpdateAdminRetrievalsMetricsEndDate,
      setTemporalFilterStartDate,
      setTemporalFilterEndDate,
      onFetchAdminRetrievalsMetrics
    })
  }

  return (
    <AdminPage
      pageTitle="Retrieval Metrics"
      breadcrumbs={
        [
          {
            name: 'Admin',
            href: '/admin'
          },
          {
            name: 'Retrievals Metrics',
            active: true
          }
        ]
      }
    >
      <Row className="justify-content-start mb-2">
        <Col sm="auto">
          {
            (temporalFilterEndDate || temporalFilterStartDate)
              ? (
                <div>
                  <h3>
                    Current temporal filters
                  </h3>
                  <br />
                  <h5>
                    Start Date:
                    {temporalFilterStartDate}
                  </h5>
                  <br />
                  <h5>
                    End Date:
                    {temporalFilterEndDate}
                  </h5>
                </div>
              )
              : (
                <p>
                  Enter a value for the temporal filter
                </p>
              )
          }
        </Col>
      </Row>
      <Row className="justify-content-end mb-2">
        <Col sm="auto">
          <TemporalSelectionDropdown
            onChangeQuery={onChangeQuery}
            allowRecurring={false}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <AdminRetrievalsMetricsList
            retrievalsMetrics={retrievalsMetrics}
          />
        </Col>
      </Row>
    </AdminPage>
  )
}

AdminRetrievalsMetrics.defaultProps = {
  retrievalsMetrics: {}
}

AdminRetrievalsMetrics.propTypes = {
  onFetchAdminRetrievalsMetrics: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsStartDate: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsMetricsEndDate: PropTypes.func.isRequired,
  retrievalsMetrics: PropTypes.shape({})
}

export default AdminRetrievalsMetrics
