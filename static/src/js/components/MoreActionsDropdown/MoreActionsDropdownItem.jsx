import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dropdown from 'react-bootstrap/Dropdown'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Spinner from '../Spinner/Spinner'

import './MoreActionsDropdownItem.scss'

export const MoreActionsDropdownItem = ({
  className,
  icon,
  onClick,
  inProgress,
  title
}) => {
  const moreActionItemClasses = classNames(
    className,
    'more-actions-dropdown-item'
  )

  const moreActionItemIconClasses = 'more-actions-dropdown-item__icon'

  return (
    <Dropdown.Item
      as="button"
      className={moreActionItemClasses}
      onClick={onClick}
      disabled={inProgress}
    >
      {
        icon && (
          <EDSCIcon
            className={moreActionItemIconClasses}
            size="12"
            icon={icon}
          />
        )
      }
      {
        inProgress && (
          <Spinner className="radio-setting-dropdown-item__spinner" type="dots" size="x-tiny" inline />
        )
      }
      <span className="more-actions-dropdown-item__title">{title}</span>
    </Dropdown.Item>
  )
}

MoreActionsDropdownItem.defaultProps = {
  className: null,
  icon: null,
  onClick: () => {},
  inProgress: false
}

MoreActionsDropdownItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onClick: PropTypes.func,
  inProgress: PropTypes.bool,
  title: PropTypes.string.isRequired
}

export default MoreActionsDropdownItem
