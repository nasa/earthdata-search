import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { getProjectCollectionsIds } from '../../selectors/project'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

export const mapStateToProps = (state) => ({
  browser: state.browser,
  collectionsSearch: state.searchResults.collections,
  collectionsMetadata: state.metadata.collections,
  portal: state.portal,
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
    (data) => dispatch(actions.changeCollectionPageNum(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    browser,
    collectionsMetadata,
    collectionsSearch,
    location,
    onAddProjectCollection,
    onChangeCollectionPageNum,
    onRemoveCollectionFromProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panelView,
    portal,
    projectCollectionsIds,
    query
  } = props

  const loadNextPage = () => {
    const { pageNum } = query

    onChangeCollectionPageNum(pageNum + 1)
  }

  return (
    <CollectionResultsBody
      browser={browser}
      collectionsMetadata={collectionsMetadata}
      collectionsSearch={collectionsSearch}
      loadNextPage={loadNextPage}
      location={location}
      onAddProjectCollection={onAddProjectCollection}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      panelView={panelView}
      portal={portal}
      projectCollectionsIds={projectCollectionsIds}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  query: PropTypes.shape({
    pageNum: PropTypes.number
  }).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
)
