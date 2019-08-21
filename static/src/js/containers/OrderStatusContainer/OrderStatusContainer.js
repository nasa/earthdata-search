import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

const mapStateToProps = state => ({
  authToken: state.authToken,
  portal: state.portal,
  retrieval: state.retrieval
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrieval:
    retrievalId => dispatch(actions.fetchRetrieval(retrievalId)),
  onFetchRetrievalCollection:
    retrievalCollectionId => dispatch(
      actions.fetchRetrievalCollection(retrievalCollectionId)
    ),
  onChangePath:
    path => dispatch(actions.changePath(path))
})

export const OrderStatusContainer = ({
  authToken,
  match,
  portal,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  retrieval
}) => (
  <OrderStatus
    authToken={authToken}
    match={match}
    portal={portal}
    onChangePath={onChangePath}
    onFetchRetrieval={onFetchRetrieval}
    onFetchRetrievalCollection={onFetchRetrievalCollection}
    retrieval={retrieval}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
