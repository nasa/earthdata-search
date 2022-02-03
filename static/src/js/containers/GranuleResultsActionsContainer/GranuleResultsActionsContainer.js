import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedCollectionMetadata, getFocusedCollectionSubscriptions } from '../../selectors/collectionMetadata'
import { getFocusedProjectCollection } from '../../selectors/project'
import { getGranuleLimit } from '../../util/collectionMetadata/granuleLimit'
import { getHandoffs } from '../../selectors/handoffs'
import { generateHandoffs } from '../../util/handoffs/generateHandoffs'
import { locationPropType } from '../../util/propTypes/location'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'

export const mapDispatchToProps = (dispatch) => ({
  onAddProjectCollection:
    (collectionId) => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    (collectionId) => dispatch(actions.removeCollectionFromProject(collectionId)),
  onSetActivePanelSection:
    (panelId) => dispatch(actions.setActivePanelSection(panelId)),
  onUpdateFocusedCollection:
    (collectionId) => dispatch(actions.updateFocusedCollection(collectionId)),
  onChangePath:
    (path) => dispatch(actions.changePath(path))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionQuery: state.query.collection,
  focusedCollectionId: getFocusedCollectionId(state),
  focusedProjectCollection: getFocusedProjectCollection(state),
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  handoffs: getHandoffs(state),
  mapProjection: state.map.projection,
  project: state.project,
  subscriptions: getFocusedCollectionSubscriptions(state)
})

export const GranuleResultsActionsContainer = (props) => {
  const {
    collectionMetadata,
    collectionQuery,
    focusedCollectionId,
    focusedProjectCollection,
    granuleQuery,
    granuleSearchResults,
    handoffs,
    location,
    onAddProjectCollection,
    onChangePath,
    onRemoveCollectionFromProject,
    onSetActivePanelSection,
    mapProjection,
    project,
    subscriptions
  } = props

  const {
    collections
  } = project

  const {
    allIds: projectCollectionIds = []
  } = collections

  // Determine if the current collection is in the project
  const isCollectionInProject = projectCollectionIds.indexOf(focusedCollectionId) > -1

  const {
    hits: searchGranuleCount,
    isLoaded,
    isLoading
  } = granuleSearchResults

  const {
    pageNum = 1
  } = granuleQuery

  const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

  const granuleLimit = getGranuleLimit(collectionMetadata)

  const { granules: projectCollectionGranules = {} } = focusedProjectCollection
  const {
    hits: projectGranuleCount,
    addedGranuleIds = [],
    removedGranuleIds = []
  } = projectCollectionGranules

  const handoffLinks = generateHandoffs({
    collectionMetadata,
    collectionQuery,
    handoffs,
    mapProjection
  })

  return (
    <>
      <GranuleResultsActions
        addedGranuleIds={addedGranuleIds}
        focusedCollectionId={focusedCollectionId}
        focusedProjectCollection={focusedProjectCollection}
        granuleLimit={granuleLimit}
        handoffLinks={handoffLinks}
        initialLoading={initialLoading}
        isCollectionInProject={isCollectionInProject}
        location={location}
        onAddProjectCollection={onAddProjectCollection}
        onChangePath={onChangePath}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onSetActivePanelSection={onSetActivePanelSection}
        projectCollectionIds={projectCollectionIds}
        projectGranuleCount={projectGranuleCount}
        removedGranuleIds={removedGranuleIds}
        searchGranuleCount={searchGranuleCount}
        subscriptions={subscriptions}
      />
    </>
  )
}

GranuleResultsActionsContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedProjectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  }).isRequired,
  granuleQuery: PropTypes.shape({
    pageNum: PropTypes.number
  }).isRequired,
  granuleSearchResults: PropTypes.shape({
    hits: PropTypes.number,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  }).isRequired,
  handoffs: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  mapProjection: PropTypes.string.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  project: PropTypes.shape({
    collections: PropTypes.shape({
      allIds: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsActionsContainer)
)
