import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const RadioList = ({
  defaultValue,
  onChange,
  radioList,
  renderRadio
}) => {
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
      {radioList.map((radio) => renderRadio(radio, onPropsChange, selected))}
    </div>
  )
}

RadioList.defaultProps = {
  defaultValue: null,
  onChange: null
}

RadioList.propTypes = {
  radioList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  renderRadio: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
}

export default RadioList
