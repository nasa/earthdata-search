import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

export const AdminRetrievalsList = ({
  retrievals,
  onUpdateAdminRetrievalsSortKey
}) => {
  const { allIds, byId } = retrievals

  const handleSort = (e) => {
    console.log(e.target)
    onUpdateAdminRetrievalsSortKey('+created_at')
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
    </>
  )
}

AdminRetrievalsList.defaultProps = {
  retrievals: {}
}

AdminRetrievalsList.propTypes = {
  retrievals: PropTypes.shape({}),
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired
  // retrievalsLoading: PropTypes.bool.isRequired,
  // retrievalsLoaded: PropTypes.bool.isRequired
}

export default AdminRetrievalsList
