import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Dropdown } from 'react-bootstrap'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

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

  const moreActionItemIconClasses = 'more-actions-dropdown-item__icon'

  return (
    <Dropdown.Item
      as="button"
      className={moreActionItemClasses}
      onClick={onClick}
    >
      {icon && <EDSCIcon library="fa" icon={icon} className={moreActionItemIconClasses} />}
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
