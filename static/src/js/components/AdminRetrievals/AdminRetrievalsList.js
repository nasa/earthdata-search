import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

export const AdminRetrievalsList = ({
  retrievals
}) => (
  <>
    <h2>Retrievals</h2>
    <Table className="admin-retrieval-list__table" striped bordered>
      <thead>
        <tr>
          <th>ID</th>
          <th>Obfuscated ID</th>
          <th>User</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.values(retrievals).length > 0 && Object.values(retrievals).map((retrieval) => {
            const {
              created_at: createdAt,
              id,
              obfuscated_id: obfuscatedId,
              username
            } = retrieval

            return (
              <tr key={id}>
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

AdminRetrievalsList.defaultProps = {
  retrievals: {}
}

AdminRetrievalsList.propTypes = {
  retrievals: PropTypes.shape({})
  // retrievalsLoading: PropTypes.bool.isRequired,
  // retrievalsLoaded: PropTypes.bool.isRequired
}

export default AdminRetrievalsList
