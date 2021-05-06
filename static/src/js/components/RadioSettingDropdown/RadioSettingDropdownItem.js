import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Dropdown } from 'react-bootstrap'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Spinner from '../Spinner/Spinner'

import './RadioSettingDropdownItem.scss'

/**
 * Renders RadioSettingDropdownItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.className - String to use as the classname
 * @param {String} props.icon - The optional icon name
 * @param {Boolean} props.isActive - A flag designating the active item
 * @param {Boolean} props.inProgress - A flag designating the current item is in progress to show a spinner
 * @param {Function} props.onClick - A callback function called on click
 * @param {String} props.title - A string to use as the title
 */
export const RadioSettingDropdownItem = ({
  className,
  icon,
  isActive,
  inProgress,
  onClick,
  title
}) => {
  const radioSettingItemClasses = classNames(
    className,
    'radio-setting-dropdown-item',
    {
      'radio-setting-dropdown-item--is-active': isActive,
      'radio-setting-dropdown-item--in-progress': inProgress
    }
  )

  return (
    <Dropdown.Item
      as="button"
      className={radioSettingItemClasses}
      onClick={onClick}
      disabled={inProgress}
    >
      {
        icon && !inProgress && (
          <EDSCIcon
            className="radio-setting-dropdown-item__icon"
            size="0.75rem"
            icon={icon}
          />
        )
      }
      {
        inProgress && (
          <Spinner className="radio-setting-dropdown-item__spinner" type="dots" size="x-tiny" inline />
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
  inProgress: false,
  onClick: () => {}
}

RadioSettingDropdownItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.func,
  isActive: PropTypes.bool,
  inProgress: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

export default RadioSettingDropdownItem
