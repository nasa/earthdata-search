import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => ({
  admin: state.admin
})

export const AdminRetrievalsList = ({
  retrievals
}) => (
  <>
    <h2>Retrievals</h2>
    <Table className="admin-retrieval-table" striped variant="dark">
      <thead>
        <tr>
          <th>ID</th>
          <th>Obfuscated ID</th>
          <th>User</th>
          <th>Collections</th>
        </tr>
      </thead>
      <tbody>
        {
          retrievals.length > 0 && retrievals.map((retrieval) => {
            const {
              collections,
              id,
              obfuscated_id: obfuscatedId,
              username
            } = retrieval

            return (
              <tr key={id}>
                <td>{id}</td>
                <td>
                  {obfuscatedId}
                </td>
                <td>{username}</td>
                <td>{collections.length}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  </>
)

AdminRetrievalsList.defaultProps = {
  retrievals: []
}

AdminRetrievalsList.propTypes = {
  retrievals: PropTypes.arrayOf(
    PropTypes.shape({})
  )
  // retrievalsLoading: PropTypes.bool.isRequired,
  // retrievalsLoaded: PropTypes.bool.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(AdminRetrievalsList)
)
