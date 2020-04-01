import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

const mapStateToProps = state => ({
  browser: state.browser,
  collections: state.searchResults.collections,
  portal: state.portal,
  project: state.project,
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
    collections,
    query,
    location,
    portal,
    project,
    onAddProjectCollection,
    onRemoveCollectionFromProject,
    onViewCollectionGranules,
    onViewCollectionDetails,
    onChangeCollectionPageNum,
    panelScrollableNodeRef,
    panelView
  } = props

  const { collectionIds: projectIds } = project

  const scrollContainer = panelScrollableNodeRef.current

  const onWaypointEnter = (params = {}) => {
    const { event } = params
    if (event !== null) {
      const { type } = event

      if (type !== 'resize') {
        const { pageNum } = query

        // Using a set timeout here so the page change does not interfere with scrolling
        setTimeout(() => {
          onChangeCollectionPageNum(pageNum + 1)
        }, 0)
      }
    }
  }

  return (
    <CollectionResultsBody
      browser={browser}
      collections={collections}
      portal={portal}
      projectIds={projectIds}
      location={location}
      onAddProjectCollection={onAddProjectCollection}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onViewCollectionGranules={onViewCollectionGranules}
      onViewCollectionDetails={onViewCollectionDetails}
      waypointEnter={onWaypointEnter}
      scrollContainer={scrollContainer}
      panelView={panelView}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  query: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired,
  panelScrollableNodeRef: PropTypes.shape({}).isRequired,
  panelView: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
)
