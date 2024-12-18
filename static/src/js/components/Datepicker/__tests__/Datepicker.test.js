import React from 'react'

import {
  act,
  render,
  screen,
  waitFor
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

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2)
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

  describe('when handling navigation arrows and month display', () => {
    describe('in years viewMode', () => {
      test('renders initial year range view correctly', async () => {
        const { user } = setup({ viewMode: 'years' })

        // Open the calendar
        const input = screen.getByRole('textbox', { name: 'Date Time' })
        await user.click(input)

        // Verify year range header and navigation
        const yearHeader = screen.getByRole('columnheader', { name: '2020-2029' })
        expect(yearHeader).toBeInTheDocument()

        const prevNav = screen.getByRole('columnheader', { name: '‹' })
        const nextNav = screen.getByRole('columnheader', { name: '›' })
        expect(prevNav).toBeVisible()
        expect(nextNav).toBeVisible()
      })

      test('allows normal navigation between year ranges', async () => {
        const { user } = setup({ viewMode: 'years' })

        // Open the calendar
        const input = screen.getByRole('textbox', { name: 'Date Time' })
        await user.click(input)

        const prevNav = screen.getByRole('columnheader', { name: '‹' })
        await user.click(prevNav)

        const prevDecadeHeader = screen.getByRole('columnheader', { name: '2010-2019' })
        expect(prevDecadeHeader).toBeInTheDocument()

        const nextNav = screen.getByRole('columnheader', { name: '›' })
        await user.click(nextNav)

        const currentDecadeHeader = screen.getByRole('columnheader', { name: '2020-2029' })
        expect(currentDecadeHeader).toBeInTheDocument()
      })
    })

    describe('in months viewMode', () => {
      test('displays month selection without year and handles navigation visibility', async () => {
        const { user } = setup({
          viewMode: 'months',
          value: '06-01 00:00:00',
          format: 'MM-DD HH:mm:ss',
          shouldValidate: false,
          isValidDate: jest.fn().mockReturnValue(true)
        })

        // Open the calendar
        const input = screen.getByRole('textbox', { name: 'Date Time' })
        await user.click(input)

        // Initial month selection view should have year and navigation
        const [prevNav, monthSwitch, nextNav] = screen.getAllByRole('columnheader')
        expect(monthSwitch).toHaveTextContent('2024')
        expect(prevNav).toBeVisible()
        expect(nextNav).toBeVisible()

        // Verify June is selected
        const juneCell = screen.getByRole('cell', { name: 'Jun' })
        expect(juneCell).toHaveClass('rdtMonth', 'rdtActive')

        // Click June to enter days view
        await user.click(juneCell)

        // Get fresh references after entering days view
        const [currentPrevNav, currentMonthSwitch, currentNextNav] = screen
          .getAllByRole('columnheader')
          .filter((header) => header.className.includes('rdtPrev')
            || header.className.includes('rdtSwitch')
            || header.className.includes('rdtNext'))

        // June state in days view
        await waitFor(() => {
          expect(currentMonthSwitch).toHaveTextContent('June')
          expect(currentMonthSwitch).not.toHaveTextContent('2024')
          expect(currentPrevNav).toBeVisible()
          expect(currentNextNav).toBeVisible()
        })

        // Navigate to January using prev nav
        await user.click(currentPrevNav) // May
        await user.click(currentPrevNav) // April
        await user.click(currentPrevNav) // March
        await user.click(currentPrevNav) // February
        await user.click(currentPrevNav) // January

        // January state in days view
        await waitFor(() => {
          expect(currentMonthSwitch).toHaveTextContent('January')
          expect(currentMonthSwitch).not.toHaveTextContent('2024')
          expect(currentPrevNav).not.toBeVisible() // Hidden in January
          expect(currentNextNav).toBeVisible()
        })

        // Navigate from February to December
        await user.click(currentNextNav) // February
        await user.click(currentNextNav) // March
        await user.click(currentNextNav) // April
        await user.click(currentNextNav) // May
        await user.click(currentNextNav) // June
        await user.click(currentNextNav) // July
        await user.click(currentNextNav) // August
        await user.click(currentNextNav) // September
        await user.click(currentNextNav) // October
        await user.click(currentNextNav) // November
        await user.click(currentNextNav) // December

        // December state in days view
        await waitFor(() => {
          expect(currentMonthSwitch).toHaveTextContent('December')
          expect(currentMonthSwitch).not.toHaveTextContent('2024')
          expect(currentPrevNav).toBeVisible()
          expect(currentNextNav).not.toBeVisible() // Hidden in December
        })
      })
    })
  })
})
