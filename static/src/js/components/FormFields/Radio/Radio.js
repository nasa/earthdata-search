import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Radio.scss'

export const Radio = ({
  id,
  name,
  value,
  children,
  checked,
  onChange
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
        type="radio"
        name={name}
        value={value}
        checked={checked ? 'checked' : ''}
        onChange={onChange}
      />
      <span className="radio__content">{children}</span>
    </label>
  )
}

Radio.defaultProps = {
  checked: null,
  onChange: null
}

Radio.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

export default Radio
