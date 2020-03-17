import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'
import { isEmpty } from 'lodash'

import actions from '../../actions'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'
import { getGranuleLimit } from '../../util/collectionMetadata/granuleLimit'
import { getGranuleCount } from '../../util/collectionMetadata/granuleCount'

const mapDispatchToProps = dispatch => ({
  onAddProjectCollection:
    collectionId => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granuleQuery: state.query.granule,
  project: state.project,
  sortOrder: state.ui.granuleResultsPanel.sortOrder,
  searchValue: state.ui.granuleResultsPanel.searchValue
})

export const GranuleResultsActionsContainer = (props) => {
  const {
    collections,
    focusedCollection,
    granuleQuery,
    location,
    project,
    onAddProjectCollection,
    onRemoveCollectionFromProject
  } = props
  const collection = getFocusedCollectionObject(focusedCollection, collections)
  const { granules, metadata } = collection

  if (isEmpty(metadata)) return null

  const { collectionIds: projectIds } = project
  const isCollectionInProject = projectIds.indexOf(focusedCollection) !== -1

  // Determine the correct granule count based on granules that have been removed
  const { pageNum } = granuleQuery
  const { isLoading, isLoaded } = granules
  const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

  const granuleCount = getGranuleCount(granules, collection)

  const granuleLimit = getGranuleLimit(metadata)

  return (
    <>
      <GranuleResultsActions
        collectionId={focusedCollection}
        granuleCount={granuleCount}
        granuleLimit={granuleLimit}
        initialLoading={initialLoading}
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
  granuleQuery: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsActionsContainer)
)
