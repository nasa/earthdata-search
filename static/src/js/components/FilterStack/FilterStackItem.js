import React from 'react'
import PropTypes from 'prop-types'

import './FilterStackItem.scss'

const FilterStackItem = (props) => {
  const {
    children,
    icon,
    title
  } = props

  if (!title || !icon || !children) return null

  return (
    <li className="filter-stack-item">
      <header className="filter-stack-item__header">
        <i
          className={`fa fa-${icon} filter-stack-item__icon`}
          title={title}
        />
        <h3 className="filter-stack-item__title visibility-hidden">{title}</h3>
      </header>
      <div className="filter-stack-item__body">
        {children}
      </div>
    </li>
  )
}

FilterStackItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default FilterStackItem
