import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Dropdown } from 'react-bootstrap'

import './RadioSettingDropdownItem.scss'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

/**
 * Renders RadioSettingDropdownItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.className - String to use as the classname
 * @param {String} props.icon - The optional icon name
 * @param {Boolean} props.isActive - A flag designating the active item
 * @param {Function} props.onClick - A callback function called on click
 * @param {String} props.title - A string to use as the title
 */
export const RadioSettingDropdownItem = ({
  className,
  icon,
  isActive,
  onClick,
  title
}) => {
  const radioSettingItemClasses = classNames(
    className,
    'radio-setting-dropdown-item',
    {
      'radio-setting-dropdown-item--is-active': isActive
    }
  )

  return (
    <Dropdown.Item
      as="button"
      className={radioSettingItemClasses}
      onClick={onClick}
    >
      {
        icon && (
          <EDSCIcon
            className="radio-setting-dropdown-item__icon"
            size="0.75rem"
            icon={icon}
          />
        )
      }
      <span className="radio-setting-dropdown-item__title">{title}</span>
    </Dropdown.Item>
  )
}

RadioSettingDropdownItem.defaultProps = {
  className: null,
  icon: null,
  isActive: false,
  onClick: () => {}
}

RadioSettingDropdownItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.func,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

export default RadioSettingDropdownItem
