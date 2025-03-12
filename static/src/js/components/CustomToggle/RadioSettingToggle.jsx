import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CustomToggle from './CustomToggle'

import './RadioSettingToggle.scss'

/**
 * Renders RadioSettingToggle.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.activeIcon - Optional icon name
 * @param {String} props.className - String to use as the class name
 * @param {String} props.label - String to use as the label
 * @param {Function} props.onClick - Callback to fire on click
 */
// eslint-disable-next-line react/display-name
export const RadioSettingToggle = React.forwardRef(({
  activeIcon,
  className,
  label,
  onClick,
  ...props
}, ref) => {
  const RadioSettingToggleClassNames = classNames(
    className,
    'radio-setting-toggle'
  )

  return (
    <CustomToggle
      className={RadioSettingToggleClassNames}
      onClick={onClick}
      ref={ref}
      title={label}
      icon={activeIcon}
      {...props}
    >
      <span className="radio-setting-toggle__label">{label}</span>
    </CustomToggle>
  )
})

RadioSettingToggle.defaultProps = {
  className: null
}

RadioSettingToggle.propTypes = {
  activeIcon: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default RadioSettingToggle
