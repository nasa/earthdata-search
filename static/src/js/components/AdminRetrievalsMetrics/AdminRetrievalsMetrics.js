import React, {
  useState
} from 'react'

// import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsMetricsList } from './AdminRetrievalsMetricsList'
// import { AdminRetrievalsMetricsForm } from './AdminRetrievalsMetricsForm'
// import { adminRetrievalMetrics } from '../../util/adminRetrievalMetrics/adminRetrievalMetrics'
import TemporalSelectionDropdown from '../TemporalDisplay/TemporalSelectionDropdown'

export const AdminRetrievalsMetrics = ({
  // historyPush,
  // onAdminViewRetrieval,
  // onUpdateAdminRetrievalsSortKey,
  // onUpdateAdminRetrievalsPageNum,
  onFetchAdminRetrievals,
  onUpdateAdminMetricsRetrievalsStartDate,
  onUpdateAdminMetricsRetrievalsEndDate,
  retrievals
}) => {
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
      onFetchAdminRetrievals()
    }
  }
  // adminRetrievalMetrics(retrievals)
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
                <>
                  <h3>
                    Current temporal filters
                  </h3>
                  <div>
                    <br />
                    {' Start Date: '}
                    {startDate}
                    <br />
                    {'End Date: '}
                    {endDate}
                  </div>
                </>
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
          {/* <AdminRetrievalsMetricsForm
            onAdminViewRetrieval={onAdminViewRetrieval}
          /> */}
          <TemporalSelectionDropdown onChangeQuery={onChangeQuery} allowRecurring={false} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AdminRetrievalsMetricsList
            // historyPush={historyPush}
            // onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
            // onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
            retrievals={retrievals}
          />
        </Col>
      </Row>
    </AdminPage>
  )
}

// AdminRetrievalsMetrics.defaultProps = {
//   retrievals: {}
// }

// AdminRetrievalsMetrics.propTypes = {
//   historyPush: PropTypes.func.isRequired,
//   onAdminViewRetrieval: PropTypes.func.isRequired,
//   onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
//   onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
//   retrievals: PropTypes.shape({})
// }

export default AdminRetrievalsMetrics
