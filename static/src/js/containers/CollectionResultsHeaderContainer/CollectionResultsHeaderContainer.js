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
  collections: state.searchResults.collections,
  collectionQuery: state.query.collection,
  portal: state.portal
})

export const CollectionResultsHeaderContainer = ({
  collections,
  collectionQuery,
  panelView,
  portal,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onToggleAdvancedSearchModal,
  onChangePanelView
}) => (
  <CollectionResultsHeader
    collections={collections}
    collectionQuery={collectionQuery}
    panelView={panelView}
    portal={portal}
    onChangeQuery={onChangeQuery}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
    onMetricsCollectionSortChange={onMetricsCollectionSortChange}
    onChangePanelView={onChangePanelView}
  />
)

CollectionResultsHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onChangePanelView: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsHeaderContainer)
