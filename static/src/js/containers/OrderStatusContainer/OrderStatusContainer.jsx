import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapStateToProps = (state) => ({
  granuleDownload: state.granuleDownload,
  retrieval: state.retrieval
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
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
  onFetchRetrievalCollectionGranuleBrowseLinks:
    (retrievalCollection) => dispatch(
      actions.fetchRetrievalCollectionGranuleBrowseLinks(retrievalCollection)
    ),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state))
})

export const OrderStatusContainer = ({
  granuleDownload,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  onFetchRetrievalCollectionGranuleBrowseLinks,
  onMetricsRelatedCollection,
  onToggleAboutCSDAModal,
  retrieval
}) => (
  <OrderStatus
    granuleDownload={granuleDownload}
    onChangePath={onChangePath}
    onFetchRetrieval={onFetchRetrieval}
    onFetchRetrievalCollection={onFetchRetrievalCollection}
    onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
    onFetchRetrievalCollectionGranuleBrowseLinks={onFetchRetrievalCollectionGranuleBrowseLinks}
    onMetricsRelatedCollection={onMetricsRelatedCollection}
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
    retrieval={retrieval}
  />
)

OrderStatusContainer.propTypes = {
  granuleDownload: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleBrowseLinks: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
