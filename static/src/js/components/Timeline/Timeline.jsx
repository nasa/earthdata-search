import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import EDSCTimeline from '@edsc/timeline'
import classNames from 'classnames'
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa'
import moment from 'moment'

import Button from '../Button/Button'

import { getColorByIndex } from '../../util/colors'
import {
  timelineIntervals,
  timelineMidpoint,
  zoomLevelDifference,
  getTimelineProjectCenter
} from '../../util/timeline'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'
import getObjectKeyByValue from '../../util/object'

import './Timeline.scss'

const earliestStart = '1960-01-01'

const calculateInitialCenter = ({
  propsCenter,
  collectionMetadata,
  collectionConceptId,
  isProjectPage,
  projectCollectionsIds,
  currentDate
}) => {
  console.log('🚀 ~ collectionMetadata:', collectionMetadata)
  // If we have a center from props, use that
  if (propsCenter) return propsCenter

  // For project page, calculate center based on all collections
  if (isProjectPage && projectCollectionsIds.length > 0) {
    console.log('HERE')
    const colStartPoints = []
    const colEndPoints = []

    console.log('🚀 ~ projectCollectionsIds.forEach ~ projectCollectionsIds:', projectCollectionsIds)
    projectCollectionsIds.forEach((conceptId) => {
      const metadata = collectionMetadata[conceptId]
      console.log('🚀 ~ projectCollectionsIds.forEach ~ metadata:', metadata)
      if (!metadata?.timeStart) return

      const start = new Date(metadata.timeStart).getTime()
      console.log('🚀 ~ projectCollectionsIds.forEach ~ start:', start)
      const end = metadata.timeEnd ? new Date(metadata.timeEnd).getTime() : currentDate
      console.log('🚀 ~ projectCollectionsIds.forEach ~ end:', end)

      colStartPoints.push(start)
      colEndPoints.push(end)
    })

    if (colStartPoints.length && colEndPoints.length) {
      const earliestColDate = Math.min(...colStartPoints)
      const latestColDate = Math.max(...colEndPoints)

      return getTimelineProjectCenter(earliestColDate, latestColDate).getTime()
    }
  }

  // For single collection page
  const metadata = collectionMetadata[collectionConceptId]
  if (metadata?.timeStart) {
    console.log('HERE2')
    const collectionTimeStart = metadata.timeStart
    const collectionTimeEnd = metadata.timeEnd || currentDate

    console.log('timelineMidpoint(collectionTimeStart, collectionTimeEnd)', moment(timelineMidpoint(collectionTimeStart, collectionTimeEnd)).utc().toISOString())

    return timelineMidpoint(collectionTimeStart, collectionTimeEnd)
  }

  // Fallback to current date if no other options
  return currentDate
}

