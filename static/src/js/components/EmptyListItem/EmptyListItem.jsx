import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaExclamationTriangle } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './EmptyListItem.scss'

/**
 * Renders EmptyListItem.
 * @param {Node} className - Optional additional classnames.
 * @param {String} children - The text to be displayed. Should only be <span> or <a> tags.
 * @param {Node} icon - Overrides the default icon with an icon passed to EDSC Icon.
 */
export const EmptyListItem = ({
  className,
  children,
  icon
}) => {
  const listItemClasses = classNames(
    'empty-list-item',
    `${className}`
  )

  let Icon = FaExclamationTriangle

  if (icon) {
    Icon = icon
  }

  return (
    <li className={listItemClasses}>
      <EDSCIcon className="empty-list-item__icon" icon={Icon} size="1.25rem" />
      <p className="empty-list-item__body">
        {children}
      </p>
    </li>
  )
}

EmptyListItem.defaultProps = {
  className: '',
  icon: null
}

EmptyListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  icon: PropTypes.func
}

export default EmptyListItem
