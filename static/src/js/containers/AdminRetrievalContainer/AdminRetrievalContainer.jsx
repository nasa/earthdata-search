import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrieval from '../../components/AdminRetrieval/AdminRetrieval'

export const mapDispatchToProps = (dispatch) => ({
  onRequeueOrder: (orderId) => dispatch(actions.requeueOrder(orderId))
})

export const AdminRetrievalContainer = ({
  match,
  onRequeueOrder
}) => {
  const { params } = match
  const { obfuscatedId } = params

  return ((
    <AdminRetrieval
      obfuscatedId={obfuscatedId}
      onRequeueOrder={onRequeueOrder}
    />
  ))
}

AdminRetrievalContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      obfuscatedId: PropTypes.string
    })
  }).isRequired,
  onRequeueOrder: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(AdminRetrievalContainer)
)
