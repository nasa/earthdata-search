// import React, { useEffect } from 'react'
// import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
// import { withRouter } from 'react-router-dom'

// import actions from '../../actions'
// import AdminRetrieval from '../../components/AdminRetrieval/AdminRetrieval'

// export const mapStateToProps = (state) => ({
//   retrievals: state.admin.retrievals.byId
// })

// export const mapDispatchToProps = (dispatch) => ({
//   onFetchAdminMetricsRetrieval: (id) => dispatch(actions.fetchAdminMetricsRetrieval(id)),
//   OnRequeueMetricsOrder: (orderId) => dispatch(actions.requeueMetricsOrder(orderId))
// })

// export const AdminRetrievalMetricsContainer = ({
//   match,
//   retrievals,
//   onFetchAdminRetrieval,
//   onRequeueOrder
// }) => {
//   // On mount call `onFetchAdminRetrieval`
//   useEffect(() => {
//     const { params } = match
//     const { id } = params
//     onFetchAdminRetrieval(id)
//   }, [])

//   const { params } = match
//   const { id } = params

//   const { [id]: selectedRetrieval } = retrievals

//   return ((
//     <AdminRetrieval
//       retrieval={selectedRetrieval}
//       onRequeueOrder={onRequeueOrder}
//     />
//   ))
// }

// AdminRetrievalMetricsContainer.defaultProps = {
//   retrievals: {}
// }

// AdminRetrievalMetricsContainer.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.string
//     })
//   }).isRequired,
//   onFetchAdminRetrieval: PropTypes.func.isRequired,
//   retrievals: PropTypes.shape({}),
//   onRequeueOrder: PropTypes.func.isRequired
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalMetricsContainer)
// )
