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
  innerLink,
  ...rest
}) => {
  const wrapperClasses = classNames([
    {
      // If this is an inner link, the external link class needs to be added to the wrapping element
      'external-link': innerLink,
      'link--light': variant === 'light'
    },
    className
  ])

  // If the link has a parent link this is needed to avoid DOM warnings while keeping styling
  if (innerLink) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <span className={wrapperClasses} {...rest}>
        {children}
        <EDSCIcon
          className="external-link__icon"
          icon={ArrowLineDiagonal}
          size="14"
        />
      </span>
    )
  }

  return (
    <span className={wrapperClasses}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <a
        className="link link--external"
        target="_blank"
        rel="noopener noreferrer"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        {children}
        <EDSCIcon
          className="external-link__icon"
          icon={ArrowLineDiagonal}
          size="14"
        />
      </a>
    </span>
  )
}

ExternalLink.defaultProps = {
  children: null,
  className: null,
  variant: null,
  innerLink: false
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
  innerLink: PropTypes.bool
}

export default ExternalLink
