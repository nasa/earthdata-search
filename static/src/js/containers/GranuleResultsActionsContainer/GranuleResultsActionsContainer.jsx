import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionSubscriptions
} from '../../selectors/collectionMetadata'
import { getGranuleLimit } from '../../util/collectionMetadata/granuleLimit'

import { locationPropType } from '../../util/propTypes/location'
import { getHandoffLinks } from '../../util/handoffs/getHandoffLinks'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId } from '../../zustand/selectors/collection'
import {
  getFocusedProjectCollection,
  getProjectCollectionsIds
} from '../../zustand/selectors/project'
import {
  getCollectionsQuery,
  getFocusedCollectionGranuleQuery
} from '../../zustand/selectors/query'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  collectionMetadata: getFocusedCollectionMetadata(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  subscriptions: getFocusedCollectionSubscriptions(state)
})

export const GranuleResultsActionsContainer = (props) => {
  const {
    authToken,
    collectionMetadata,
    granuleSearchResults,
    location,
    onChangePath,
    onMetricsAddCollectionProject,
    subscriptions
  } = props

  const { mapView } = useEdscStore((state) => ({
    mapView: state.map.mapView
  }))
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const focusedCollectionId = useEdscStore(getCollectionId)

  const focusedProjectCollection = useEdscStore(getFocusedProjectCollection)
  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

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

  const handoffLinks = getHandoffLinks({
    collectionMetadata,
    collectionQuery,
    map: mapView
  })

  return (
    <GranuleResultsActions
      authToken={authToken}
      addedGranuleIds={addedGranuleIds}
      focusedCollectionId={focusedCollectionId}
      focusedProjectCollection={focusedProjectCollection}
      granuleLimit={granuleLimit}
      handoffLinks={handoffLinks}
      initialLoading={initialLoading}
      isCollectionInProject={isCollectionInProject}
      location={location}
      onChangePath={onChangePath}
      onMetricsAddCollectionProject={onMetricsAddCollectionProject}
      projectCollectionIds={projectCollectionIds}
      projectGranuleCount={projectGranuleCount}
      removedGranuleIds={removedGranuleIds}
      searchGranuleCount={searchGranuleCount}
      subscriptions={subscriptions}
    />
  )
}

GranuleResultsActionsContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({
    hits: PropTypes.number,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  }).isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsActionsContainer)
)
