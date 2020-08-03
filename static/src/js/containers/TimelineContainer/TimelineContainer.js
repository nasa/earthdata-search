import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsTimeline } from '../../middleware/metrics/actions'

import isPath from '../../util/isPath'

import { getProjectCollectionsIds } from '../../selectors/project'

import Timeline from '../../components/Timeline/Timeline'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeProjectQuery: query => dispatch(actions.changeProjectQuery(query)),
  onChangeTimelineQuery: query => dispatch(actions.changeTimelineQuery(query)),
  onToggleOverrideTemporalModal:
    open => dispatch(actions.toggleOverrideTemporalModal(open)),
  onMetricsTimeline:
    type => dispatch(metricsTimeline(type))
})

const mapStateToProps = state => ({
  browser: state.browser,
  collectionsMetadata: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  pathname: state.router.location.pathname,
  projectCollectionsIds: getProjectCollectionsIds(state),
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export const TimelineContainer = (props) => {
  const {
    browser,
    collectionsMetadata,
    focusedCollection,
    pathname,
    projectCollectionsIds,
    temporalSearch,
    timeline,
    onChangeQuery,
    onChangeProjectQuery,
    onChangeTimelineQuery,
    onToggleOverrideTemporalModal,
    onMetricsTimeline
  } = props

  let changeQueryMethod = onChangeQuery

  // Determine the collectionMetadata the timeline should be displaying
  const isProjectPage = isPath(pathname, ['/projects'])
  const isGranulesPage = isPath(pathname, ['/search/granules'])

  const collectionMetadata = {}
  const collectionsToRender = []

  if (isProjectPage) {
    collectionsToRender.push(...projectCollectionsIds.slice(0, 3))

    // Call a specific changeQuery action to ensure the correct update are madd
    changeQueryMethod = onChangeProjectQuery
  } else if (isGranulesPage && focusedCollection !== '') {
    collectionsToRender.push(focusedCollection)
  }

  // Retrieve metadata for each collection we're displaying
  collectionsToRender.slice(0, 3).forEach((collectionId) => {
    const { [collectionId]: visibleCollectionMetadata = {} } = collectionsMetadata

    collectionMetadata[collectionId] = visibleCollectionMetadata
  })

  // Prevent the timeline from rendering if there are no collections to display
  if (collectionsToRender.length === 0) return null

  return (
    <Timeline
      browser={browser}
      collectionMetadata={collectionMetadata}
      pathname={pathname}
      showOverrideModal={isProjectPage}
      temporalSearch={temporalSearch}
      timeline={timeline}
      onChangeQuery={changeQueryMethod}
      onChangeTimelineQuery={onChangeTimelineQuery}
      onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
      onMetricsTimeline={onMetricsTimeline}
    />
  )
}

TimelineContainer.defaultProps = {
  temporalSearch: {}
}

TimelineContainer.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionsMetadata: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeProjectQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  onMetricsTimeline: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
