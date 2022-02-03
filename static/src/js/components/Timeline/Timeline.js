import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import EDSCTimeline from '@edsc/timeline'
import classNames from 'classnames'
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa'

import Button from '../Button/Button'

import { getColorByIndex } from '../../util/colors'
import { timelineIntervals } from '../../util/timeline'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'
import getObjectKeyByValue from '../../util/object'

import './Timeline.scss'

const earliestStart = '1960-01-01'

export const Timeline = ({
  collectionMetadata,
  isOpen,
  onChangeQuery,
  onChangeTimelineQuery,
  onMetricsTimeline,
  onToggleOverrideTemporalModal,
  onToggleTimeline,
  pathname,
  showOverrideModal,
  temporalSearch,
  timeline
}) => {
  const { query } = timeline
  const { center: propsCenter } = query
  const [center, setCenter] = useState(propsCenter || new Date().getTime())

  const isProjectPage = pathname.indexOf('projects') > -1
  const containerRef = useRef()
  const previousHeight = useRef(0)

  useEffect(() => {
    if (containerRef.current) {
      const { height: elementHeight } = containerRef.current.getBoundingClientRect()

      // If the current height of the element is different than the previous render,
      // dispatch a resize event to set the size of the leaflet tools
      if (elementHeight !== previousHeight.current) window.dispatchEvent(new Event('resize'))

      previousHeight.current = elementHeight
    }
  })

  // Show the override temporal modal if temporal and focused exist and showOverrideModal is true
  useEffect(() => {
    const {
      endDate: temporalEnd,
      startDate: temporalStart
    } = temporalSearch
    const { query } = timeline
    const {
      end: focusedEnd,
      start: focusedStart
    } = query

    if (
      showOverrideModal
      && temporalStart
      && temporalEnd
      && focusedStart
      && focusedEnd
    ) {
      onToggleOverrideTemporalModal(true)
    }
  }, [pathname])

  /**
   * Handles keyup events
   */
  const onWindowKeyup = (event) => {
    // Do not allow collapsing of the timeline on the project page
    if (isProjectPage) return

    const toggleTimeline = () => onToggleTimeline(!isOpen)

    triggerKeyboardShortcut({
      event,
      shortcutKey: 't',
      shortcutCallback: toggleTimeline
    })
  }

  // Sets up event listener for keyup event
  useEffect(() => {
    window.addEventListener('keyup', onWindowKeyup)

    return () => {
      window.removeEventListener('keyup', onWindowKeyup)
    }
  }, [isOpen, isProjectPage])

  // Sets up event listener for keyup event
  useEffect(() => {
    window.addEventListener('keyup', onWindowKeyup)

    return () => {
      window.removeEventListener('keyup', onWindowKeyup)
    }
  }, [])

  // Metrics methods
  const handleArrowKeyPan = () => onMetricsTimeline('Left/Right Arrow Pan')
  const handleButtonPan = () => onMetricsTimeline('Button Pan')
  const handleButtonZoom = () => onMetricsTimeline('Button Zoom')
  const handleDragPan = () => onMetricsTimeline('Dragging Pan')
  const handleFocusedClick = () => onMetricsTimeline('Click Label')
  const handleScrollPan = () => onMetricsTimeline('Scroll Pan')
  const handleScrollZoom = () => onMetricsTimeline('Scroll Zoom')

  /**
   * Callback for the timeline moving, updates the timeline query in redux
   */
  const handleTimelineMoveEnd = ({
    center: newCenter,
    timelineEnd,
    zoom,
    timelineStart
  }) => {
    if (!timelineEnd && !timelineStart) return

    const endDate = new Date(timelineEnd)
    const startDate = new Date(timelineStart)

    const query = {
      center: newCenter,
      endDate: endDate.toISOString(),
      interval: getObjectKeyByValue(timelineIntervals, zoom.toString()),
      startDate: startDate.toISOString()
    }

    // TODO moving the timeline is causing a new timeline request - should only call if the timelineRange is changed

    onChangeTimelineQuery(query)
    setCenter(newCenter)
  }

  /**
   * Handles temporal being created by the timeline, updates the query in redux
   */
  const handleTemporalSet = ({ temporalEnd, temporalStart }) => {
    onMetricsTimeline('Created Temporal')

    if (temporalStart && temporalEnd) {
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
            endDate: new Date(temporalEnd).toISOString(),
            startDate: new Date(temporalStart).toISOString()
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
   * Handles a focused interval being set by the timeline, updates the query and timeline query in redux
   */
  const handleFocusedSet = ({ focusedEnd, focusedStart }) => {
    const timelineQuery = {
      end: focusedEnd,
      start: focusedStart
    }

    const newQuery = {
      collection: {
        overrideTemporal: {
          endDate: !focusedEnd ? undefined : new Date(focusedEnd).toISOString(),
          startDate: !focusedStart ? undefined : new Date(focusedStart).toISOString()
        }
      }
    }

    if (focusedStart && focusedEnd) {
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

    if (!showOverrideModal || !focusedStart || !focusedEnd) {
      const { query } = timeline
      const { end: oldEnd, start: oldStart } = query

      // If the timeline doesn't have focus, don't bother trying to remove focus
      let shouldUpdateQuery = true
      if (!focusedStart && !focusedEnd && !oldStart && !oldEnd) shouldUpdateQuery = false

      if (shouldUpdateQuery) {
        onChangeQuery(newQuery)
      }
    }

    onChangeTimelineQuery(timelineQuery)
  }

  /**
   * Converts redux timeline data (from CMR) into data usable by the timeline
   */
  const setupData = ({ intervals }) => {
    const data = []

    Object.keys(intervals).forEach((key, index) => {
      // If collectionMetadata doesn't exist for this key return
      if (!collectionMetadata[key]) return

      const values = intervals[key]
      const metadata = collectionMetadata[key] || {}

      const dataValue = {}
      dataValue.id = key
      dataValue.color = getColorByIndex(index)
      const { title = '' } = metadata
      dataValue.title = title

      dataValue.intervals = values.map((value) => {
        // const [start, end, count] = value
        const [start, end] = value

        // TODO: Change the format of the intervals to an object at some point
        return [start * 1000, end * 1000]
      })

      data.push(dataValue)
    })

    return data
  }

  /**
   * Pulls the focused interval out of the timeline query
   */
  const setupFocused = ({ query }) => {
    const { end, start } = query

    if (!end && !start) return {}

    return {
      end,
      start
    }
  }

  /**
   * Converts the temporal range into a format used by the timeline
   */
  const setupTemporal = ({ endDate, startDate }) => {
    if (!endDate && !startDate) return {}

    let end = new Date().getTime()
    let start = new Date(earliestStart).getTime()

    if (endDate) end = new Date(endDate).getTime()
    if (startDate) start = new Date(startDate).getTime()

    return { end, start }
  }

  /**
   * Converts the zoom level in the timeline query into a format used by the timeline
   */
  const setupZoom = ({ query }) => {
    const { interval = 'month' } = query

    return parseInt(timelineIntervals[interval], 10)
  }

  const hideTimeline = !(isOpen || isProjectPage)

  const timelineClasses = classNames([
    'timeline',
    {
      'timeline--is-hidden': hideTimeline
    }
  ])

  return (
    <>
      <section ref={containerRef} className={timelineClasses}>
        {
          hideTimeline && (
            <Button
              className="timeline__toggle-button timeline__toggle-button--open"
              type="button"
              icon={FaAngleDoubleUp}
              label="Show Timeline"
              onClick={() => onToggleTimeline(true)}
            >
              Expand timeline (t)
            </Button>
          )
        }

        <div className="timeline__container">
          {
            !isProjectPage && (
              <Button
                className="timeline__toggle-button timeline__toggle-button--close"
                type="button"
                variant="naked"
                icon={FaAngleDoubleDown}
                label="Hide Timeline"
                onClick={() => onToggleTimeline(false)}
              />
            )
          }
          <EDSCTimeline
            center={center}
            data={setupData(timeline)}
            focusedInterval={setupFocused(timeline)}
            maxZoom={5}
            minZoom={1}
            temporalRange={setupTemporal(temporalSearch)}
            zoom={setupZoom(timeline)}
            onArrowKeyPan={handleArrowKeyPan}
            onButtonPan={handleButtonPan}
            onButtonZoom={handleButtonZoom}
            onDragPan={handleDragPan}
            onFocusedIntervalClick={handleFocusedClick}
            onFocusedSet={handleFocusedSet}
            onScrollPan={handleScrollPan}
            onScrollZoom={handleScrollZoom}
            onTemporalSet={handleTemporalSet}
            onTimelineMoveEnd={handleTimelineMoveEnd}
          />
        </div>
      </section>
    </>
  )
}

Timeline.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onMetricsTimeline: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  onToggleTimeline: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  showOverrideModal: PropTypes.bool.isRequired,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    startDate: PropTypes.string
  }).isRequired,
  timeline: PropTypes.shape({
    query: PropTypes.shape({
      center: PropTypes.number,
      interval: PropTypes.string,
      start: PropTypes.number,
      end: PropTypes.number
    })
  }).isRequired
}

export default Timeline
