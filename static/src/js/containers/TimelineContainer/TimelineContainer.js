import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import Timeline from '../../components/Timeline/Timeline'
import getFocusedCollectionMetadata from '../../util/focusedCollection'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeTimelineQuery: query => dispatch(actions.changeTimelineQuery(query)),
  onChangeTimelineState: state => dispatch(actions.changeTimelineState(state))
})

const mapStateToProps = state => ({
  collections: state.collections,
  focusedCollection: state.focusedCollection,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export const TimelineContainer = (props) => {
  const {
    collections,
    focusedCollection,
    temporalSearch,
    timeline,
    onChangeQuery,
    onChangeTimelineQuery,
    onChangeTimelineState
  } = props

  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  return (
    <Timeline
      // focusedCollection={focusedCollection}
      focusedCollectionMetadata={focusedCollectionMetadata}
      temporalSearch={temporalSearch}
      timeline={timeline}
      onChangeQuery={onChangeQuery}
      onChangeTimelineQuery={onChangeTimelineQuery}
      onChangeTimelineState={onChangeTimelineState}
    />
  )
}

TimelineContainer.defaultProps = {
  temporalSearch: {}
}

TimelineContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeTimelineState: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
