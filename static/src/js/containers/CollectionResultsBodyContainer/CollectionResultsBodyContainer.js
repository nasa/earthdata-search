import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

const mapStateToProps = state => ({
  browser: state.browser,
  collectionsSearch: state.searchResults.collections,
  collectionsMetadata: state.metadata.collections,
  portal: state.portal,
  projectCollectionIds: state.project.collections.allIds,
  query: state.query.collection
})

const mapDispatchToProps = dispatch => ({
  onAddProjectCollection:
    collectionId => dispatch(actions.addProjectCollection(collectionId)),
  onRemoveCollectionFromProject:
    collectionId => dispatch(actions.removeCollectionFromProject(collectionId)),
  onViewCollectionGranules:
    collectionId => dispatch(actions.viewCollectionGranules(collectionId)),
  onViewCollectionDetails:
    collectionId => dispatch(actions.viewCollectionDetails(collectionId)),
  onChangeCollectionPageNum:
    data => dispatch(actions.changeCollectionPageNum(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    browser,
    collectionsSearch,
    query,
    location,
    collectionsMetadata,
    portal,
    projectCollectionIds,
    onAddProjectCollection,
    onRemoveCollectionFromProject,
    onViewCollectionGranules,
    onViewCollectionDetails,
    onChangeCollectionPageNum,
    panelView
  } = props

  const loadNextPage = () => {
    const { pageNum } = query

    onChangeCollectionPageNum(pageNum + 1)
  }

  return (
    <CollectionResultsBody
      browser={browser}
      collectionsSearch={collectionsSearch}
      collectionsMetadata={collectionsMetadata}
      portal={portal}
      projectCollectionIds={projectCollectionIds}
      location={location}
      onAddProjectCollection={onAddProjectCollection}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onViewCollectionGranules={onViewCollectionGranules}
      onViewCollectionDetails={onViewCollectionDetails}
      loadNextPage={loadNextPage}
      panelView={panelView}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  query: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
)