export const Timeline = ({
  collectionMetadata,
  isOpen,
  onChangeQuery,
  onChangeTimelineQuery,
  onMetricsTimeline,
  onToggleOverrideTemporalModal,
  onToggleTimeline,
  pathname,
  projectCollectionsIds,
  showOverrideModal,
  temporalSearch,
  timeline
}) => {
  const { query } = timeline

  const currentDate = new Date().getTime()
  const topLevelKeys = Object.keys(collectionMetadata)
  const collectionConceptId = topLevelKeys[0]
  const { center: propsCenter } = query
  const isProjectPage = pathname.indexOf('projects') > -1

  const [center, setCenter] = useState(() => {
    const initialCenter = calculateInitialCenter({
      propsCenter,
      collectionMetadata,
      collectionConceptId,
      isProjectPage,
      projectCollectionsIds,
      currentDate
    })

    // Update timeline query with initial center if needed
    if (initialCenter !== propsCenter) {
      onChangeTimelineQuery({
        ...query,
        center: initialCenter
      })
    }

    return initialCenter
  })

  useEffect(() => () => {
    onChangeTimelineQuery({
      center: undefined,
      interval: undefined,
      start: undefined,
      end: undefined
    })
  }, [onChangeTimelineQuery])

  const setupZoom = ({ query: timelineQuery }) => {
    const metadata = collectionMetadata[collectionConceptId]
    if (!metadata?.timeStart) return 2 // Default to day view (2)

    const { timeStart } = metadata
    const timeEnd = metadata.timeEnd || currentDate

    // Calculate default zoom level
    const calculatedInterval = zoomLevelDifference(timeStart, timeEnd)
    console.log('Raw calculated interval:', calculatedInterval)

    // Map the interval string to its numeric value
    let numericZoom
    if (timelineQuery.interval) {
      // If we have an interval in the query, use that
      numericZoom = parseInt(timelineIntervals[timelineQuery.interval], 10)
    } else {
      // Otherwise map our calculated interval to a numeric zoom
      const mappings = {
        minute: 0,
        hour: 1,
        day: 2,
        month: 3,
        year: 4,
        decade: 5
      }
      numericZoom = mappings[calculatedInterval] ?? 5 // Default to day view if mapping fails
    }

    console.log('Final numeric zoom:', numericZoom)

    return numericZoom
  }

  const containerRef = useRef()
  const previousHeight = useRef(0)

  useEffect(() => {
    console.log('center', moment(center).utc().toISOString())
  }, [center])

  useEffect(() => {
    if (containerRef.current) {
      // TODO this might be what causes that console error
      const { height: elementHeight } = containerRef.current.getBoundingClientRect()

      // If the current height of the element is different than the previous render,
      // dispatch a resize event to set the size of the leaflet tools
      if (elementHeight !== previousHeight.current) window.dispatchEvent(new Event('resize'))

      previousHeight.current = elementHeight
    }

    return () => {
      window.dispatchEvent(new Event('resize'))
    }
  }, [containerRef.current])

  // Show the override temporal modal if temporal and focused exist and showOverrideModal is true
  useEffect(() => {
    const {
      endDate: temporalEnd,
      startDate: temporalStart
    } = temporalSearch
    const { query: newQuery } = timeline
    const {
      end: focusedEnd,
      start: focusedStart
    } = newQuery
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

  useEffect(() => {
    const colstartPoints = []
    const colEndPoints = []
    if (isProjectPage) {
      projectCollectionsIds.forEach((conceptId) => {
        const metadata = collectionMetadata[conceptId] || {}
        if (!metadata.timeStart) {
          return
        }

        const collectionTimeStartProject = collectionMetadata[conceptId].timeStart
        const collectionTimeEndProject = collectionMetadata[conceptId].timeEnd
        if (!collectionTimeEndProject) {
          colstartPoints.push(currentDate)
        } else {
          const normalizedEndDate = new Date(collectionTimeEndProject)
          const millisecondsEndDate = normalizedEndDate.getTime()
          colEndPoints.push(millisecondsEndDate)
        }

        if (!collectionTimeStartProject) return
        const normalizedStartDate = new Date(collectionTimeStartProject)
        const millisecondsStartDate = normalizedStartDate.getTime()
        colstartPoints.push(millisecondsStartDate)
      })

      const earliestColDate = Math.min(...colstartPoints)
      const latestColDate = Math.max(...colEndPoints)

      const newCenterForProject = getTimelineProjectCenter(earliestColDate, latestColDate)
      setCenter(newCenterForProject)
    }
  }, [collectionMetadata])

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

    const newQuery = {
      center: newCenter,
      endDate: endDate.toISOString(),
      interval: getObjectKeyByValue(timelineIntervals, zoom.toString()),
      startDate: startDate.toISOString()
    }

    onChangeTimelineQuery(newQuery)
    setCenter(newCenter)
  }

  /**
   * Handles temporal being created by the timeline, updates the query in redux
   */
  const handleTemporalSet = ({ temporalEnd, temporalStart }) => {
    onMetricsTimeline('Created Temporal')

    if (temporalStart && temporalEnd) {
      // If focused exists and we are on the project page, show the modal
      if (showOverrideModal) {
        const { query: timelineQuery } = timeline
        const {
          start: focusStart,
          end: focusEnd
        } = timelineQuery

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

      // If temporalSearch exists and we are on the project page, show the modal
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
      const { query: existingQuery } = timeline
      const {
        end: oldEnd,
        start: oldStart
      } = existingQuery

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

    // Render the Collection Timelines in the same order they were added
    if (isProjectPage) {
      projectCollectionsIds.forEach((conceptId, index) => {
        if (!intervals[conceptId]) return

        const values = intervals[conceptId]
        const metadata = collectionMetadata[conceptId] || {}

        // Const collectionTimeStartProject = collectionMetadata[conceptId].timeStart
        // const collectionTimeEndProject = collectionMetadata[conceptId].timeEnd
        // if (!collectionTimeEndProject) {
        //   colstartPoints.push(currentDate)
        // }

        // colstartPoints.push(collectionTimeStartProject)
        // colEndPoints.push(collectionTimeEndProject)

        const dataValue = {}
        dataValue.id = conceptId
        dataValue.color = getColorByIndex(index)
        const { title = '' } = metadata
        dataValue.title = title

        dataValue.intervals = values.map((value) => {
          const [start, end] = value

          // Push these to arrs so we can use them to calculate the center

          // TODO: Change the format of the intervals to an object at some point
          return [start * 1000, end * 1000]
        })

        data.push(dataValue)
      })
    }

    // Ensure we render the Timeline on the granules page, even if it has not been added to the project
    if (!isProjectPage) {
      Object.keys(intervals).forEach((conceptId, index) => {
        if (!collectionMetadata[conceptId]) return

        const values = intervals[conceptId]
        const metadata = collectionMetadata[conceptId] || {}

        const dataValue = {}
        dataValue.id = conceptId
        dataValue.color = getColorByIndex(index)
        const { title = '' } = metadata
        dataValue.title = title

        dataValue.intervals = values.map((value) => {
          const [start, end] = value

          return [start * 1000, end * 1000]
        })

        data.push(dataValue)
      })
    }

    return data
  }

  /**
   * Pulls the focused interval out of the timeline query
   */
  const setupFocused = ({ query: timelineQuery }) => {
    const { end, start } = timelineQuery

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

    // Initialize earliest and latest dates
    let end = new Date().getTime()
    let start = new Date(earliestStart).getTime()

    if (endDate) end = new Date(endDate).getTime()
    if (startDate) start = new Date(startDate).getTime()

    return {
      end,
      start
    }
  }

  const hideTimeline = !(isOpen || isProjectPage)

  const timelineClasses = classNames([
    'timeline',
    {
      'timeline--is-hidden': hideTimeline
    }
  ])

  return (
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
            Expand timeline
            <span className="keyboard-shortcut">
              t
            </span>
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
  projectCollectionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
