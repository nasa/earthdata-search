import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Alert from 'react-bootstrap/Alert'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './EDSCAlert.scss'

const EDSCAlert = ({
  bootstrapVariant,
  children = null,
  className = '',
  icon = null,
  variant = false
}) => {
  const alertClassName = classNames([
    'edsc-alert',
    {
      'edsc-alert--icon': icon,
      [`edsc-alert--${variant}`]: variant
    },
    className
  ])

  return (
    <Alert
      className={alertClassName}
      variant={bootstrapVariant}
    >
      {
        icon && (
          <EDSCIcon icon={icon} className="edsc-alert__icon" />
        )
      }
      <div className="edsc-alert__contents">
        {children}
      </div>
    </Alert>
  )
}

EDSCAlert.propTypes = {
  bootstrapVariant: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  variant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
}

export default EDSCAlert
