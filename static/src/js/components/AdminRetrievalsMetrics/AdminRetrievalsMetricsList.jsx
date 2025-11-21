import React from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

import commafy from '../../util/commafy'

import './AdminRetrievalsMetricsList.scss'

export const AdminRetrievalsMetricsList = ({
  retrievalsMetrics = {}
}) => {
  const { adminRetrievalsMetrics } = retrievalsMetrics
  const { retrievalMetricsByAccessType, multiCollectionResponse } = adminRetrievalsMetrics

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
            retrievalMetricsByAccessType.map((retrievalMetric) => {
              const {
                accessMethodType,
                averageGranuleCount,
                averageGranuleLinkCount,
                maxGranuleLinkCount,
                minGranuleLinkCount,
                totalGranulesRetrieved,
                totalTimesAccessMethodUsed
              } = retrievalMetric

              return (
                <tr
                  className="admin-retrievals-metrics-list__table-row"
                  key={accessMethodType}
                >
                  <td>{accessMethodType}</td>
                  <td>{commafy(totalTimesAccessMethodUsed)}</td>
                  <td>{commafy(averageGranuleCount)}</td>
                  <td>{commafy(totalGranulesRetrieved)}</td>
                  {
                    (averageGranuleLinkCount || averageGranuleLinkCount === 0)
                      ? (
                        <td>
                          {commafy(averageGranuleLinkCount)}
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
                          {commafy(maxGranuleLinkCount)}
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
                          {commafy(minGranuleLinkCount)}
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
            multiCollectionResponse.map((retrieval) => {
              const { obfuscatedId, collectionCount } = retrieval

              return (
                <tr
                  className="admin-retrievals-metrics-list__table-row"
                  key={obfuscatedId}
                >
                  <td>
                    {obfuscatedId}
                  </td>
                  <td>
                    {commafy(collectionCount)}
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

AdminRetrievalsMetricsList.propTypes = {
  retrievalsMetrics: PropTypes.shape({
    adminRetrievalsMetrics: PropTypes.shape({
      retrievalMetricsByAccessType: PropTypes.arrayOf(PropTypes.shape({
        accessMethodType: PropTypes.string,
        averageGranuleCount: PropTypes.string,
        averageGranuleLinkCount: PropTypes.string,
        maxGranuleLinkCount: PropTypes.number,
        minGranuleLinkCount: PropTypes.number,
        totalGranulesRetrieved: PropTypes.string,
        totalTimesAccessMethodUsed: PropTypes.string
      })),
      multiCollectionResponse: PropTypes.arrayOf(PropTypes.shape({
        retrievalId: PropTypes.number,
        collectionCount: PropTypes.number
      }))
    })
  })
}

export default AdminRetrievalsMetricsList
