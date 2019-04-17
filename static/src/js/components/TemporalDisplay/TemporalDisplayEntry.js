import React from 'react'
import { pure } from 'recompose'
import PropTypes from 'prop-types'
import moment from 'moment'

const reformatDateString = (date) => {
  const dateToDisplay = moment.utc(date)
  return dateToDisplay.format('YYYY-MM-DD HH:mm:ss')
}

const TemporalDisplayEntry = pure((props) => {
  const { value } = props

  return (
    <>
      {reformatDateString(value)}
    </>
  )
})

TemporalDisplayEntry.propTypes = {
  value: PropTypes.string.isRequired
}

export default TemporalDisplayEntry
