import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { FaCheck } from 'react-icons/fa'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'

import './AccessMethodRadio.scss'

export const AccessMethodRadio = ({
  id,
  description,
  details,
  value,
  checked,
  onChange,
  onClick,
  title,
  serviceName,
  subtitle
}) => {
  const [moreInfoActive, setMoreInfoActive] = useState(false)

  const onMoreDetailsClick = (e) => {
    e.stopPropagation()
    setMoreInfoActive(!moreInfoActive)
  }

  const labelClassName = classNames([
    'access-method-radio',
    {
      'access-method-radio--is-selected': checked
    }
  ])
  return (
    <label
      className={labelClassName}
      htmlFor={id}
      data-testid={id}
    >
      <input
        className="access-method-radio__input"
        id={id}
        type="radio"
        name={id}
        value={value}
        checked={checked ? 'checked' : ''}
        onChange={onChange}
        onClick={onClick}
      />
      <div className="access-method-radio__radio">
        { checked && <EDSCIcon icon={FaCheck} className="access-method-radio__radio-icon" /> }
      </div>
      <div className="access-method-radio__content">
        <header className="access-method-radio__header">
          <div className="access-method-radio__header-primary">
            <h4 className="access-method-radio__title">
              {title}
            </h4>
            <span className="access-method-radio__subtitle">
              {subtitle}
            </span>
          </div>
          <div className="access-method-radio__header-secondary">
            <span className="access-method-radio__description">
              {description}
            </span>
          </div>
          <div className="access-method-radio__header-tertiary">
            <button
              className="access-method-radio__more-info-button"
              type="button"
              onClick={onMoreDetailsClick}
            >
              {`${!moreInfoActive ? 'More ' : 'Less '}`}
              Info
            </button>
          </div>
        </header>
      </div>
      <CSSTransition
        in={moreInfoActive}
        timeout={0}
        classNames="access-method-radio__more-info-view"
      >
        <div className="access-method-radio__more-info">
          <span className="access-method-radio__details">
            {details}
          </span>
          {
            serviceName && (
              <span className="access-method-radio__service-name">
                {'Service: '}
                {serviceName}
              </span>
            )
          }
        </div>
      </CSSTransition>
    </label>
  )
}

AccessMethodRadio.defaultProps = {
  checked: null,
  onChange: null,
  onClick: null,
  subtitle: null,
  serviceName: null
}

AccessMethodRadio.propTypes = {
  checked: PropTypes.bool,
  description: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]).isRequired,
  details: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]).isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  serviceName: PropTypes.string
}

export default AccessMethodRadio
