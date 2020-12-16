import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import { Badge } from 'react-bootstrap'

import './SplitBadge.scss'

const SplitBadge = ({
  className,
  primary,
  secondary,
  variant
}) => {
  const classes = classNames(
    'split-badge',
    {
      'split-badge--empty': !(secondary),
      [`${className}`]: className
    }
  )
  return (
    <Badge className={classes} variant={variant}>
      <span className="split-badge__primary">
        {primary}
      </span>
      {
        secondary && (
          <span className="split-badge__secondary">
            {secondary}
          </span>
        )
      }
    </Badge>
  )
}

SplitBadge.defaultProps = {
  className: null,
  secondary: null,
  variant: 'primary'
}

SplitBadge.propTypes = {
  className: PropTypes.string,
  primary: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  secondary: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  variant: PropTypes.string
}

export default SplitBadge
