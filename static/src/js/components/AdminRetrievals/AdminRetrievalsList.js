import React from 'react'
import PropTypes from 'prop-types'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Table } from 'react-bootstrap'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import 'rc-pagination/assets/index.css'
import './AdminRetrievalsList.scss'

export const AdminRetrievalsList = ({
  historyPush,
  retrievals,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPageNum
}) => {
  const {
    allIds,
    byId,
    pagination,
    sortKey
  } = retrievals

  const {
    pageNum,
    pageSize,
    totalResults
  } = pagination

  const handleSort = (value) => {
    onUpdateAdminRetrievalsSortKey(value)
  }

  const handlePageChange = (pageNum) => {
    onUpdateAdminRetrievalsPageNum(pageNum)
  }

  const onSetUsernameSort = () => {
    if (sortKey.indexOf('username') < 0) {
      handleSort('-username')
    }
    if (sortKey === '+username') {
      handleSort('')
    }
    if (sortKey === '-username') {
      handleSort('+username')
    }
  }

  const onSetCreatedSort = () => {
    if (sortKey.indexOf('created_at') < 0) {
      handleSort('-created_at')
    }
    if (sortKey === '+created_at') {
      handleSort('')
    }
    if (sortKey === '-created_at') {
      handleSort('+created_at')
    }
  }

  return (
    <>
      <Table className="admin-retrievals-list__table" striped bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Obfuscated ID</th>
            <th
              className="admin-retrievals-list__interactive  admin-retrievals-list__table-head-cell--sortable"
              onClick={() => onSetUsernameSort()}
              role="button"
            >
              User
              {
                sortKey === '+username' && (
                  <EDSCIcon icon={FaCaretUp} className="admin-retrievals-list__sortable-icon" />
                )
              }
              {
                sortKey === '-username' && (
                  <EDSCIcon icon={FaCaretDown} className="admin-retrievals-list__sortable-icon" />
                )
              }
            </th>
            <th
              className="admin-retrievals-list__interactive admin-retrievals-list__table-head-cell--sortable"
              onClick={() => onSetCreatedSort()}
              role="button"
            >
              Created
              {
                sortKey === '+created_at' && (
                  <EDSCIcon icon={FaCaretUp} className="admin-retrievals-list__sortable-icon" />
                )
              }
              {
                sortKey === '-created_at' && (
                  <EDSCIcon icon={FaCaretDown} className="admin-retrievals-list__sortable-icon" />
                )
              }
            </th>
          </tr>
        </thead>
        <tbody>
          {
            allIds.map((obfuscatedId) => {
              const retrieval = byId[obfuscatedId]

              const {
                created_at: createdAt,
                id,
                username
              } = retrieval

              return (
                <tr
                  className="admin-retrievals-list__interactive"
                  key={obfuscatedId}
                  onClick={() => {
                    historyPush(`/admin/retrievals/${obfuscatedId}`)
                  }}
                  role="button"
                >
                  <td>
                    {id}
                  </td>
                  <td>
                    {obfuscatedId}
                  </td>
                  <td>{username}</td>
                  <td>{createdAt}</td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      <div className="admin-retrievals-list__pagination-wrapper">
        <Pagination
          className="admin-retrievals-list__pagination"
          current={pageNum}
          total={totalResults}
          pageSize={pageSize}
          onChange={handlePageChange}
          locale={localeInfo}
        />
      </div>
    </>
  )
}

AdminRetrievalsList.defaultProps = {
  retrievals: {}
}

AdminRetrievalsList.propTypes = {
  historyPush: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    byId: PropTypes.shape({}),
    pagination: PropTypes.shape({
      pageNum: PropTypes.number,
      pageSize: PropTypes.number,
      totalResults: PropTypes.number
    }),
    sortKey: PropTypes.string
  }),
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired
}

export default AdminRetrievalsList
