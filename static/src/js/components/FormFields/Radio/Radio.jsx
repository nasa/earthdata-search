import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Radio.scss'

export const Radio = ({
  checked = null,
  children,
  dataTestId = null,
  id,
  name,
  onChange = null,
  onClick = null,
  value
}) => {
  const labelClassName = classNames([
    'radio',
    {
      'radio--is-selected': checked
    }
  ])

  return (
    <label
      className={labelClassName}
      htmlFor={name}
    >
      <input
        className="radio__input"
        id={id}
        data-testid={dataTestId}
        type="radio"
        name={name}
        value={value}
        checked={checked ? 'checked' : ''}
        onChange={onChange}
        onClick={onClick}
      />
      <span className="radio__content">{children}</span>
    </label>
  )
}

Radio.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func
}

export default Radio
