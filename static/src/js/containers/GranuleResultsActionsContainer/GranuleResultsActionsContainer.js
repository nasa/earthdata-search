import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions'
import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'

const mapDispatchToProps = dispatch => ({
  onAddProjectCollection:
    collectionId => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  project: state.project,
  sortOrder: state.ui.granuleResultsPanel.sortOrder,
  searchValue: state.ui.granuleResultsPanel.searchValue
})

export const GranuleResultsActionsContainer = (props) => {
  const {
    collections,
    focusedCollection,
    granules,
    location,
    project,
    onAddProjectCollection,
    onRemoveCollectionFromProject
  } = props

  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (!focusedCollectionMetadata) return null

  const { collectionIds: projectIds } = project
  const isCollectionInProject = projectIds.indexOf(focusedCollection) !== -1

  // Determine the correct granule count based on granules that have been removed
  const { excludedGranuleIds = [] } = collections.byId[focusedCollection]
  const granuleCount = (granules.hits - excludedGranuleIds.length)

  return (
    <>
      <GranuleResultsActions
        collectionId={focusedCollection}
        granuleCount={granuleCount}
        isCollectionInProject={isCollectionInProject}
        location={location}
        onAddProjectCollection={onAddProjectCollection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      />
    </>
  )
}

GranuleResultsActionsContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsActionsContainer)
)
