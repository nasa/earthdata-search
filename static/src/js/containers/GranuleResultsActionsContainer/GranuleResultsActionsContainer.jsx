import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import { getGranuleLimit } from '../../util/collectionMetadata/granuleLimit'

import { getHandoffLinks } from '../../util/handoffs/getHandoffLinks'

import GranuleResultsActions from '../../components/GranuleResults/GranuleResultsActions'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'
import { getGranules } from '../../zustand/selectors/granules'
import {
  getFocusedProjectCollection,
  getProjectCollectionsIds
} from '../../zustand/selectors/project'
import {
  getCollectionsQuery,
  getFocusedCollectionGranuleQuery
} from '../../zustand/selectors/query'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const GranuleResultsActionsContainer = ({
  onMetricsAddCollectionProject
}) => {
  const { mapView } = useEdscStore((state) => ({
    mapView: state.map.mapView
  }))
  const granuleSearchResults = useEdscStore(getGranules)
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const focusedCollectionId = useEdscStore(getCollectionId)

  const focusedProjectCollection = useEdscStore(getFocusedProjectCollection)
  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

  // Determine if the current collection is in the project
  const isCollectionInProject = projectCollectionIds.indexOf(focusedCollectionId) > -1

  const {
    count: searchGranuleCount,
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
    count: projectGranuleCount,
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
      addedGranuleIds={addedGranuleIds}
      focusedCollectionId={focusedCollectionId}
      focusedProjectCollection={focusedProjectCollection}
      granuleLimit={granuleLimit}
      handoffLinks={handoffLinks}
      initialLoading={initialLoading}
      isCollectionInProject={isCollectionInProject}
      onMetricsAddCollectionProject={onMetricsAddCollectionProject}
      projectCollectionIds={projectCollectionIds}
      projectGranuleCount={projectGranuleCount}
      removedGranuleIds={removedGranuleIds}
      searchGranuleCount={searchGranuleCount}
    />
  )
}

GranuleResultsActionsContainer.propTypes = {
  onMetricsAddCollectionProject: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(GranuleResultsActionsContainer)
