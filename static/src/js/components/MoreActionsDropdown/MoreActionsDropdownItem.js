import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Dropdown } from 'react-bootstrap'

import './MoreActionsDropdownItem.scss'

export const MoreActionsDropdownItem = ({
  className,
  icon,
  onClick,
  title
}) => {
  const moreActionItemClasses = classNames(
    className,
    'more-actions-dropdown-item'
  )

  const moreActionItemIconClasses = classNames(
    {
      [`fa fa-${icon}`]: icon
    },
    'more-actions-dropdown-item__icon'
  )

  return (
    <Dropdown.Item
      as="button"
      className={moreActionItemClasses}
      onClick={onClick}
    >
      {icon && <i className={moreActionItemIconClasses} />}
      {title}
    </Dropdown.Item>
  )
}

MoreActionsDropdownItem.defaultProps = {
  className: null,
  icon: null,
  onClick: () => {}
}

MoreActionsDropdownItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

export default MoreActionsDropdownItem
