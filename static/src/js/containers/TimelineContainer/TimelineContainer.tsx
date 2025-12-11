import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { useLocation } from 'react-router-dom'

// @ts-expect-error The file does not have types
import { metricsTimeline } from '../../middleware/metrics/actions'

import { isPath } from '../../util/isPath'

// @ts-expect-error The file does not have types
import Timeline from '../../components/Timeline/Timeline'

import type { CollectionMetadata, CollectionsMetadata } from '../../types/sharedTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId, getCollectionsMetadata } from '../../zustand/selectors/collection'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'
import { routes } from '../../constants/routes'

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMetricsTimeline:
    (type: string) => dispatch(metricsTimeline(type))
})

interface TimelineContainerProps {
  /** Function to handle metrics timeline */
  onMetricsTimeline: (type: string) => void
}

export const TimelineContainer: React.FC<TimelineContainerProps> = ({ onMetricsTimeline }) => {
  const location = useLocation()
  const {
    pathname = ''
  } = location

  const [isOpen, setIsOpen] = useState(true)

  const collectionsMetadata = useEdscStore(getCollectionsMetadata)
  const focusedCollectionId = useEdscStore(getCollectionId)
  const projectCollectionsIds = useEdscStore(getProjectCollectionsIds)

  // Determine the collectionMetadata the timeline should be displaying
  // Ensure that timeline does not appear on the `Saved Projects` page
  const isProjectPage = isPath(pathname, [routes.PROJECT])
  const isGranulesPage = isPath(pathname, [routes.GRANULES])

  const collectionMetadata: CollectionsMetadata = {}
  const collectionsToRender = []

  if (isProjectPage) {
    collectionsToRender.push(...projectCollectionsIds.slice(0, 3))
  } else if (isGranulesPage && focusedCollectionId !== '') {
    collectionsToRender.push(focusedCollectionId!)
  }

  // Retrieve metadata for each collection we're displaying
  collectionsToRender.slice(0, 3).forEach((collectionId) => {
    const { [collectionId]: visibleCollectionMetadata = {} } = collectionsMetadata

    collectionMetadata[collectionId] = visibleCollectionMetadata as CollectionMetadata
  })

  if (collectionsToRender.length === 0) return null

  return (
    <Timeline
      collectionMetadata={collectionMetadata}
      isOpen={isOpen}
      onMetricsTimeline={onMetricsTimeline}
      onToggleTimeline={setIsOpen}
      pathname={pathname}
      projectCollectionsIds={projectCollectionsIds}
      showOverrideModal={isProjectPage}
    />
  )
}

export default connect(null, mapDispatchToProps)(TimelineContainer)
