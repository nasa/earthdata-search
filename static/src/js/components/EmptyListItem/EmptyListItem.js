
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './EmptyListItem.scss'

/**
 * Renders EmptyListItem.
 * @param {Node} className - Optional additional classnames.
 * @param {String} children - The text to be displayed. Should only be <span> or <a> tags.
 * @param {Array} icon - Overrides the default icon.
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

  const iconClassNames = classNames(
    'empty-list-item__icon',
    'fa',
    {
      [`fa-${icon}`]: icon
    }
  )
  return (
    <li className={listItemClasses}>
      <i className={iconClassNames} />
      <p className="empty-list-item__body">{children}</p>
    </li>
  )
}

EmptyListItem.defaultProps = {
  className: '',
  icon: 'exclamation-triangle'
}

EmptyListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  icon: PropTypes.string
}

export default EmptyListItem
