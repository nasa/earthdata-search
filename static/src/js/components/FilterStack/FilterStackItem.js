import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '../Button/Button'

import './FilterStackItem.scss'

const FilterStackItem = (props) => {
  const {
    children,
    hint,
    icon,
    onRemove,
    title
  } = props

  if (!title || !icon || !children) return null

  let iconClass = ''

  if (icon === 'edsc-globe') {
    iconClass = 'edsc-icon-globe-grid filter-stack-item__icon filter-stack-item__icon--small'
  } else {
    iconClass = `fa fa-${icon} filter-stack-item__icon`
  }

  return (
    <li className="filter-stack-item">
      <div className="filter-stack-item__content">
        <div className="filter-stack-item__body">
          <header className="filter-stack-item__header">
            <i
              className={iconClass}
              title={title}
            />
            <h3 className="filter-stack-item__title visibility-hidden">{title}</h3>
          </header>
          <div className="filter-stack-item__body-contents">
            {children}
          </div>
          <div className="filter-stack-item__body-actions">
            {
              onRemove && (
                <Button
                  className="filter-stack-item__action-button"
                  label={`Remove ${title.toLowerCase()}`}
                  icon="times-circle"
                  onClick={() => { onRemove() }}
                />
              )
            }
          </div>
        </div>
        {
          hint && (
            <div className="filter-stack-item__hint">
              {hint}
            </div>
          )
        }
      </div>
    </li>
  )
}

FilterStackItem.defaultProps = {
  hint: null,
  onRemove: null
}

FilterStackItem.propTypes = {
  children: PropTypes.node.isRequired,
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  icon: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  title: PropTypes.string.isRequired
}

export default FilterStackItem
