import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
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
  earthdataEnvironment,
  granuleDownload,
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
    earthdataEnvironment={earthdataEnvironment}
    granuleDownload={granuleDownload}
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
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
