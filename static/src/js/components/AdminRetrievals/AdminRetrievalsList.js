import React from 'react'
import PropTypes from 'prop-types'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Table } from 'react-bootstrap'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import 'rc-pagination/assets/index.css'
// import 'rc-select/assets/index.css'

export const AdminRetrievalsList = ({
  retrievals,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPagination
}) => {
  const { allIds, byId, pagination } = retrievals

  const {
    pageNum,
    pageSize,
    totalResults
  } = pagination

  const handleSort = (e) => {
    console.log(e.target)
    onUpdateAdminRetrievalsSortKey('+created_at')
  }

  const handlePageChange = (pageNum) => {
    onUpdateAdminRetrievalsPagination(pageNum)
  }

  return (
    <>
      <h2>Retrievals</h2>
      <Table className="admin-retrieval-list__table" striped bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Obfuscated ID</th>
            <th
              onClick={handleSort}
            >
              User
            </th>
            <th
              onClick={handleSort}
            >
              Created
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
                <tr key={obfuscatedId}>
                  <td>
                    <PortalLinkContainer
                      to={`/admin/retrievals/${obfuscatedId}`}
                    >
                      {id}
                    </PortalLinkContainer>
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

      <Pagination
        current={pageNum}
        total={totalResults}
        pageSize={pageSize}
        onChange={handlePageChange}
        local={localeInfo}
      />
    </>
  )
}

AdminRetrievalsList.defaultProps = {
  retrievals: {}
}

AdminRetrievalsList.propTypes = {
  retrievals: PropTypes.shape({}),
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPagination: PropTypes.func.isRequired
}

export default AdminRetrievalsList
