import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const mapStateToProps = state => ({
  admin: state.admin
})

export const AdminRetrievalDetails = ({
  retrieval
}) => {
  const {
    username,
    collections = []
  } = retrieval

  return (
    <>
      <h2>Retrieval Details</h2>

      <p>
        <strong>Owner:</strong>
        {username}
      </p>

      {
        collections.length > 0 && (
          <Table className="admin-retrieval-table" striped variant="light">
            <thead>
              <tr>
                <th>ID</th>
                <th>Concept ID</th>
                <th>Order Count</th>
              </tr>
            </thead>
            <tbody>
              {
                collections.map((collection) => {
                  const {
                    id: collectionId,
                    collection_id: collectionConceptId,
                    orders
                  } = collection

                  return (
                    <>
                      <tr key={collectionId}>
                        <td>{collectionId}</td>
                        <td>{collectionConceptId}</td>
                        <td>{orders.length}</td>
                      </tr>

                      {
                        orders.length > 0 && (
                          <tr>
                            <td colSpan={3}>
                              <Table className="admin-retrieval-table" striped variant="light">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Order Number</th>
                                    <th>Type</th>
                                    <th>State</th>
                                    <th>Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    orders.map((order) => {
                                      const {
                                        id: orderId,
                                        order_information: orderInformation,
                                        order_number: orderNumber,
                                        state,
                                        type
                                      } = order

                                      return (
                                        <tr key={`${collectionId}-${orderId}`}>
                                          <td>{orderId}</td>
                                          <td>{orderNumber}</td>
                                          <td>{type}</td>
                                          <td>{state}</td>
                                          <td>{JSON.stringify(orderInformation)}</td>
                                        </tr>
                                      )
                                    })
                                  }
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        )
                      }
                    </>
                  )
                })
              }
            </tbody>
          </Table>
        )
      }
    </>
  )
}

AdminRetrievalDetails.defaultProps = {
  retrieval: {}
}

AdminRetrievalDetails.propTypes = {
  retrieval: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, null)(AdminRetrievalDetails)
)
