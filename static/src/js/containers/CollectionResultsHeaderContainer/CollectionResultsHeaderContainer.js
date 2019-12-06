import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CollectionResultsHeader from '../../components/CollectionResults/CollectionResultsHeader'
import { metricsCollectionSortChange } from '../../middleware/metrics/actions'
import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onChangeQuery:
    query => dispatch(actions.changeQuery(query)),
  onMetricsCollectionSortChange:
    data => dispatch(metricsCollectionSortChange(data)),
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

const mapStateToProps = state => ({
  collectionQuery: state.query.collection,
  portal: state.portal
})

export const CollectionResultsHeaderContainer = ({
  collectionQuery,
  portal,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onToggleAdvancedSearchModal
}) => (
  <CollectionResultsHeader
    collectionQuery={collectionQuery}
    portal={portal}
    onChangeQuery={onChangeQuery}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
    onMetricsCollectionSortChange={onMetricsCollectionSortChange}
  />
)

CollectionResultsHeaderContainer.propTypes = {
  collectionQuery: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsHeaderContainer)
