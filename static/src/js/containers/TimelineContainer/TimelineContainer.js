import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { metricsTimeline } from '../../middleware/metrics/actions'

import Timeline from '../../components/Timeline/Timeline'
import { getFocusedCollectionObject } from '../../util/focusedCollection'
import isPath from '../../util/isPath'

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
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  pathname: state.router.location.pathname,
  project: state.project,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export const TimelineContainer = (props) => {
  const {
    browser,
    collections,
    focusedCollection,
    pathname,
    project,
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

  if (isProjectPage) {
    const { byId } = collections
    const { collectionIds: projectIds } = project
    projectIds.forEach((collectionId, index) => {
      if (index > 2) return // only take the first 3 collections
      collectionMetadata[collectionId] = byId[collectionId]
    })

    changeQueryMethod = onChangeProjectQuery
  } else if (isGranulesPage && focusedCollection !== '') {
    const metadata = getFocusedCollectionObject(focusedCollection, collections)
    collectionMetadata[focusedCollection] = metadata
  }

  if (Object.keys(collectionMetadata).length === 0) return null

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
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  project: PropTypes.shape({}).isRequired,
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeProjectQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  onMetricsTimeline: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
