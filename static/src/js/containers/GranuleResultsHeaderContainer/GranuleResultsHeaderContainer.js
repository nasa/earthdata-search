import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import GranuleResultsHeader from '../../components/GranuleResults/GranuleResultsHeader'

const mapDispatchToProps = dispatch => ({
  onAddProjectCollection:
    collectionId => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUndoExcludeGranule:
    collectionId => dispatch(actions.undoExcludeGranule(collectionId)),
  onUpdateSortOrder:
    sortOrder => dispatch(actions.granuleResultsPanelUpdateSortOrder(sortOrder)),
  onUpdateSearchValue:
    searchValue => dispatch(actions.granuleResultsPanelUpdateSearchValue(searchValue))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  sortOrder: state.ui.granuleResultsPanel.sortOrder,
  searchValue: state.ui.granuleResultsPanel.searchValue,
  secondaryOverlayPanel: state.ui.secondaryOverlayPanel
})

export const GranuleResultsHeaderContainer = (props) => {
  const {
    collections,
    focusedCollection,
    location,
    onToggleSecondaryOverlayPanel,
    onUndoExcludeGranule,
    onUpdateSearchValue,
    onUpdateSortOrder,
    searchValue,
    secondaryOverlayPanel,
    sortOrder
  } = props

  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (Object.keys(focusedCollectionMetadata).length === 0) return null

  return (
    <>
      <GranuleResultsHeader
        location={location}
        focusedCollection={focusedCollection}
        focusedCollectionMetadata={focusedCollectionMetadata}
        onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
        onUpdateSortOrder={onUpdateSortOrder}
        onUpdateSearchValue={onUpdateSearchValue}
        onUndoExcludeGranule={onUndoExcludeGranule}
        sortOrder={sortOrder}
        searchValue={searchValue}
        secondaryOverlayPanel={secondaryOverlayPanel}
      />
    </>
  )
}

GranuleResultsHeaderContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  onUpdateSortOrder: PropTypes.func.isRequired,
  onUpdateSearchValue: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsHeaderContainer)
)
