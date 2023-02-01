import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Radio.scss'

export const Radio = ({
  id,
  dataTestId,
  name,
  value,
  children,
  checked,
  onChange,
  onClick
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

Radio.defaultProps = {
  dataTestId: null,
  checked: null,
  onChange: null,
  onClick: null
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
