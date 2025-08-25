import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import Spinner from '../../components/Spinner/Spinner'

const CollectionDetailsBody = lazy(() => import('../../components/CollectionDetails/CollectionDetailsBody'))

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state)),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data))
})

/**
 * Container component for CollectionDetailsBody.
 *
 * This component connects to the Redux store and provides the necessary props
 * to the CollectionDetailsBody component. It also handles lazy loading of the
 * CollectionDetailsBody component and displays a spinner while loading.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isActive - Indicates if the collection details panel is active. This value is set by PanelItem.
 * @param {Function} props.onMetricsRelatedCollection - Function to handle metrics related to the collection.
 * @param {Function} props.onToggleRelatedUrlsModal - Function to toggle the related URLs modal.
 */
export const CollectionDetailsBodyContainer = ({
  isActive,
  onMetricsRelatedCollection,
  onToggleRelatedUrlsModal
}) => (
  <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
    <CollectionDetailsBody
      isActive={isActive}
      onMetricsRelatedCollection={onMetricsRelatedCollection}
      onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
    />
  </Suspense>
)

CollectionDetailsBodyContainer.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(CollectionDetailsBodyContainer)
