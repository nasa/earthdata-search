import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
// @ts-expect-error: This file does not have types
import { Plus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaTimes } from 'react-icons/fa'
import AppButton from '../Button/Button'

interface AdvancedFilterValueInputProps {
  /** The filter label, used in the input and button accessible names */
  label: string
  /** The currently selected values */
  selected: string[]
  /** Callback with the full list of selected values after an add or remove */
  onChange: (values: string[]) => void
}

const AdvancedFilterValueInput: React.FC<AdvancedFilterValueInputProps> = ({
  label,
  selected,
  onChange
}) => {
  const [value, setValue] = useState('')
  const trimmedValue = value.trim()
  const canAdd = trimmedValue.length > 0 && !selected.includes(trimmedValue)

  const addValue = () => {
    if (!canAdd) return

    onChange([...selected, trimmedValue])
    setValue('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
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

export default AdvancedFilterValueInput
