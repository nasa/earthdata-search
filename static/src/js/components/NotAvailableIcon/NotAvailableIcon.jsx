import React from 'react'
import PropTypes from 'prop-types'

const NotAvailableIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="meta-icon__icon"
    role="graphics-symbol"
  >
    <path id="forground" fillRule="evenodd" clipRule="evenodd" d="M18.1484 20.0001L-0.000119153 1.85162L1.71094 0.140564L19.8594 18.2891L18.1484 20.0001Z" fill="currentColor" />
    <path id="background" fillRule="evenodd" clipRule="evenodd" d="M19.3584 18.7901L1.20992 0.641646L1.85156 0L20.0001 18.1485L19.3584 18.7901Z" fill="white" />
  </svg>
)

NotAvailableIcon.defaultProps = {
  size: '1rem'
}

NotAvailableIcon.propTypes = {
  size: PropTypes.string
}

export default NotAvailableIcon
