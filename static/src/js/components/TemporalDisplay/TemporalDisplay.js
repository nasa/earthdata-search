import React, {
  memo,
  useEffect,
  useState
} from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { FaCalendarAlt } from 'react-icons/fa'

import TemporalDisplayEntry from './TemporalDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import './TemporalDisplay.scss'

/**
 * Renders TemporalDisplay.
 * @param {function} onRemoveTimelineFilter - Function to remove temporal display component
 * @param {String} temporalSearch.endDate - Stopping date for collection search query
 * @param {Boolean} temporalSearch.isRecurring - Whether the data is collected periodically
 * @param {String} temporalSearch.startDate - Starting date for collection search query
 */
export const TemporalDisplay = memo(({
  onRemoveTimelineFilter,
  temporalSearch
}) => {
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  const onTimelineRemove = (() => {
    onRemoveTimelineFilter()
  })

  useEffect(() => {
    const { endDate, startDate, isRecurring } = temporalSearch
    setEndDate(endDate)
    setStartDate(startDate)
    setIsRecurring(isRecurring)
  }, [temporalSearch])

  if (!startDate && !endDate) {
    return null
  }

  const format = 'YYYY-MM-DDTHH:m:s.SSSZ'
  const startDateObject = moment.utc(startDate, format, true)
  const endDateObject = moment.utc(endDate, format, true)
  const temporalStartDisplay = startDate
    ? <TemporalDisplayEntry type="start" startDate={startDateObject} isRecurring={isRecurring} />
    : null
  const temporalEndDisplay = endDate
    ? <TemporalDisplayEntry type="end" endDate={endDateObject} isRecurring={isRecurring} />
    : null
  const temporalRangeDisplay = isRecurring
    ? <TemporalDisplayEntry type="range" startDate={startDateObject} endDate={endDateObject} isRecurring={isRecurring} shouldFormat={false} />
    : null

  return (
    <FilterStackItem
      icon={FaCalendarAlt}
      title="Temporal"
      onRemove={onTimelineRemove}
    >
      <FilterStackContents
        body={temporalStartDisplay}
        title="Start"
        showLabel
      />
      <FilterStackContents
        body={temporalEndDisplay}
        title="Stop"
        showLabel
      />
      <FilterStackContents
        body={temporalRangeDisplay}
        title="Range"
        showLabel
      />
    </FilterStackItem>
  )
})

TemporalDisplay.defaultProps = {
  temporalSearch: {}
}

TemporalDisplay.propTypes = {
  onRemoveTimelineFilter: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    startDate: PropTypes.string
  })
}

export default TemporalDisplay
