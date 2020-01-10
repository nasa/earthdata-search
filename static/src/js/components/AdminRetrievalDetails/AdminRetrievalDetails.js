import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => ({
  admin: state.admin
})

export const AdminRetrievalsList = () => (
  <>
    <h2>Retrieval Details</h2>
  </>
)

AdminRetrievalsList.defaultProps = {
  retrieval: {}
}

export default withRouter(
  connect(mapStateToProps, null)(AdminRetrievalsList)
)
