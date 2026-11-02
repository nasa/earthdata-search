import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import { Plus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaTimes } from 'react-icons/fa'
import AppButton from '../Button/Button'

const AdvancedFilterValueInput = ({ label, selected, onChange }) => {
  const [value, setValue] = useState('')
  const trimmedValue = value.trim()
  const canAdd = trimmedValue.length > 0 && !selected.includes(trimmedValue)

  const addValue = () => {
    if (!canAdd) return

    onChange([...selected, trimmedValue])
    setValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return

    event.preventDefault()
    addValue()
  }

  return (
    <>
      <div className="d-flex gap-2">
        <Form.Control
          size="sm"
          type="text"
          aria-label={`Add ${label}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <AppButton
          className="advanced-search-filters__icon-button"
          ariaLabel={`Add ${label}`}
          bootstrapSize="sm"
          bootstrapVariant="primary"
          disabled={!canAdd}
          icon={Plus}
          label={`Add ${label}`}
          onClick={addValue}
          title={`Add ${label}`}
        >
          {null}
        </AppButton>
      </div>
      {
        selected.length > 0 && (
          <ul className="advanced-search-filters__selected-values" aria-label={`Selected values for ${label}`}>
            {
              selected.map((selectedValue) => (
                <li className="advanced-search-filters__selected-value" key={selectedValue}>
                  <span>{selectedValue}</span>
                  <AppButton
                    className="advanced-search-filters__icon-button"
                    ariaLabel={`Remove ${label} ${selectedValue}`}
                    bootstrapSize="sm"
                    bootstrapVariant="link"
                    icon={FaTimes}
                    label={`Remove ${label} ${selectedValue}`}
                    onClick={() => onChange(selected.filter((entry) => entry !== selectedValue))}
                    title={`Remove ${selectedValue}`}
                  >
                    {null}
                  </AppButton>
                </li>
              ))
            }
          </ul>
        )
      }
    </>
  )
}

AdvancedFilterValueInput.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
}

export default AdvancedFilterValueInput
