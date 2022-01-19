import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsTimeline } from '../../middleware/metrics/actions'

import { getCollectionsMetadata } from '../../selectors/collectionMetadata'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getProjectCollectionsIds } from '../../selectors/project'
import { isPath } from '../../util/isPath'

import Timeline from '../../components/Timeline/Timeline'

export const mapDispatchToProps = (dispatch) => ({
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query)),
  onChangeTimelineQuery:
    (query) => dispatch(actions.changeTimelineQuery(query)),
  onToggleOverrideTemporalModal:
    (open) => dispatch(actions.toggleOverrideTemporalModal(open)),
  onMetricsTimeline:
    (type) => dispatch(metricsTimeline(type)),
  onToggleTimeline:
    (open) => dispatch(actions.toggleTimeline(open))
})

export const mapStateToProps = (state) => ({
  browser: state.browser,
  collectionsMetadata: getCollectionsMetadata(state),
  focusedCollectionId: getFocusedCollectionId(state),
  pathname: state.router.location.pathname,
  projectCollectionsIds: getProjectCollectionsIds(state),
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline,
  isOpen: state.ui.timeline.isOpen
})

export const TimelineContainer = (props) => {
  const {
    browser,
    collectionsMetadata,
    focusedCollectionId,
    pathname,
    projectCollectionsIds,
    temporalSearch,
    timeline,
    onChangeQuery,
    onChangeTimelineQuery,
    onToggleOverrideTemporalModal,
    onMetricsTimeline,
    onToggleTimeline,
    isOpen
  } = props

  // Determine the collectionMetadata the timeline should be displaying
  const isProjectPage = isPath(pathname, ['/projects'])
  const isGranulesPage = isPath(pathname, ['/search/granules'])

  const collectionMetadata = {}
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
      browser={browser}
      collectionMetadata={collectionMetadata}
      pathname={pathname}
      showOverrideModal={isProjectPage}
      temporalSearch={temporalSearch}
      timeline={timeline}
      onChangeQuery={onChangeQuery}
      onChangeTimelineQuery={onChangeTimelineQuery}
      onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
      onMetricsTimeline={onMetricsTimeline}
      onToggleTimeline={onToggleTimeline}
      isOpen={isOpen}
    />
  )
}

TimelineContainer.defaultProps = {
  temporalSearch: {}
}

TimelineContainer.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onMetricsTimeline: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  onToggleTimeline: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
