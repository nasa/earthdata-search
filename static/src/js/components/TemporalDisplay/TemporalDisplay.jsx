import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Calendar } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import TemporalDisplayEntry from './TemporalDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQueryTemporal } from '../../zustand/selectors/query'

import './TemporalDisplay.scss'

/**
 * Renders TemporalDisplay.
 * @param {function} onRemoveTimelineFilter - Function to remove temporal display component
 */
export const TemporalDisplay = () => {
  const temporalSearch = useEdscStore(getCollectionsQueryTemporal)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  const handleRemove = (() => {
    changeQuery({
      collection: {
        temporal: {
          startDate: '',
          endDate: '',
          isRecurring: false
        }
      }
    })
  })

  useEffect(() => {
    const {
      endDate: newEndDate = '',
      startDate: newStartDate = '',
      isRecurring: newIsRecurring = false
    } = temporalSearch

    setEndDate(newEndDate)
    setStartDate(newStartDate)
    setIsRecurring(newIsRecurring)
  }, [temporalSearch])

  if (!startDate && !endDate) {
    return null
  }

  const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
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
      icon={Calendar}
      title="Temporal"
      onRemove={handleRemove}
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
}

export default TemporalDisplay
