import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'
import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import Spinner from '../../components/Spinner/Spinner'

const CollectionDetailsBody = lazy(() => import('../../components/CollectionDetails/CollectionDetailsBody'))

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state)),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state)
})

/**
 * Container component for CollectionDetailsBody.
 *
 * This component connects to the Redux store and provides the necessary props
 * to the CollectionDetailsBody component. It also handles lazy loading of the
 * CollectionDetailsBody component and displays a spinner while loading.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.collectionMetadata - The metadata of the focused collection.
 * @param {boolean} props.isActive - Indicates if the collection details panel is active. This value is set by PanelItem.
 * @param {Object} props.location - The current location object from react-router.
 * @param {Function} props.onFocusedCollectionChange - Function to change the focused collection.
 * @param {Function} props.onMetricsRelatedCollection - Function to handle metrics related to the collection.
 * @param {Function} props.onToggleRelatedUrlsModal - Function to toggle the related URLs modal.
 */
export const CollectionDetailsBodyContainer = ({
  collectionMetadata,
  isActive,
  location,
  onMetricsRelatedCollection,
  onToggleRelatedUrlsModal
}) => (
  <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
    <CollectionDetailsBody
      collectionMetadata={collectionMetadata}
      isActive={isActive}
      location={location}
      onMetricsRelatedCollection={onMetricsRelatedCollection}
      onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
    />
  </Suspense>
)

CollectionDetailsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  isActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsBodyContainer)
)
