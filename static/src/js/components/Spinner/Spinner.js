import React from 'react'
import PropTypes from 'prop-types'

import './Spinner.scss'

export const Dots = () => (
  <div className="spinner spinner--dots">
    <div className="spinner__inner" />
    <div className="spinner__inner" />
    <div className="spinner__inner" />
  </div>
)

export const Spinner = ({ type }) => {
  if (type === 'dots') return <Dots />
  return null
}

Spinner.propTypes = {
  type: PropTypes.string.isRequired
}

export default Spinner
