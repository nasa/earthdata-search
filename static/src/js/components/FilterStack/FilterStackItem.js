import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaTimesCircle } from 'react-icons/fa'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './FilterStackItem.scss'

const FilterStackItem = (props) => {
  const {
    dataTestId,
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

  if (typeof icon === 'string' && icon === 'edsc-globe') {
    iconClass = 'edsc-icon-globe-grid filter-stack-item__icon filter-stack-item__icon--small'
  } else {
    iconClass = 'filter-stack-item__icon'
  }

  const filterStackItemClasses = classNames([
    'filter-stack-item',
    {
      [`filter-stack-item--${variant}`]: variant
    }
  ])

  return (
    <li
      className={filterStackItemClasses}
      data-testid={dataTestId}
    >
      <div className="filter-stack-item__content">
        <div className="filter-stack-item__body">
          {
            variant === 'naked'
              ? children
              : (
                <>
                  <div className="filter-stack-item__body-primary">
                    <header className="filter-stack-item__header">
                      <EDSCIcon className={iconClass} icon={icon} title={title} />
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
                          icon={FaTimesCircle}
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
            <div
              className="filter-stack-item__hint"
              data-testid="filter-stack-item__hint"
            >
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
  dataTestId: null,
  error: null,
  hint: null,
  icon: null,
  onRemove: null,
  secondaryTitle: null,
  variant: 'icon'
}

FilterStackItem.propTypes = {
  dataTestId: PropTypes.string,
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  hint: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onRemove: PropTypes.func,
  title: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  variant: PropTypes.string
}

export default FilterStackItem
