import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import '../../../../../node_modules/edsc-timeline/dist/edsc-timeline.min'
import { timelineIntervals } from '../../util/timeline'
import getObjectKeyByValue from '../../util/object'

const earliestStart = '1960-01-01'
const defaultInterval = 'day'

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.handleTemporalSet = this.handleTemporalSet.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
  }

  componentDidMount() {
    // Initialize the timeline plugin
    this.$el = $(this.el)
    this.$el.timeline()

    this.$el.on('temporalchange.timeline', this.handleTemporalSet)
    this.$el.on('rangechange.timeline', this.handleRangeChange)
  }

  componentWillReceiveProps(nextProps) {
    const {
      // focusedCollection: oldFocusedCollection,
      focusedCollectionMetadata: oldFocusedCollectionMetadata,
      temporalSearch: oldTemporalSearch,
      timeline: oldTimeline,
      onChangeTimelineQuery
    } = this.props

    const {
      // focusedCollection: nextFocusedCollection,
      focusedCollectionMetadata: nextFocusedCollectionMetadata,
      temporalSearch: nextTemporalSearch,
      timeline: nextTimeline
    } = nextProps

    const {
      query: oldTimelineQuery = {},
      state: oldTimelineState = {}
    } = oldTimeline
    const {
      query: nextTimelineQuery = {},
      state: nextTimelineState = {}
    } = nextTimeline
    let query = {}

    // if the timeline center has changed, set it
    const { center: oldCenter } = oldTimelineState
    const { center: nextCenter } = nextTimelineState
    if (oldCenter !== nextCenter) this.setTimelineCenter(nextTimeline.state)


    // if the timeline zoom has changed, set it
    const { interval: oldInterval } = oldTimelineQuery
    const { interval: nextInterval } = nextTimelineQuery
    if (oldInterval !== nextInterval) this.setTimelineZoom(nextTimeline.query)


    // if the temporal has changed, update the temporal
    if (oldTemporalSearch !== nextTemporalSearch) this.setTimelineTemporal(nextTemporalSearch)


    // if the focusedCollection has changed, change the timeline query (will fetch timeline granules)

    const [oldCollectionId = ''] = Object.keys(oldFocusedCollectionMetadata)
    const [nextCollectionId = ''] = Object.keys(nextFocusedCollectionMetadata)
    const metadata = nextFocusedCollectionMetadata[nextCollectionId]
    if (oldCollectionId !== nextCollectionId) {
      if (!metadata) {
        onChangeTimelineQuery({})
      } else {
        const {
          id,
          time_start: timeStart,
          time_end: timeEnd = new Date().toISOString()
        } = metadata

        const newInterval = nextTimeline.query.interval || defaultInterval

        if (id) {
          query = {
            endDate: timeEnd,
            interval: newInterval,
            startDate: timeStart
          }
        }

        onChangeTimelineQuery(query)
      }
    }


    // if the timeline granules have changed
    if (oldTimeline.intervals !== nextTimeline.intervals) {
      if (metadata) {
        this.setTimelineData(metadata, nextTimeline)
      } else {
        this.clearTimelineData()
      }
    }
  }

  componentWillUnmount() {
    // Remove the timeline
    this.$el.timeline('destroy')
  }


  /**
   * Set temporal values in the timeline, causes the orange 'fenceposts' to appear
   * @param {string} temporalSearch String with `start,end` temporal values
   */
  setTimelineTemporal(temporalSearch) {
    const { endDate, startDate } = temporalSearch

    if (startDate || endDate) {
      const rangeStart = startDate ? new Date(startDate) : new Date(earliestStart)
      const rangeEnd = endDate ? new Date(endDate) : new Date()

      this.$el.timeline('setTemporal', [[rangeStart, rangeEnd]])
    } else {
      this.$el.timeline('setTemporal', [])
    }
  }


  /**
   * Sets the rows (collections) and data (intervals or granules) in the timeline
   * @param {object} collection Collection metadata
   * @param {object} timeline Timeline object from the Redux store
   */
  setTimelineData(collection, timeline) {
    const {
      id,
      title,
      time_start: timeStart,
      time_end: timeEnd = false
    } = collection

    const {
      intervals,
      query
    } = timeline

    this.$el.timeline('rows', [{ id, title }])

    if (intervals) {
      const data = {
        start: new Date(timeStart) / 1000,
        end: (timeEnd ? new Date(timeEnd) : new Date()) / 1000,
        resolution: query.interval,
        intervals
      }

      this.$el.timeline('data', id, data)
    }
  }


  /**
   * Set the center of the timeline
   * @param {string} timelineState Timeline query object from the Redux store (timeline.state)
   */
  setTimelineCenter(timelineState) {
    const { center } = timelineState
    const oldCenter = this.findTimelineCenter()

    if (center && center !== oldCenter) {
      this.$el.timeline('center', parseInt(center, 10) * 1000)
    }
  }


  /**
   * Set the zoom level on the timeline. Reads a english value for the zoom level, sets the value with an integer.
   * Mapping can be found in timelineIntervals
   * @param {object} timelineQuery Timeline query object from the Redux store (timeline.query)
   */
  setTimelineZoom(timelineQuery) {
    const { interval } = timelineQuery
    const oldInterval = getObjectKeyByValue(timelineIntervals, this.$el.timeline('zoom').toString())

    if (interval && interval !== oldInterval) {
      const intervalNum = timelineIntervals[interval]
      this.$el.timeline('zoom', parseInt(intervalNum, 10))
    }
  }

  /**
   * Helper method to get the current Timeline center
   */
  findTimelineCenter() {
    return Math.round(this.$el.timeline('center') / 1000)
  }


  /**
   * Removes the rows (collections) from the timeline
   */
  clearTimelineData() {
    this.$el.timeline('rows', [])
  }


  /**
   * Handles the timeline moving, either panning or zooming. Updates the Redux store with the values
   * @param {object} event jQuery event
   * @param {string} start Start of the new timeline frame
   * @param {string} end End of the new timeline frame
   * @param {string} interval Zoom level of the timeline
   */
  handleRangeChange(event, start, end, interval) {
    const {
      onChangeTimelineQuery,
      onChangeTimelineState,
      timeline
    } = this.props
    const { interval: oldInterval } = timeline.query

    const center = this.findTimelineCenter()
    onChangeTimelineState({ center })

    if (oldInterval !== interval) onChangeTimelineQuery({ interval })
  }


  /**
   * Handles creating a temporal constraint with the timeline, updates the Redux store with values
   * @param {object} event jQuery event
   * @param {string} start Start of temporal range
   * @param {string} end End of temporal range
   */
  handleTemporalSet(event, start, end) {
    const { onChangeQuery } = this.props
    if (start && end) {
      onChangeQuery({
        temporal: {
          endDate: new Date(end).toISOString(),
          startDate: new Date(start).toISOString()
        }
      })
    } else {
      onChangeQuery({ temporal: {} })
    }
  }

  render() {
    const { focusedCollectionMetadata = {} } = this.props
    const [collectionId = ''] = Object.keys(focusedCollectionMetadata)
    const metadata = focusedCollectionMetadata[collectionId]
    // Don't display the timeline if there isn't a focusedCollection with metadata
    const display = collectionId === '' || Object.keys(metadata).length === 0 ? 'none' : 'block'

    return (
      <section className="timeline" style={{ display }}>
        <div ref={(el) => { this.el = el }} />
      </section>
    )
  }
}

Timeline.defaultProps = {
  focusedCollectionMetadata: {}
}

Timeline.propTypes = {
  focusedCollectionMetadata: PropTypes.shape({}),
  temporalSearch: PropTypes.shape({}).isRequired,
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onChangeTimelineState: PropTypes.func.isRequired

}

export default Timeline
