import React from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

import './AdminRetrievalsMetricsList.scss'

export const AdminRetrievalsMetricsList = ({
  retrievalsMetrics
}) => {
  const {
    allAccessMethodTypes,
    byAccessMethodType,
    multCollectionResponse
  } = retrievalsMetrics

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Data Access Type</th>
            <th>Total Times Access Method Used</th>
            <th>Average Granule Count</th>
            <th>Total Granules Retrieved</th>
            <th>Average Granule Link Count</th>
            <th>Max Granule Link Count</th>
            <th>Minimum Granule Link Count</th>
          </tr>
        </thead>
        <tbody>
          {
            allAccessMethodTypes.map((dataRetrievalType) => {
              const retrieval = byAccessMethodType[dataRetrievalType]

              const {
                total_times_access_method_used: totalTimesAccessMethodUsed,
                average_granule_count: averageGranuleCount,
                average_granule_link_count: averageGranuleLinkCount,
                total_granules_retrieved: totalGranulesRetrieved,
                max_granule_link_count: maxGranuleLinkCount,
                min_granule_link_count: minGranuleLinkCount
              } = retrieval

              return (
                <tr
                  className="admin-retrievals-metrics-list__table-row"
                  key={dataRetrievalType}
                >
                  <td>{dataRetrievalType}</td>
                  <td>{totalTimesAccessMethodUsed}</td>
                  <td>{averageGranuleCount}</td>
                  <td>{totalGranulesRetrieved}</td>
                  {
                    (averageGranuleLinkCount || averageGranuleLinkCount === 0)
                      ? (
                        <td>
                          {averageGranuleLinkCount}
                        </td>
                      )
                      : (
                        <td> N/A </td>
                      )
                  }
                  {
                    maxGranuleLinkCount
                      ? (
                        <td>
                          {maxGranuleLinkCount}
                        </td>
                      )
                      : (
                        <td> N/A </td>
                      )
                  }
                  {
                    (minGranuleLinkCount || minGranuleLinkCount === 0)
                      ? (
                        <td>
                          {minGranuleLinkCount}
                        </td>
                      )
                      : (
                        <td> N/A </td>
                      )
                  }
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      <Table bordered>
        <thead>
          <tr>
            <th>Retrieval-id for retrievals that included multiple collections </th>
            <th>Number of collections in the retrieval</th>
          </tr>
        </thead>
        <tbody className="admin-retrievals-metrics-list__table-body">
          {
            multCollectionResponse.map((retrieval) => {
              const { retrieval_id: retreivalId, count } = retrieval

              return (
                <tr
                  className="admin-retrievals-metrics-list__table-row"
                  key={retreivalId}
                >
                  <td>
                    {retreivalId}
                  </td>
                  <td>
                    {count}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </>
  )
}

AdminRetrievalsMetricsList.defaultProps = {
  retrievalsMetrics: {}
}

AdminRetrievalsMetricsList.propTypes = {
  retrievalsMetrics: PropTypes.shape({
    allAccessMethodTypes: PropTypes.arrayOf(PropTypes.string),
    byAccessMethodType: PropTypes.shape({}),
    multCollectionResponse: PropTypes.arrayOf(PropTypes.shape({}))
  })
}

export default AdminRetrievalsMetricsList
