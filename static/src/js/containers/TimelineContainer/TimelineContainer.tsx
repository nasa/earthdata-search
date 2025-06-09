import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

// @ts-expect-error The file does not have types
import actions from '../../actions/index'

// @ts-expect-error The file does not have types
import { metricsTimeline } from '../../middleware/metrics/actions'

// @ts-expect-error The file does not have types
import { getCollectionsMetadata } from '../../selectors/collectionMetadata'
// @ts-expect-error The file does not have types
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
// @ts-expect-error The file does not have types
import { getProjectCollectionsIds } from '../../selectors/project'
import { isPath } from '../../util/isPath'

// @ts-expect-error The file does not have types
import Timeline from '../../components/Timeline/Timeline'

import { CollectionsMetadata, Query } from '../../types/sharedTypes'

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onChangeQuery:
    (query: Query) => dispatch(actions.changeQuery(query)),
  onToggleOverrideTemporalModal:
    (open: boolean) => dispatch(actions.toggleOverrideTemporalModal(open)),
  onMetricsTimeline:
    (type: string) => dispatch(metricsTimeline(type)),
  onToggleTimeline:
    (open: boolean) => dispatch(actions.toggleTimeline(open))
})

// @ts-expect-error Don't want to define types for all of Redux
export const mapStateToProps = (state) => ({
  collectionsMetadata: getCollectionsMetadata(state),
  focusedCollectionId: getFocusedCollectionId(state),
  isOpen: state.ui.timeline.isOpen,
  projectCollectionsIds: getProjectCollectionsIds(state),
  temporalSearch: state.query.collection.temporal
})

interface TemporalSearch {
  /** The end date of the temporal search */
  endDate?: string
  /** The start date of the temporal search */
  startDate?: string
}

interface TimelineContainerProps {
  /** Collections Metadata */
  collectionsMetadata: CollectionsMetadata
  /** The focused collection ID */
  focusedCollectionId: string
  /** Whether the timeline is open */
  isOpen: boolean
  /** Function to change the query */
  onChangeQuery: (query: Query) => void
  /** Function to handle metrics timeline */
  onMetricsTimeline: (type: string) => void
  /** Function to toggle the override temporal modal */
  onToggleOverrideTemporalModal: (open: boolean) => void
  /** Function to toggle the timeline */
  onToggleTimeline: (open: boolean) => void
  /** The pathname of the current location */
  pathname: string
  /** The project collections IDs */
  projectCollectionsIds: string[]
  /** The search string from the location */
  search: string
  /** The temporal search object */
  temporalSearch: TemporalSearch
}

export const TimelineContainer: React.FC<TimelineContainerProps> = (props) => {
  const location = useLocation()
  const {
    pathname = '',
    search: searchLocation = ''
  } = location

  const {
    collectionsMetadata,
    focusedCollectionId,
    isOpen,
    onChangeQuery,
    onMetricsTimeline,
    onToggleOverrideTemporalModal,
    onToggleTimeline,
    projectCollectionsIds,
    temporalSearch = {}
  } = props

  // Determine the collectionMetadata the timeline should be displaying
  // Ensure that timeline does not appear on the `Saved Projects` page
  const isProjectPage = isPath(pathname, ['/projects']) && (searchLocation.length > 0)
  const isGranulesPage = isPath(pathname, ['/search/granules'])

  const collectionMetadata: CollectionsMetadata = {}
  const collectionsToRender = []

  if (isProjectPage) {
    collectionsToRender.push(...projectCollectionsIds.slice(0, 3))
  } else if (isGranulesPage && focusedCollectionId !== '') {
    collectionsToRender.push(focusedCollectionId)
  }

  // Retrieve metadata for each collection we're displaying
  collectionsToRender.slice(0, 3).forEach((collectionId) => {
    const { [collectionId]: visibleCollectionMetadata = {} } = collectionsMetadata

    collectionMetadata[collectionId] = visibleCollectionMetadata
  })

  if (collectionsToRender.length === 0) return null

  return (
    <Timeline
      collectionMetadata={collectionMetadata}
      isOpen={isOpen}
      onChangeQuery={onChangeQuery}
      onMetricsTimeline={onMetricsTimeline}
      onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
      onToggleTimeline={onToggleTimeline}
      pathname={pathname}
      projectCollectionsIds={projectCollectionsIds}
      showOverrideModal={isProjectPage}
      temporalSearch={temporalSearch}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
