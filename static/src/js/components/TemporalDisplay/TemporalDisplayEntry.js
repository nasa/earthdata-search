import React from 'react'
import { pure } from 'recompose'
import PropTypes from 'prop-types'
import { getTemporalDateFormat } from '../../util/edscDate'

const TemporalDisplayEntry = pure((props) => {
  const {
    startDate,
    endDate,
    isRecurring
  } = props

  // For recurring dates we don't show the year, it's displayed on the slider
  const temporalDateFormat = getTemporalDateFormat(isRecurring)

  let valueToDisplay
  if (Object.keys(startDate).length > 0) {
    valueToDisplay = startDate.format(temporalDateFormat)
  }

  if (Object.keys(endDate).length > 0) {
    valueToDisplay = endDate.format(temporalDateFormat)
  }

  if (isRecurring && Object.keys(startDate).length > 0 && Object.keys(endDate).length > 0) {
    valueToDisplay = `${startDate.year()} - ${endDate.year()}`
  }

  return (
    <>
      { valueToDisplay }
    </>
  )
})

TemporalDisplayEntry.defaultProps = {
  startDate: {},
  endDate: {},
  isRecurring: false
}
TemporalDisplayEntry.propTypes = {
  startDate: PropTypes.shape({}),
  endDate: PropTypes.shape({}),
  isRecurring: PropTypes.bool
}

export default TemporalDisplayEntry
