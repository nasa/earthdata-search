import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './SidebarFiltersItem.scss'

/**
 * Renders SidebarFiltersItem.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.description - A description of the granule filter.
 * @param {String} props.heading - The heading for the granule filter.
 * @param {Node} props.children - The granule filter form element.
 */
export const SidebarFiltersItem = ({
  children,
  description,
  heading,
  hasPadding
}) => {
  const className = classNames([
    'sidebar-filters-item',
    {
      'sidebar-filters-item--no-padding': !hasPadding
    }
  ])
  return (
    <li className={className}>
      <header className="sidebar-filters-item__header">
        {
          heading && <h3 className="sidebar-filters-item__heading">{heading}</h3>
        }
        {
          description && (
            <p className="sidebar-filters-item__description">{description}</p>
          )
        }
      </header>
      <div className="sidebar-filters-item__body">
        {children}
      </div>
    </li>
  )
}

SidebarFiltersItem.defaultProps = {
  description: null,
  heading: '',
  hasPadding: true
}

SidebarFiltersItem.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  heading: PropTypes.node,
  hasPadding: PropTypes.bool
}

export default SidebarFiltersItem
