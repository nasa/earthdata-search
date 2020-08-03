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
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getFocusedProjectCollection } from '../../selectors/project'
import { getGranuleLimit } from '../../util/collectionMetadata/granuleLimit'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'

const mapDispatchToProps = dispatch => ({
  onAddProjectCollection:
    collectionId => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onSetActivePanelSection:
    panelId => dispatch(actions.setActivePanelSection(panelId)),
  onUpdateFocusedCollection:
    collectionId => dispatch(actions.updateFocusedCollection(collectionId)),
  onChangePath: path => dispatch(actions.changePath(path))
})

const mapStateToProps = state => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  focusedCollectionId: getFocusedCollectionId(state),
  focusedProjectCollection: getFocusedProjectCollection(state),
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  project: state.project,
  searchValue: state.ui.granuleResultsPanel.searchValue,
  sortOrder: state.ui.granuleResultsPanel.sortOrder
})

export const GranuleResultsActionsContainer = (props) => {
  const {
    collectionMetadata,
    focusedCollectionId,
    focusedProjectCollection,
    granuleQuery,
    granuleSearchResults,
    location,
    onAddProjectCollection,
    onChangePath,
    onRemoveCollectionFromProject,
    onSetActivePanelSection,
    project
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
    hits,
    isLoaded,
    isLoading
  } = granuleSearchResults

  const {
    pageNum = 1
  } = granuleQuery

  const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

  const granuleLimit = getGranuleLimit(collectionMetadata)

  return (
    <>
      <GranuleResultsActions
        collectionId={focusedCollectionId}
        focusedProjectCollection={focusedProjectCollection}
        granuleCount={hits}
        granuleLimit={granuleLimit}
        initialLoading={initialLoading}
        isCollectionInProject={isCollectionInProject}
        location={location}
        projectCollectionIds={projectCollectionIds}
        onAddProjectCollection={onAddProjectCollection}
        onChangePath={onChangePath}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onSetActivePanelSection={onSetActivePanelSection}
      />
    </>
  )
}

GranuleResultsActionsContainer.propTypes = {
  focusedProjectCollection: PropTypes.shape({}).isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsActionsContainer)
)
