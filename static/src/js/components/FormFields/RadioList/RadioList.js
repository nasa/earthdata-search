import React, { Children, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Radio from '../Radio/Radio'
import AccessMethodRadio from '../AccessMethodRadio/AccessMethodRadio'

export const RadioList = ({ defaultValue, onChange, children }) => {
  const [selected, setSelected] = useState(defaultValue)

  useEffect(() => {
    setSelected(defaultValue)
  }, [defaultValue])

  const onPropsChange = (e) => {
    const { target } = e
    const { value } = target

    onChange(value)

    setSelected(value)
  }

  return (
    <div className="radio-list">
      {Children.map(children, (child) => {
        const { props, type } = child
        if (type !== Radio && type !== AccessMethodRadio) return null

        return React.cloneElement(child,
          // eslint-disable-next-line react/prop-types
          { onChange: onPropsChange, checked: selected === props.value })
      })}
    </div>
  )
}

RadioList.defaultProps = {
  defaultValue: null,
  onChange: null
}

RadioList.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
}

export default RadioList
