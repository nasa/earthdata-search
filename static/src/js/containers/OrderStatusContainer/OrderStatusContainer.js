import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
  granuleDownload: state.granuleDownload,
  portal: state.portal,
  retrieval: state.retrieval
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchRetrieval:
    (retrievalId) => dispatch(actions.fetchRetrieval(retrievalId)),
  onFetchRetrievalCollection:
    (retrievalCollectionId) => dispatch(
      actions.fetchRetrievalCollection(retrievalCollectionId)
    ),
  onFetchRetrievalCollectionGranuleLinks:
    (retrievalCollection) => dispatch(
      actions.fetchRetrievalCollectionGranuleLinks(retrievalCollection)
    ),
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state))
})

export const OrderStatusContainer = ({
  authToken,
  earthdataEnvironment,
  granuleDownload,
  match,
  portal,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  onToggleAboutCSDAModal,
  retrieval
}) => (
  <OrderStatus
    authToken={authToken}
    earthdataEnvironment={earthdataEnvironment}
    match={match}
    portal={portal}
    granuleDownload={granuleDownload}
    onChangePath={onChangePath}
    onFetchRetrieval={onFetchRetrieval}
    onFetchRetrievalCollection={onFetchRetrievalCollection}
    onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
    retrieval={retrieval}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
