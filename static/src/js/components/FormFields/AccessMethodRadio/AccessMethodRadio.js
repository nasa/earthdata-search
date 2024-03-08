import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FaCheck, FaQuestionCircle } from 'react-icons/fa'

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
  subtitle
}) => {
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
            <span className="access-method-radio__primary-titles">
              <h4 className="access-method-radio__title">
                {title}
              </h4>
              <span className="access-method-radio__subtitle">
                {subtitle}
              </span>
            </span>
          </div>
          <div className="access-method-radio__header-content">
            <span className="access-method-radio__description">
              {description}
            </span>
          </div>
        </header>
        {
          details && (

            <OverlayTrigger
              placement="top"
              overlay={
                (
                  <Tooltip style={{ width: '20rem' }}>
                    {details}
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details" />
            </OverlayTrigger>
          )
        }
      </div>
    </label>
  )
}

AccessMethodRadio.defaultProps = {
  checked: null,
  details: null,
  onChange: null,
  onClick: null,
  subtitle: null
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
  ]),
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default AccessMethodRadio
