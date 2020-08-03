import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'

import GranuleResultsHeader from '../../components/GranuleResults/GranuleResultsHeader'

const mapDispatchToProps = dispatch => ({
  onToggleAboutCwicModal:
    state => dispatch(actions.toggleAboutCwicModal(state)),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUndoExcludeGranule:
    collectionId => dispatch(actions.undoExcludeGranule(collectionId)),
  onApplyGranuleFilters:
    (focusedCollection, values) => dispatch(
      actions.applyGranuleFilters(focusedCollection, values)
    )
})

const mapStateToProps = state => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionQuery: state.query.collection,
  collectionsSearch: state.searchResults.collections,
  focusedCollection: state.focusedCollection,
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  mapProjection: state.map.projection,
  secondaryOverlayPanel: state.ui.secondaryOverlayPanel
})

export const GranuleResultsHeaderContainer = (props) => {
  const {
    collectionMetadata,
    collectionQuery,
    collectionsSearch,
    focusedCollection,
    granuleQuery,
    granuleSearchResults,
    location,
    mapProjection,
    onApplyGranuleFilters,
    onChangePanelView,
    onToggleAboutCwicModal,
    onToggleSecondaryOverlayPanel,
    onUndoExcludeGranule,
    panelView,
    secondaryOverlayPanel
  } = props

  const {
    pageNum = 1
  } = granuleQuery

  return (
    <>
      <GranuleResultsHeader
        collectionMetadata={collectionMetadata}
        collectionQuery={collectionQuery}
        collectionsSearch={collectionsSearch}
        focusedCollection={focusedCollection}
        granuleQuery={granuleQuery}
        granuleSearchResults={granuleSearchResults}
        location={location}
        mapProjection={mapProjection}
        onApplyGranuleFilters={onApplyGranuleFilters}
        onChangePanelView={onChangePanelView}
        onToggleAboutCwicModal={onToggleAboutCwicModal}
        onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
        onUndoExcludeGranule={onUndoExcludeGranule}
        pageNum={pageNum}
        panelView={panelView}
        secondaryOverlayPanel={secondaryOverlayPanel}
      />
    </>
  )
}

GranuleResultsHeaderContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onChangePanelView: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsHeaderContainer)
)
