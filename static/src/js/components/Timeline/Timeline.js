import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { isEqual } from 'lodash'

import '@edsc/timeline'
import { timelineIntervals } from '../../util/timeline'
import getObjectKeyByValue from '../../util/object'
import { getColorByIndex } from '../../util/colors'

import './Timeline.scss'
import { getTemporalRange } from '../../util/edscDate'

const earliestStart = '1960-01-01'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.rows = {}
    this.panTimeout = null

    this.handleArrowPan = this.handleArrowPan.bind(this)
    this.handleButtonZoom = this.handleButtonZoom.bind(this)
    this.handleClickLabel = this.handleClickLabel.bind(this)
    this.handleCreatedTemporal = this.handleCreatedTemporal.bind(this)
    this.handleDraggingPan = this.handleDraggingPan.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.handleScrollPan = this.handleScrollPan.bind(this)
    this.handleScrollZoom = this.handleScrollZoom.bind(this)
    this.handleTemporalSet = this.handleTemporalSet.bind(this)
  }

  componentDidMount() {
    // Initialize the timeline plugin
    this.$el = $(this.el)

    this.$el.timeline()

    // set any initial values in props
    const {
      showOverrideModal,
      temporalSearch,
      timeline,
      onToggleOverrideTemporalModal
    } = this.props

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

    this.$el.on('arrowpan.timeline', this.handleArrowPan)
    this.$el.on('buttonzoom.timeline', this.handleButtonZoom)
    this.$el.on('clicklabel.timeline', this.handleClickLabel)
    this.$el.on('createdtemporal.timeline', this.handleCreatedTemporal)
    this.$el.on('draggingpan.timeline', this.handleDraggingPan)
    this.$el.on('focuschange.timeline', this.handleFocusChange)
    this.$el.on('rangechange.timeline', this.handleRangeChange)
    this.$el.on('rowtemporalchange.timeline', this.handleRowTemporalChange)
    this.$el.on('scrollpan.timeline', this.handleScrollPan)
    this.$el.on('scrollzoom.timeline', this.handleScrollZoom)
    this.$el.on('temporalchange.timeline', this.handleTemporalSet)

    this.$el.trigger('rangechange.timeline')

    if (showOverrideModal && Object.keys(temporalSearch).length > 0 && start && end) {
      onToggleOverrideTemporalModal(true)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      pathname: oldPathname,
      temporalSearch: oldTemporalSearch,
      timeline: oldTimeline
    } = this.props

    const {
      collectionMetadata: nextCollectionMetadata,
      onToggleOverrideTemporalModal,
      pathname: nextPathname,
      showOverrideModal,
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

    if (nextFocusEnd
      && nextFocusStart
      && (oldFocusEnd !== nextFocusEnd || oldFocusStart !== nextFocusStart)) {
      this.setTimelineFocus(nextFocusStart, nextFocusEnd)
    }

    // if the temporal has changed, update the temporal
    if (oldTemporalSearch !== nextTemporalSearch) this.setTimelineTemporal(nextTemporalSearch)

    const newRows = {}
    // Setup a row for each collection in collectionMetadata if the rows have changed
    if (!isEqual(Object.keys(nextCollectionMetadata), Object.keys(this.rows))) {
      const timelineRows = []

      Object.keys(nextCollectionMetadata).forEach((collectionId) => {
        if (!nextCollectionMetadata[collectionId]) return

        const metadata = nextCollectionMetadata[collectionId]

        if (Object.keys(metadata).length === 0) return

        const {
          title = ''
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

      const metadata = nextCollectionMetadata[collectionId]

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

    Object.keys(nextCollectionMetadata).forEach((collectionId) => {
      if (!nextCollectionMetadata[collectionId]) return

      // If there is a granule filter temporal set, and it doesn't exist on the timeline, add the data for the focused collection
      const { granuleFilters = {} } = nextCollectionMetadata[collectionId]
      const { temporal: granuleFilterTemporal = {} } = granuleFilters

      if (
        this.$el.timeline('getRowTemporal', collectionId).length === 0
        && Object.keys(granuleFilterTemporal).length > 0
      ) {
        const { startDate = '', endDate = '' } = granuleFilterTemporal
        this.setTimelineRowTemporal(collectionId, { startDate, endDate })
      }
    })

    // If the pathname changed and we should show the override modal, show it
    if (
      (oldPathname !== nextPathname || oldPathname === undefined)
      && showOverrideModal
      && Object.keys(nextTemporalSearch).length > 0
      && nextFocusStart
      && nextFocusEnd
    ) {
      onToggleOverrideTemporalModal(true)
    }
  }

  componentDidUpdate() {
    const { browser = {} } = this.props
    const { name } = browser

    if (browser && name !== 'ie') {
      window.dispatchEvent(new Event('resize'))
    } else {
      $(window).trigger('resize')
    }
  }

  componentWillUnmount() {
    // Remove the timeline
    this.$el.off('temporalchange.timeline', this.handleTemporalSet)
    this.$el.off('rangechange.timeline', this.handleRangeChange)
    this.$el.off('focuschange.timeline', this.handleFocusChange)
    this.$el.off('rowtemporalchange.timeline', this.handleRowTemporalChange)
    this.$el.off('buttonzoom.timeline', this.handleButtonZoom)
    this.$el.off('arrowpan.timeline', this.handleArrowPan)
    this.$el.off('clicklabel.timeline', this.handleClickLabel)
    this.$el.off('createdtemporal.timeline', this.handleCreatedTemporal)
    this.$el.off('scrollzoom.timeline', this.handleScrollZoom)
    this.$el.off('scrollpan.timeline', this.handleScrollPan)
    this.$el.off('draggingpan.timeline', this.handleDraggingPan)
    this.$el.timeline('destroy')
  }

  /**
   * Set temporal values in the timeline, causes the orange 'fenceposts' to appear
   * @param {Object} temporalSearch - An object containing dates with the shape { startDate, endDate }
   */
  setTimelineTemporal(temporalSearch) {
    const { endDate, startDate, isRecurring } = temporalSearch

    if (startDate || endDate) {
      const rangeStart = startDate ? new Date(startDate) : new Date(earliestStart)
      const rangeEnd = endDate ? new Date(endDate) : new Date()

      if (isRecurring) {
        this.$el.timeline('setTemporal', getTemporalRange(startDate, endDate))
      } else {
        this.$el.timeline('setTemporal', [[rangeStart, rangeEnd]])
      }
    } else {
      this.$el.timeline('setTemporal', [])
    }
  }

  /**
   * Set row specific temporal values in the timeline, causes the orange 'fenceposts' to appear. This will override the
   * global temporal range for the focused collection
   * @param {Object} temporalSearch - An object containing dates with the shape { startDate, endDate }
   */
  setTimelineRowTemporal(id, temporalSearch) {
    const { endDate, startDate } = temporalSearch

    if (startDate || endDate) {
      const rangeStart = startDate ? new Date(startDate) : new Date(earliestStart)
      const rangeEnd = endDate ? new Date(endDate) : new Date()

      this.$el.timeline('setRowTemporal', id, [[rangeStart, rangeEnd]])
    } else {
      this.$el.timeline('setRowTemporal', id, [])
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

    if (!start) {
      // eslint-disable-next-line no-param-reassign
      [start, end, interval] = this.$el.timeline('range')
    }

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
    const {
      showOverrideModal,
      timeline,
      onChangeQuery,
      onToggleOverrideTemporalModal
    } = this.props

    if (start && end) {
      // if focused exists and we are on the project page, show the modal
      if (showOverrideModal) {
        const { query } = timeline
        const { start: focusStart, end: focusEnd } = query
        if (focusStart && focusEnd) {
          onToggleOverrideTemporalModal(true)
        }
      }

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

  handleButtonZoom() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Button Zoom')
  }

  handleArrowPan() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Left/Right Arrow Pan')
  }

  handleClickLabel() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Click Label')
  }

  handleCreatedTemporal() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Created Temporal')
  }

  handleScrollZoom() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Scroll Zoom')
  }

  handleScrollPan() {
    const { onMetricsTimeline } = this.props
    clearTimeout(this.panTimeout)

    const sendPanEvent = () => onMetricsTimeline('Scroll Pan')
    setTimeout(sendPanEvent, 300)
  }

  handleDraggingPan() {
    const { onMetricsTimeline } = this.props
    onMetricsTimeline('Dragging Pan')
  }

  render() {
    return (
      <section className="timeline">
        <div ref={(el) => { this.el = el }} />
      </section>
    )
  }
}

Timeline.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  pathname: PropTypes.string.isRequired,
  showOverrideModal: PropTypes.bool.isRequired,
  temporalSearch: PropTypes.shape({}).isRequired,
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  onMetricsTimeline: PropTypes.func.isRequired
}

export default Timeline
