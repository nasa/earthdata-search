import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrieval from '../../components/AdminRetrieval/AdminRetrieval'

export const mapDispatchToProps = (dispatch) => ({
  onRequeueOrder: (orderId) => dispatch(actions.requeueOrder(orderId))
})

export const AdminRetrievalContainer = ({
  onRequeueOrder
}) => {
  const params = useParams()
  const { obfuscatedId } = params

  return ((
    <AdminRetrieval
      obfuscatedId={obfuscatedId}
      onRequeueOrder={onRequeueOrder}
    />
  ))
}

AdminRetrievalContainer.propTypes = {
  onRequeueOrder: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(AdminRetrievalContainer)
