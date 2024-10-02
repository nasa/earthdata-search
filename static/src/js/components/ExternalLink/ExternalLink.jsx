import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './ExternalLink.scss'

export const ExternalLink = ({
  children,
  className,
  variant,
  ...rest
}) => {
  const classes = classNames([
    'external-link link--external',
    {
      'link--light': variant === 'light'
    },
    className
  ])

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <a className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <EDSCIcon
        className="external-link__icon"
        icon={ArrowLineDiagonal}
        size="0.875em"
      />
    </a>
  )
}

ExternalLink.defaultProps = {
  children: null,
  className: null,
  variant: null
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string
}

export default ExternalLink
