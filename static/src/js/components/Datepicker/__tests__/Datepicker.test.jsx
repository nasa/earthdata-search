import React from 'react'

import {
  act,
  render,
  screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import Datepicker from '../Datepicker'

const setup = (overrideProps) => {
  const user = userEvent.setup()

  const onInputBlur = jest.fn()
  const onChange = jest.fn()
  const onClearClick = jest.fn()
  const onTodayClick = jest.fn()

  const props = {
    filterType: 'collection',
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
  const { rerender } = render(
    <div>
      <input aria-label="basic-input" />
      <Datepicker {...props} />
    </div>
  )

  return {
    props,
    rerender,
    user
  }
}

describe('Datepicker component', () => {
  describe('on render', () => {
    test('creates the custom buttons', () => {
      setup()

      const buttonToday = screen.getByRole('button', { name: 'Today' })
      const buttonClear = screen.getByRole('button', { name: 'Clear' })

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
      const { props, user } = setup()
      const { picker } = props

      const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
      const closeCalendarSpy = jest.spyOn(picker.current, '_closeCalendar')

      const datePickerInput = screen.getByRole('textbox', { name: 'Date Time' })

      expect(datePickerInput).toHaveValue('')

      await act(async () => {
        await user.type(datePickerInput, '1')
      })

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1)
      expect(requestAnimationFrameSpy).toHaveBeenCalledWith(expect.any(Function))

      expect(closeCalendarSpy).toHaveBeenCalledTimes(1)
      expect(closeCalendarSpy).toHaveBeenCalledWith()

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith('1')
    })
  })

  describe('when Today button gets clicked', () => {
    test('onTodayClick gets triggered', async () => {
      const { props, user } = setup()

      const buttonToday = screen.getByRole('button', { name: 'Today' })

      await user.click(buttonToday)

      expect(props.onTodayClick).toHaveBeenCalledTimes(1)
      expect(props.onTodayClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when Clear button gets clicked', () => {
    test('onClearClick gets triggered', async () => {
      const { props, user } = setup()

      const buttonClear = screen.getByRole('button', { name: 'Clear' })

      await act(async () => {
        await user.click(buttonClear)
      })

      expect(props.onClearClick).toHaveBeenCalledTimes(1)
      expect(props.onClearClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('when loosing focus of input', () => {
    test('onInputBlur gets triggered', async () => {
      const { props, user } = setup()

      const datePickerInput = screen.getByRole('textbox', { name: 'Date Time' })

      await user.type(datePickerInput, 'a')
      await datePickerInput.blur()

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith('a')

      expect(props.onInputBlur).toHaveBeenCalledTimes(1)
      expect(props.onInputBlur).toHaveBeenCalledWith(expect.objectContaining({
        _reactName: 'onBlur'
      }))
    })
  })

  describe('when pressing enter in the input', () => {
    test('calls onInputBlur', async () => {
      const { props, user } = setup()

      const input = screen.getByRole('textbox', { name: 'Date Time' })

      await user.type(input, '{Enter}')

      expect(props.onInputBlur).toHaveBeenCalledTimes(1)
      expect(props.onInputBlur).toHaveBeenCalledWith(expect.objectContaining({
        _reactName: 'onKeyDown',
        key: 'Enter'
      }))
    })
  })

  describe('when rerendering the input', () => {
    test('picker navigates as expected', async () => {
      const { props, rerender } = setup()

      const { picker } = props

      const navigateSpy = jest.spyOn(picker.current, 'navigate')

      rerender(
        <div>
          <input aria-label="basic-input" />
          <Datepicker {...props} />
        </div>
      )

      expect(navigateSpy).toHaveBeenCalledTimes(0)

      props.viewMode = 'month'

      rerender(
        <div>
          <input aria-label="basic-input" />
          <Datepicker {...props} />
        </div>
      )

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('month')
    })
  })
})
