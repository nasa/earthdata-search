import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrieval from '../../components/AdminRetrieval/AdminRetrieval'

export const mapStateToProps = (state) => ({
  retrievals: state.admin.retrievals.byId
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminRetrieval: (id) => dispatch(actions.fetchAdminRetrieval(id)),
  onRequeueOrder: (orderId) => dispatch(actions.requeueOrder(orderId))
})

export const AdminRetrievalContainer = ({
  retrievals,
  onFetchAdminRetrieval,
  onRequeueOrder
}) => {
  const params = useParams()
  const { id } = params

  // On mount call onFetchAdminRetrieval
  useEffect(() => {
    onFetchAdminRetrieval(id)
  }, [])

  const { [id]: selectedRetrieval } = retrievals

  return ((
    <AdminRetrieval
      retrieval={selectedRetrieval}
      onRequeueOrder={onRequeueOrder}
    />
  ))
}

AdminRetrievalContainer.defaultProps = {
  retrievals: {}
}

AdminRetrievalContainer.propTypes = {
  onFetchAdminRetrieval: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({}),
  onRequeueOrder: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalContainer)
