import React from 'react'

import {
  act,
  render,
  screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import Datepicker from '../Datepicker'

const setup = (overrideProps) => {
  const onInputBlur = jest.fn()
  const onChange = jest.fn()
  const onClearClick = jest.fn()
  const onTodayClick = jest.fn()

  const props = {
    id: 'test-id',
    label: 'Date Time',
    isValidDate: jest.fn(),
    onChange,
    onClearClick,
    onInputBlur,
    onTodayClick,
    picker: React.createRef(),
    type: 'start',
    value: '',
    viewMode: 'years',
    ...overrideProps
  }

  // Rendering like this so that we can check the onBlur of Datepicker
  render(
    <div>
      <input aria-label="basic-input" />
      <Datepicker {...props} />
    </div>
  )

  return {
    props,
    onInputBlur,
    onChange,
    onClearClick,
    onTodayClick
  }
}

describe('Datepicker component', () => {
  describe('on render', () => {
    test('creates the custom buttons', () => {
      setup()

      const buttonToday = screen.getByText('Today')
      const buttonClear = screen.getByText('Clear')

      expect(buttonToday).toBeInTheDocument()
      expect(buttonClear).toBeInTheDocument()
    })

    test('handles invalid dates correctly', async () => {
      setup({
        label: 'datepicker--start',
        value: '1988-09-0e 00:00:00'
      })

      const dateTime = screen.getByRole('textbox', { name: 'datepicker--start' })

      expect(dateTime).toBeInTheDocument()
      expect(dateTime).toHaveValue('1988-09-0e 00:00:00')
    })

    test('handles iso dates correctly', async () => {
      setup({
        label: 'datepicker--start',
        value: '1988-09-04 00:00:00'
      })

      const dateTime = screen.getByRole('textbox', { name: 'datepicker--start' })

      expect(dateTime).toBeInTheDocument()
      expect(dateTime).toHaveValue('1988-09-04 00:00:00')
    })

    test('handles ISO dates correctly', () => {
      setup({
        label: 'datepicker--start',
        value: '1988-09-03T00:00:00.000Z'
      })

      const datePickerInput = screen.getByRole('textbox', { name: 'datepicker--start' })
      expect(datePickerInput).toHaveValue('1988-09-03T00:00:00.000Z')
    })
  })

  describe('when the input value changes', () => {
    test('onInputChange gets triggered', async () => {
      const user = userEvent.setup()

      const { onChange, props } = setup()
      const { picker } = props

      const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
      const closeCalendarSpy = jest.spyOn(picker.current, '_closeCalendar')

      const datePickerInput = screen.getByRole('textbox', { name: 'Date Time' })

      expect(datePickerInput).toHaveValue('')
      await act(async () => {
        await user.click(datePickerInput)
        await user.type(datePickerInput, '1967')
      })

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(4)
      expect(closeCalendarSpy).toHaveBeenCalledTimes(4)
      expect(onChange).toHaveBeenCalledTimes(4)
    })
  })

  describe('when Today button gets clicked', () => {
    test('onTodayClick gets triggered', async () => {
      const user = userEvent.setup()

      const { onTodayClick } = setup()

      const buttonToday = screen.getByText('Today')

      await act(async () => {
        await user.click(buttonToday)
      })

      expect(onTodayClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when Clear button gets clicked', () => {
    test('onClearClick gets triggered', async () => {
      const user = userEvent.setup()

      const { onClearClick } = setup()

      const buttonClear = screen.getByText('Clear')

      await act(async () => {
        await user.click(buttonClear)
      })

      expect(onClearClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when loosing focus of input', () => {
    test('onInputBlur gets triggered', async () => {
      const user = userEvent.setup()

      const {
        onInputBlur,
        onChange
      } = setup()

      const datePickerInput = screen.getByRole('textbox', { name: 'Date Time' })

      await user.click(datePickerInput)
      await user.type(datePickerInput, 'abc123')

      await user.click(screen.getByRole('textbox', { name: 'basic-input' }))

      expect(onChange).toHaveBeenCalledTimes(6)
      expect(onInputBlur).toHaveBeenCalledTimes(1)
    })
  })
})
