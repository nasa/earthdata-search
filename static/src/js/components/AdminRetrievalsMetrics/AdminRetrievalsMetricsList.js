import React from 'react'
// import PropTypes from 'prop-types'
// import Pagination from 'rc-pagination'
// import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Table } from 'react-bootstrap'
// import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

// import EDSCIcon from '../EDSCIcon/EDSCIcon'

import 'rc-pagination/assets/index.css'
import './AdminRetrievalsMetricsList.scss'

export const AdminRetrievalsMetricsList = ({
  // historyPush,
  retrievals
  // onUpdateAdminRetrievalsSortKey,
  // onUpdateAdminRetrievalsPageNum
}) => {
  const {
    allAccessMethodTypes,
    byAccessMethodType,
    multCollectionResponse
    // ,
    // pagination,
    // sortKey
  } = retrievals
  console.log('🚀 ~ file: AdminRetrievalsMetricsList.js:25 ~ retrievals:', retrievals)

  // const {
  //   pageNum,
  //   pageSize,
  //   totalResults
  // } = pagination

  // const handleSort = (value) => {
  //   onUpdateAdminRetrievalsSortKey(value)
  // }

  // const handlePageChange = (pageNum) => {
  //   onUpdateAdminRetrievalsPageNum(pageNum)
  // }

  // const onSetUsernameSort = () => {
  //   if (sortKey.indexOf('username') < 0) {
  //     handleSort('-username')
  //   }
  //   if (sortKey === '+username') {
  //     handleSort('')
  //   }
  //   if (sortKey === '-username') {
  //     handleSort('+username')
  //   }
  // }

  // const onSetCreatedSort = () => {
  //   if (sortKey.indexOf('created_at') < 0) {
  //     handleSort('-created_at')
  //   }
  //   if (sortKey === '+created_at') {
  //     handleSort('')
  //   }
  //   if (sortKey === '-created_at') {
  //     handleSort('+created_at')
  //   }
  // }

  return (
    <>
      <Table className="admin-retrievals-list__table" striped bordered>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            {/* <th
              className="admin-retrievals-list__interactive  admin-retrievals-list__table-head-cell--sortable"
              // onClick={() => onSetUsernameSort()}
              role="button"
            > */}
            {/* User/NAMEISED!! */}
            {/* {
                sortKey === '+username' && (
                  <EDSCIcon icon={FaCaretUp} className="admin-retrievals-list__sortable-icon" />
                )
              }
              {
                sortKey === '-username' && (
                  <EDSCIcon icon={FaCaretDown} className="admin-retrievals-list__sortable-icon" />
                )
              } */}
            {/* </th> */}
            <th>Data Access Type</th>
            <th>Total Times Access Method Used</th>
            <th>Average Granule Count</th>
            <th>Total Granules Retrieved</th>
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
                total_granules_retrieved: totalGranulesRetrieved,
                max_granule_link_count: maxGranuleLinkCount,
                min_granule_link_count: minGranuleLinkCount
              } = retrieval

              return (
                <tr
                  className="admin-retrievals-list__interactive"
                  key={dataRetrievalType}
                  // onClick={() => {
                  //   historyPush(`/admin/retrievals/${obfuscatedId}`)
                // }}
                  role="button"
                >
                  <td>{dataRetrievalType}</td>
                  <td>{totalTimesAccessMethodUsed}</td>
                  <td>{averageGranuleCount}</td>
                  <td>{totalGranulesRetrieved}</td>
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
                    minGranuleLinkCount
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
      <Table>
        <thead>
          <tr>
            <th>Retrievals that included multiple collections</th>
            <th>Number of collections in a retrieval</th>
          </tr>
        </thead>
        <tbody>
          {
            multCollectionResponse.map((retrieval) => {
              const { retrieval_id: retreivalId, count } = retrieval
              return (
                <tr
                  className="admin-retrievals-list__interactive"
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

// AdminRetrievalsMetricsList.defaultProps = {
//   retrievals: {}
// }

// AdminRetrievalsMetricsList.propTypes = {
//   // historyPush: PropTypes.func.isRequired,
//   retrievals: PropTypes.shape({
//     allAccessMethodTypes: PropTypes.arrayOf(PropTypes.string),
//     accessMethodType: PropTypes.shape({})
//   })
//   // ,
//   // onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
//   // onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired
// }

export default AdminRetrievalsMetricsList
