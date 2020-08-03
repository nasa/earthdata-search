import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions'

import { metricsCollectionSortChange } from '../../middleware/metrics/actions'

import CollectionResultsHeader from '../../components/CollectionResults/CollectionResultsHeader'

const mapDispatchToProps = dispatch => ({
  onChangeQuery:
    query => dispatch(actions.changeQuery(query)),
  onMetricsCollectionSortChange:
    data => dispatch(metricsCollectionSortChange(data)),
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

const mapStateToProps = state => ({
  collections: state.searchResults.collections,
  collectionQuery: state.query.collection
})

export const CollectionResultsHeaderContainer = ({
  collectionQuery,
  collections,
  onChangePanelView,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onToggleAdvancedSearchModal,
  panelView
}) => (
  <CollectionResultsHeader
    collectionQuery={collectionQuery}
    collections={collections}
    onChangePanelView={onChangePanelView}
    onChangeQuery={onChangeQuery}
    onMetricsCollectionSortChange={onMetricsCollectionSortChange}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
    panelView={panelView}
  />
)

CollectionResultsHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  panelView: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onChangePanelView: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsHeaderContainer)
