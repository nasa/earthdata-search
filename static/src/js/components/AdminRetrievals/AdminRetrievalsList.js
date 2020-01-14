import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import { Table } from 'react-bootstrap'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

export const AdminRetrievalsList = ({
  retrievals,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPagination
}) => {
  const { allIds, byId, pagination } = retrievals

  const {
    pageCount
  } = pagination

  const handleSort = (e) => {
    console.log(e.target)
    onUpdateAdminRetrievalsSortKey('+created_at')
  }

  const handlePageChange = (data) => {
    const { selected } = data

    onUpdateAdminRetrievalsPagination((selected + 1))
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

      <ReactPaginate
        initialPage={1}
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={5}
        onPageChange={handlePageChange}
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
