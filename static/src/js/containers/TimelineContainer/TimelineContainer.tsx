import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { isPath } from '../../util/isPath'

// @ts-expect-error The file does not have types
import Timeline from '../../components/Timeline/Timeline'

import type { CollectionMetadata, CollectionsMetadata } from '../../types/sharedTypes'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId, getCollectionsMetadata } from '../../zustand/selectors/collection'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'
import { routes } from '../../constants/routes'

const TimelineContainer = () => {
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
      onToggleTimeline={setIsOpen}
      pathname={pathname}
      projectCollectionsIds={projectCollectionsIds}
      showOverrideModal={isProjectPage}
    />
  )
}

export default TimelineContainer
