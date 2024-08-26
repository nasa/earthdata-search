import React from 'react'
import PropTypes from 'prop-types'

import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './ExternalLink.scss'

export const ExternalLink = ({
  children,
  ...rest
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <a className="external-link link--external" target="_blank" rel="noopener noreferrer" {...rest}>
    {children}
    <EDSCIcon
      className="external-link__icon"
      icon={ArrowLineDiagonal}
      size="0.875em"
    />
  </a>
)

ExternalLink.defaultProps = {
  children: null
}

ExternalLink.propTypes = {
  children: PropTypes.node
}

export default ExternalLink
