import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Alert } from 'react-bootstrap'

import './EDSCAlert.scss'

export const EDSCAlert = ({
  bootstrapVariant,
  children,
  icon,
  variant
}) => {
  const alertClassName = classNames([
    'edsc-alert',
    {
      'edsc-alert--icon': icon,
      [`edsc-alert--${variant}`]: variant
    }
  ])
  return (
    <Alert
      className={alertClassName}
      variant={bootstrapVariant}
    >
      {
        icon && (
          <i className={`fa fa-${icon} edsc-alert__icon`} />
        )
      }
      <div className="edsc-alert__contents">
        {children}
      </div>
    </Alert>
  )
}

EDSCAlert.defaultProps = {
  children: null,
  icon: null,
  variant: false
}

EDSCAlert.propTypes = {
  bootstrapVariant: PropTypes.string.isRequired,
  children: PropTypes.node,
  icon: PropTypes.string,
  variant: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ])
}

export default EDSCAlert
