import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import Timeline from '../../components/Timeline/Timeline'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeTimelineQuery: query => dispatch(actions.changeTimelineQuery(query)),
  onChangeTimelineState: state => dispatch(actions.changeTimelineState(state))
})

const mapStateToProps = state => ({
  focusedCollection: state.focusedCollection,
  temporalSearch: state.query.temporal,
  timeline: state.timeline
})

export const TimelineContainer = (props) => {
  const {
    focusedCollection,
    temporalSearch,
    timeline,
    onChangeQuery,
    onChangeTimelineQuery,
    onChangeTimelineState
  } = props

  return (
    <Timeline
      focusedCollection={focusedCollection}
      temporalSearch={temporalSearch}
      timeline={timeline}
      onChangeQuery={onChangeQuery}
      onChangeTimelineQuery={onChangeTimelineQuery}
      onChangeTimelineState={onChangeTimelineState}
    />
  )
}

TimelineContainer.defaultProps = {
  focusedCollection: {},
  temporalSearch: {}
}

TimelineContainer.propTypes = {
  focusedCollection: PropTypes.shape({}),
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeTimelineState: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
