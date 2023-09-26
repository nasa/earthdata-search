import React from 'react'
import PropTypes from 'prop-types'
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
  // todo this function will need to requery the database with specific datetimes
  const onChangeQuery = (event) => {
    const { collection } = event

    const { temporal } = collection

    const { startDate, endDate } = temporal
    onUpdateAdminMetricsRetrievalsStartDate(startDate)
    onUpdateAdminMetricsRetrievalsEndDate(endDate)
    // todo leave comment
    // pass the `startDate` and `endDate` as filters in the event
    // const temporalFilter = { startDate, endDate }
    const newRetrievalValues = onFetchAdminRetrievals()
    console.log('🚀 ~ file: AdminRetrievalsMetrics.js:24 ~ onChangeQuery ~ newRetrievalValues:', newRetrievalValues)
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
      <Row className="justify-content-end mb-2">
        <Col sm="auto">
          {/* <AdminRetrievalsMetricsForm
            onAdminViewRetrieval={onAdminViewRetrieval}
          /> */}
          <TemporalSelectionDropdown onChangeQuery={onChangeQuery} />
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
