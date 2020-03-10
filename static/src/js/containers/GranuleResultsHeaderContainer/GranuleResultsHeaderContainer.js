import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

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
  collections: state.metadata.collections,
  collectionSearch: state.query.collection,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  granuleSearch: state.query.granule,
  mapProjection: state.map.projection,
  secondaryOverlayPanel: state.ui.secondaryOverlayPanel
})

export const GranuleResultsHeaderContainer = (props) => {
  const {
    collections,
    collectionSearch,
    focusedCollection,
    granules,
    granuleSearch,
    location,
    mapProjection,
    secondaryOverlayPanel,
    onApplyGranuleFilters,
    onToggleAboutCwicModal,
    onToggleSecondaryOverlayPanel,
    onUndoExcludeGranule
  } = props

  const focusedCollectionObject = getFocusedCollectionObject(focusedCollection, collections)

  const { pageNum } = granuleSearch

  return (
    <>
      <GranuleResultsHeader
        collectionSearch={collectionSearch}
        focusedCollectionId={focusedCollection}
        focusedCollectionObject={focusedCollectionObject}
        location={location}
        mapProjection={mapProjection}
        secondaryOverlayPanel={secondaryOverlayPanel}
        onApplyGranuleFilters={onApplyGranuleFilters}
        onToggleAboutCwicModal={onToggleAboutCwicModal}
        onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
        onUndoExcludeGranule={onUndoExcludeGranule}
        granules={granules}
        pageNum={pageNum}
      />
    </>
  )
}

GranuleResultsHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  granuleSearch: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsHeaderContainer)
)
