import React, {
  useState
} from 'react'

import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsMetricsList } from './AdminRetrievalsMetricsList'
import TemporalSelectionDropdown from '../TemporalDisplay/TemporalSelectionDropdown'

export const AdminRetrievalsMetrics = ({
  onFetchAdminMetricsRetrievals,
  onUpdateAdminMetricsRetrievalsStartDate,
  onUpdateAdminMetricsRetrievalsEndDate,
  retrievals
}) => {
  console.log('🚀 ~ file: AdminRetrievalsMetrics.js:18 ~ retrievals:', retrievals)
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')

  const onChangeQuery = (event) => {
    const { collection } = event

    const { temporal } = collection

    const { startDate, endDate } = temporal

    // Update `redux` stores
    onUpdateAdminMetricsRetrievalsStartDate(startDate)
    onUpdateAdminMetricsRetrievalsEndDate(endDate)

    // Only query database if a temporal filter is selected
    if (startDate || endDate) {
      setStartDate(startDate)
      setEndDate(endDate)
      onFetchAdminMetricsRetrievals()
    }
  }

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
      <Row className="justify-content-start mb-2">
        <Col sm="auto">
          {
            (startDate || endDate)
              ? (
                <div>
                  <h3>
                    Current temporal filters
                  </h3>
                  <h5>
                    Start Date:
                    {startDate}
                  </h5>
                  <br />
                  <h5>
                    End Date:
                    {endDate}
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
  onFetchAdminMetricsRetrievals: PropTypes.func.isRequired,
  onUpdateAdminMetricsRetrievalsStartDate: PropTypes.func.isRequired,
  onUpdateAdminMetricsRetrievalsEndDate: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default AdminRetrievalsMetrics
