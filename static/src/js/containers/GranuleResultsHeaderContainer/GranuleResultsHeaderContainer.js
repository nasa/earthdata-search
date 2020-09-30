import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleResultsHeader from '../../components/GranuleResults/GranuleResultsHeader'

const mapDispatchToProps = dispatch => ({
  onToggleAboutCwicModal:
    state => dispatch(actions.toggleAboutCwicModal(state)),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUndoExcludeGranule:
    collectionId => dispatch(actions.undoExcludeGranule(collectionId)),
  onApplyGranuleFilters:
    values => dispatch(actions.applyGranuleFilters(values))
})

const mapStateToProps = state => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionQuery: state.query.collection,
  collectionsSearch: state.searchResults.collections,
  focusedCollectionId: getFocusedCollectionId(state),
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
    focusedCollectionId,
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
        focusedCollectionId={focusedCollectionId}
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
  focusedCollectionId: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
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
