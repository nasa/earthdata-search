import React from 'react'
import PropTypes from 'prop-types'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './MetaIcon.scss'

/**
 * Renders a MetaIcon component
 * @param {Object} props - The props passed into the component.
 * @param {String} props.className - A custom class name for the outer element.
 * @param {Object} props.iconProps - An object containing props to be set on the EDSCIcon component.
 * @param {String} props.id - A unique element id.
 * @param {String|Element} props.label - Text or element to be used as the screen reader text label.
 * @param {String|Element} props.metadata - Text or element to be shown in the metadata pill.
 * @param {String} props.placement - A string to set the tooltip placement.
 * @param {String} props.tooltipClassName - A custom class name for tooltip.
 * @param {String|Element} props.tooltipContent - Text or element to be displayed in the tooltip.
 */
export const MetaIcon = ({
  className,
  icon,
  iconProps,
  id,
  label,
  metadata,
  placement,
  tooltipClassName,
  tooltipContent
}) => {
  const component = (
    <span className={`meta-icon ${className}`}>
      <EDSCIcon
        className="meta-icon__icon"
        size="1rem"
        icon={icon}
        {...iconProps}
      />
      {
        label && (
          <span className="meta-icon__label visually-hidden">
            {label}
          </span>
        )
      }
      {
        metadata && (
          <span className="meta-icon__metadata">
            {metadata}
          </span>
        )
      }
    </span>
  )

  // If tooltipContent is set, return the component wrapped in a tooltip
  if (tooltipContent) {
    return (
      <OverlayTrigger
        placement={placement}
        overlay={(
          <Tooltip
            id={id}
            className={`meta-icon__tooltip ${tooltipClassName}`}
          >
            {tooltipContent}
          </Tooltip>
        )}
      >
        {component}
      </OverlayTrigger>
    )
  }

  // Return the component without a tooltip
  return component
}

MetaIcon.defaultProps = {
  className: '',
  iconProps: {},
  metadata: '',
  placement: 'top',
  tooltipClassName: '',
  tooltipContent: null
}

MetaIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  iconProps: PropTypes.shape({
    size: PropTypes.string
  }),
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string
  ]).isRequired,
  metadata: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string
  ]),
  placement: PropTypes.string,
  tooltipClassName: PropTypes.string,
  tooltipContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string
  ])
}

export default MetaIcon
