import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import { getProjectCollectionsIds } from '../../selectors/project'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

export const mapStateToProps = (state) => ({
  collectionsSearch: state.searchResults.collections,
  collectionsMetadata: state.metadata.collections,
  projectCollectionsIds: getProjectCollectionsIds(state),
  query: state.query.collection
})

export const mapDispatchToProps = (dispatch) => ({
  onAddProjectCollection:
    (collectionId) => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    (collectionId) => dispatch(actions.removeCollectionFromProject(collectionId)),
  onViewCollectionGranules:
    (collectionId) => dispatch(actions.viewCollectionGranules(collectionId)),
  onViewCollectionDetails:
    (collectionId) => dispatch(actions.viewCollectionDetails(collectionId)),
  onChangeCollectionPageNum:
    (data) => dispatch(actions.changeCollectionPageNum(data)),
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    collectionsMetadata,
    collectionsSearch,
    onAddProjectCollection,
    onChangeCollectionPageNum,
    onMetricsAddCollectionProject,
    onRemoveCollectionFromProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panelView,
    projectCollectionsIds,
    query
  } = props

  const loadNextPage = () => {
    const { pageNum } = query

    onChangeCollectionPageNum(pageNum + 1)
  }

  return (
    <CollectionResultsBody
      collectionsMetadata={collectionsMetadata}
      collectionsSearch={collectionsSearch}
      loadNextPage={loadNextPage}
      onAddProjectCollection={onAddProjectCollection}
      onMetricsAddCollectionProject={onMetricsAddCollectionProject}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      panelView={panelView}
      projectCollectionsIds={projectCollectionsIds}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  collectionsMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  query: PropTypes.shape({
    pageNum: PropTypes.number
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
