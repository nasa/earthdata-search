import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { difference } from 'lodash'

import '../../../../../node_modules/edsc-timeline/dist/edsc-timeline.min'
import { timelineIntervals } from '../../util/timeline'
import getObjectKeyByValue from '../../util/object'
import { getColorByIndex } from '../../util/colors'

import './Timeline.scss'

const earliestStart = '1960-01-01'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.rows = {}

    this.handleTemporalSet = this.handleTemporalSet.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
  }

  componentDidMount() {
    // Initialize the timeline plugin
    this.$el = $(this.el)

    this.$el.on('temporalchange.timeline', this.handleTemporalSet)
    this.$el.on('rangechange.timeline', this.handleRangeChange)
    this.$el.on('focusset.timeline', this.handleFocusChange)
    this.$el.on('focusremove.timeline', this.handleFocusChange)

    this.$el.timeline()

    // set any initial values in props
    const { temporalSearch, timeline } = this.props
    const { query } = timeline
    const {
      center,
      end,
      interval,
      start
    } = query

    this.setTimelineCenter(center)
    this.setTimelineZoom(interval)
    this.setTimelineTemporal(temporalSearch)
    this.setTimelineFocus(start, end)
  }

  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch: oldTemporalSearch,
      timeline: oldTimeline
    } = this.props

    const {
      collectionMetadata: nextCollectionMetadata,
      temporalSearch: nextTemporalSearch,
      timeline: nextTimeline
    } = nextProps

    const {
      query: oldTimelineQuery = {}
    } = oldTimeline
    const {
      query: nextTimelineQuery = {}
    } = nextTimeline

    const {
      center: oldCenter,
      interval: oldInterval
    } = oldTimelineQuery
    const {
      center: nextCenter,
      interval: nextInterval
    } = nextTimelineQuery

    // if the timeline center has changed, set it
    if (oldCenter !== nextCenter) this.setTimelineCenter(nextCenter)

    // if the timeline zoom has changed, set it
    if (oldInterval !== nextInterval) this.setTimelineZoom(nextInterval)

    // if the timeline focus has changed, set it
    const {
      end: oldFocusEnd,
      start: oldFocusStart
    } = oldTimelineQuery
    const {
      end: nextFocusEnd,
      start: nextFocusStart
    } = nextTimelineQuery
    if (oldFocusEnd !== nextFocusEnd || oldFocusStart !== nextFocusStart) {
      this.setTimelineFocus(nextFocusStart, nextFocusEnd)
    }

    // if the temporal has changed, update the temporal
    if (oldTemporalSearch !== nextTemporalSearch) this.setTimelineTemporal(nextTemporalSearch)

    const newRows = {}
    // Setup a row for each collection in collectionMetadata
    if (difference(Object.keys(nextCollectionMetadata), Object.keys(this.rows)).length > 0) {
      const timelineRows = []
      Object.keys(nextCollectionMetadata).forEach((collectionId) => {
        if (!nextCollectionMetadata[collectionId]) return
        const { metadata } = nextCollectionMetadata[collectionId]
        if (Object.keys(metadata).length === 0) return

        const {
          title
        } = metadata

        newRows[collectionId] = []

        let truncatedTitle = title
        if (title.length > 67) {
          truncatedTitle = `${title.substr(0, 67)}...`
        }
        timelineRows.push({
          id: collectionId,
          title: truncatedTitle
        })
      })

      if (timelineRows.length > 0) {
        this.rows = {
          ...this.rows,
          ...newRows
        }
        this.$el.timeline('rows', timelineRows)
      }
    }
    if (Object.keys(nextCollectionMetadata).length === 0) {
      this.rows = {}
      this.clearTimelineData()
    }


    // For each collection in collectionMetadata, update the timeline data
    Object.keys(nextTimeline.intervals).forEach((collectionId) => {
      const intervals = nextTimeline.intervals[collectionId]
      if (!nextCollectionMetadata[collectionId]) return
      const { metadata } = nextCollectionMetadata[collectionId]
      if (Object.keys(metadata).length === 0) return

      // if the collection already exists in the state, compare the new values
      if (Object.keys(this.rows).indexOf(collectionId) !== -1) {
        const oldIntervals = this.rows[collectionId]
        if (oldIntervals !== intervals) {
          this.rows = {
            ...this.rows,
            [collectionId]: intervals
          }
          this.setTimelineData(collectionId, nextTimeline, getColorByIndex(Object.keys(this.rows)
            .indexOf(collectionId)))
        }
      } else {
        // if the collection doesn't appear in the state, add the values
        this.rows = {
          ...this.rows,
          [collectionId]: intervals
        }
        this.setTimelineData(collectionId, nextTimeline, getColorByIndex(Object.keys(this.rows)
          .indexOf(collectionId)))
      }
    })
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
   * @param {object} collectionId Collection metadata
   * @param {object} timeline Timeline object from the Redux store
   */
  setTimelineData(collectionId, timeline, color) {
    const {
      intervals: allIntervals,
      query
    } = timeline

    const intervals = allIntervals[collectionId]

    const { endDate, startDate } = query

    if (intervals) {
      const data = {
        color,
        end: new Date(endDate) / 1000,
        intervals,
        resolution: query.interval,
        start: new Date(startDate) / 1000
      }

      this.$el.timeline('data', collectionId, data)
    }
  }


  /**
   * Set the center of the timeline
   * @param {string} center Timeline center value
   */
  setTimelineCenter(center) {
    const oldCenter = this.findTimelineCenter()

    if (center && center !== oldCenter) {
      this.$el.timeline('center', parseInt(center, 10) * 1000)
    }
  }


  /**
   * Set the zoom level on the timeline. Reads a english value for the zoom level, sets the value with an integer.
   * Mapping can be found in timelineIntervals
   * @param {object} interval Timeline zoom level
   */
  setTimelineZoom(interval) {
    const oldZoom = this.$el.timeline('zoom')
    if (oldZoom) {
      const oldInterval = getObjectKeyByValue(timelineIntervals, oldZoom.toString())

      if (interval && interval !== oldInterval) {
        const intervalNum = timelineIntervals[interval]
        this.$el.timeline('zoom', parseInt(intervalNum, 10))
      }
    }
  }


  /**
   * Sets the timeline focus.
   * @param {number} start Start date of focus in seconds
   * @param {number} end End date of focus in seconds
   */
  setTimelineFocus(start, end) {
    if (start && end) {
      const [oldStart, oldEnd] = this.$el.timeline('getFocus')
      if (oldStart / 1000 !== start && oldEnd / 1000 !== end) {
        this.$el.timeline('focus', new Date(start * 1000), new Date(end * 1000))
      }
    } else {
      this.$el.timeline('focus')
    }
  }

  /**
   * Helper method to get the current Timeline center
   */
  findTimelineCenter() {
    return Math.round(this.$el.timeline('center') / 1000) || undefined
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
      onChangeTimelineQuery
    } = this.props

    const endDate = new Date(end)
    const startDate = new Date(start)

    const query = {
      endDate: endDate.toISOString(),
      interval,
      startDate: startDate.toISOString()
    }

    const center = this.findTimelineCenter()
    if (center) {
      query.center = center
    }

    onChangeTimelineQuery(query)
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
        collection: {
          temporal: {
            endDate: new Date(end).toISOString(),
            startDate: new Date(start).toISOString()
          }
        }
      })
    } else {
      onChangeQuery({
        collection: {
          temporal: {}
        }
      })
    }
  }

  /**
   * Handles creating/removing the focused date when the timeline fires those events
   * @param {object} event jQuery event
   * @param {string} start Start of focused date
   * @param {string} end End of focused date
   */
  handleFocusChange(event, start, end) {
    const {
      showOverrideModal,
      temporalSearch,
      timeline,
      onChangeQuery,
      onChangeTimelineQuery,
      onToggleOverrideTemporalModal
    } = this.props

    const timelineQuery = {
      end: !end ? undefined : end / 1000,
      start: !start ? undefined : start / 1000
    }
    const newQuery = {
      collection: {
        overrideTemporal: {
          endDate: !end ? undefined : new Date(end).toISOString(),
          startDate: !start ? undefined : new Date(start).toISOString()
        }
      }
    }

    if (start && end) {
      const center = this.findTimelineCenter()
      timelineQuery.center = center

      // if temporalSearch exists and we are on the project page, show the modal
      if (showOverrideModal) {
        if (Object.keys(temporalSearch).length > 0) {
          onToggleOverrideTemporalModal(true)
        } else {
          // If we shouldn't show the modal, just update the query
          onChangeQuery(newQuery)
        }
      }
    }

    if (!showOverrideModal || !start || !end) {
      const { query } = timeline
      const { end: oldEnd, start: oldStart } = query

      // If the timeline doesn't have focus, don't bother trying to remove focus
      let shouldUpdateQuery = true
      if (!start && !end && !oldStart && !oldEnd) shouldUpdateQuery = false

      if (shouldUpdateQuery) {
        onChangeQuery(newQuery)
      }
    }
    onChangeTimelineQuery(timelineQuery)
  }

  render() {
    return (
      <section className="timeline">
        <div ref={(el) => { this.el = el }} />
      </section>
    )
  }
}

Timeline.defaultProps = {
  collectionMetadata: {}
}

Timeline.propTypes = {
  collectionMetadata: PropTypes.shape({}),
  showOverrideModal: PropTypes.bool.isRequired,
  temporalSearch: PropTypes.shape({}).isRequired,
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired
}

export default Timeline
