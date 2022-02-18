import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'
import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import CollectionDetailsBody from '../../components/CollectionDetails/CollectionDetailsBody'

export const mapDispatchToProps = (dispatch) => ({
  onFocusedCollectionChange:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state)),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state)
})

export const CollectionDetailsBodyContainer = ({
  collectionMetadata,
  isActive,
  location,
  onFocusedCollectionChange,
  onMetricsRelatedCollection,
  onToggleRelatedUrlsModal
}) => (
  <CollectionDetailsBody
    collectionMetadata={collectionMetadata}
    isActive={isActive}
    location={location}
    onFocusedCollectionChange={onFocusedCollectionChange}
    onMetricsRelatedCollection={onMetricsRelatedCollection}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

CollectionDetailsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  isActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsBodyContainer)
)
