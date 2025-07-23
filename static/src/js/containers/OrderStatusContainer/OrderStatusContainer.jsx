import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { locationPropType } from '../../util/propTypes/location'
import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
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
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data)),
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state))
})

export const OrderStatusContainer = ({
  authToken,
  granuleDownload,
  location,
  match,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  onFetchRetrievalCollectionGranuleBrowseLinks,
  onFocusedCollectionChange,
  onMetricsRelatedCollection,
  onToggleAboutCSDAModal,
  retrieval
}) => (
  <OrderStatus
    authToken={authToken}
    granuleDownload={granuleDownload}
    location={location}
    match={match}
    onChangePath={onChangePath}
    onFetchRetrieval={onFetchRetrieval}
    onFetchRetrievalCollection={onFetchRetrievalCollection}
    onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
    onFetchRetrievalCollectionGranuleBrowseLinks={onFetchRetrievalCollectionGranuleBrowseLinks}
    onFocusedCollectionChange={onFocusedCollectionChange}
    onMetricsRelatedCollection={onMetricsRelatedCollection}
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
    retrieval={retrieval}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleBrowseLinks: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
