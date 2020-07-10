import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from '../Button/Button'

import './FilterStackItem.scss'

const FilterStackItem = (props) => {
  const {
    children,
    error,
    hint,
    icon,
    onRemove,
    title,
    secondaryTitle,
    variant
  } = props

  if (!children) return null

  let iconClass = ''

  if (icon === 'edsc-globe') {
    iconClass = 'edsc-icon-globe-grid filter-stack-item__icon filter-stack-item__icon--small'
  } else {
    iconClass = `fa fa-${icon} filter-stack-item__icon`
  }

  const filterStackItemClasses = classNames([
    'filter-stack-item',
    {
      [`filter-stack-item--${variant}`]: variant
    }
  ])

  return (
    <li className={filterStackItemClasses}>
      <div className="filter-stack-item__content">
        <div className="filter-stack-item__body">
          {
            variant === 'naked'
              ? children
              : (
                <>
                  <div className="filter-stack-item__body-primary">
                    <header className="filter-stack-item__header">
                      <i
                        className={iconClass}
                        title={title}
                      />
                      <h3 className="filter-stack-item__title">{title}</h3>
                      {
                        secondaryTitle && (
                          <span className="filter-stack-item__secondary-title">{secondaryTitle}</span>
                        )
                      }
                    </header>
                    <div className="filter-stack-item__body-contents">
                      {children}
                    </div>
                  </div>
                  <div className="filter-stack-item__body-actions">
                    {
                      onRemove && (
                        <Button
                          className="filter-stack-item__action-button"
                          label={`Remove ${title.toLowerCase()} filter`}
                          icon="times-circle"
                          onClick={() => { onRemove() }}
                        />
                      )
                    }
                  </div>
                </>
              )
          }
        </div>
        {
          hint && (
            <div className="filter-stack-item__hint">
              {hint}
            </div>
          )
        }
        {
          error && (
            <div className="filter-stack-item__error">
              {error}
            </div>
          )
        }
      </div>
    </li>
  )
}

FilterStackItem.defaultProps = {
  error: null,
  hint: null,
  icon: null,
  onRemove: null,
  secondaryTitle: null,
  variant: 'icon'
}

FilterStackItem.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  icon: PropTypes.string,
  onRemove: PropTypes.func,
  title: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  variant: PropTypes.string
}

export default FilterStackItem
