import React from 'react'
import ReactDOM from 'react-dom'
import {
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import moment from 'moment'

import TemporalSelectionDropdown from '../TemporalSelectionDropdown'

beforeAll(() => {
  ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
  window.console.warn = jest.fn()
})

afterEach(() => {
  ReactDOM.createPortal.mockClear()
  window.console.warn.mockClear()
})

const setup = (overrideProps) => {
  const props = {
    temporalSearch: {
      endDate: '',
      startDate: '',
      isRecurring: false
    },
    onChangeQuery: jest.fn(),
    ...overrideProps
  }

  return render(
    <TemporalSelectionDropdown {...props} />
  )
}

describe('TemporalSelectionDropdown component', () => {
  test('on load should be closed on inital render', () => {
    setup()

    expect(screen.queryByRole('button')).toBeInTheDocument()
    expect(screen.queryByLabelText('Start')).not.toBeInTheDocument()
  })

  test('when clicked toggles the state of show ', async () => {
    const user = userEvent.setup()
    setup({})

    const btn = screen.getByRole('button', { name: 'Open temporal filters' })
    expect(btn).toBeInTheDocument()

    await waitFor(async () => {
      await user.click(btn)
    })

    const startLabel = screen.getByText(/Start/i)

    expect(startLabel).toBeInTheDocument()
  })

  test('sets the start date correctly when an valid date is passed', async () => {
    const user = userEvent.setup()

    setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' })

    const startTestObj = '2012-01-01 12:00:00'

    await act(async () => {
      await user.type(startDateInput, startTestObj)
    })

    expect(window.console.warn).toHaveBeenCalledTimes(19)

    expect(startDateInput).toHaveValue(startTestObj)
    expect(endDateInput).not.toHaveValue(startTestObj)
  })

  test('sets the end date correctly when an valid date is passed', async () => {
    const user = userEvent.setup()

    setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' })

    const endTestObj = '2015-01-01 12:00:00'

    await act(async () => {
      await user.type(endDateInput, endTestObj)
    })

    expect(window.console.warn).toHaveBeenCalledTimes(18)

    expect(startDateInput).not.toHaveValue(endTestObj)
    expect(endDateInput).toHaveValue(endTestObj)
  })

  test('sets the state correctly with an invalid start date', async () => {
    const user = userEvent.setup()

    setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' })

    const invalidDate = '2012-01-efss 12:00:00'
    const validStartDate = moment.utc('2012-01-01 12:00:00').format('YYYY-MM-DD HH:mm:ss')
    const validEndDate = moment.utc('2012-01-02 12:00:00').format('YYYY-MM-DD HH:mm:ss')

    await act(async () => {
      await user.type(startDateInput, invalidDate)
    })

    expect(window.console.warn).toHaveBeenCalledTimes(21)

    expect(screen.getByText(/Invalid start date/i)).toBeInTheDocument()

    await act(async () => {
      await user.clear(startDateInput)
      await user.type(startDateInput, validStartDate)
      await user.type(endDateInput, validEndDate)
    })

    expect(startDateInput).toHaveValue(validStartDate)
    expect(endDateInput).toHaveValue(validEndDate)
  })

  test('clears the values onClearClick and converts full utc datetime format to expected format', async () => {
    const onChangeQueryMock = jest.fn()
    const user = userEvent.setup()

    const validStartDate = '2019-03-29T00:00:00.000Z'
    const validEndDate = '2019-03-30T00:00:00.000Z'

    setup({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {
        endDate: validEndDate,
        startDate: validStartDate
      }
    })

    await waitFor(async () => {
      await user.click(screen.getAllByRole('button', { name: 'Open temporal filters' }).at(0))
    })

    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' })

    expect(startDateInput).toHaveValue('2019-03-29 00:00:00')
    expect(endDateInput).toHaveValue('2019-03-30 00:00:00')

    const clearBtn = screen.getAllByRole('button', { name: 'Clear' }).at(2)
    await waitFor(async () => {
      await user.click(clearBtn)
    })

    await waitFor(async () => {
      await user.click(await screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const updatedStartDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const updatedEndtDateInput = screen.getByRole('textbox', { name: 'End Date' })

    expect(updatedStartDateInput).toHaveValue('')
    expect(updatedEndtDateInput).toHaveValue('')

    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  })

  test('applies the values onApplyClick', async () => {
    const onChangeQueryMock = jest.fn()
    const user = userEvent.setup()

    setup({
      onChangeQuery: onChangeQueryMock
    })

    const validStartDate = '2019-03-29 00:00:00'
    const validEndDate = '2019-03-30 00:00:00'

    const expectedStartDate = '2019-03-29T00:00:00.000Z'
    const expectedEndDate = '2019-03-30T23:59:59.999Z'

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' })
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' })

    await act(async () => {
      await user.type(startDateInput, validStartDate)
      await user.type(endDateInput, validEndDate)

      await user.click(startDateInput)
    })

    expect(window.console.warn).toHaveBeenCalledTimes(36)

    expect(startDateInput).toHaveValue(moment.utc(validStartDate).format('YYYY-MM-DD HH:mm:ss'))
    expect(endDateInput).toHaveValue(moment.utc(validEndDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))

    const applyBtn = screen.getByRole('button', { name: 'Apply' })

    await waitFor(async () => {
      await user.click(applyBtn)
    })

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: {
          isRecurring: false,
          startDate: expectedStartDate,
          endDate: expectedEndDate
        }
      }
    })

    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  })

  test('applies the values for leap years onApplyClick', async () => {
    const onChangeQueryMock = jest.fn()
    const user = userEvent.setup()

    setup({
      onChangeQuery: onChangeQueryMock
    })

    const validStartDate = '2021-06-15 00:00:00'
    const validEndDate = '2024-06-15 23:59:59'

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Open temporal filters' }))
    })

    const startField = await screen.findByRole('textbox', { name: 'Start Date' })
    const endField = await screen.findByRole('textbox', { name: 'End Date' })

    // Select the start date
    await user.click(startField)
    await user.click((await screen.findAllByText('2021')).at(0))
    await user.click(await screen.findByText('Jun'))
    await user.click(await screen.findByText('15'))
    expect(startField).toHaveValue(validStartDate)

    // Select the end date
    await user.click(endField)
    await user.click((await screen.findAllByText('2024')).at(0))
    await user.click(await screen.findByText('Jun'))
    await user.click((await screen.findAllByText('15')).at(1))
    expect(endField).toHaveValue(validEndDate)

    // Select Recurring
    await user.click(screen.getByLabelText('Recurring?'))

    const applyBtn = screen.getByRole('button', { name: 'Apply' })
    await user.click(applyBtn)

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: {
          isRecurring: true,
          startDate: '2021-06-15T00:00:00.000Z',
          endDate: '2024-06-15T23:59:59.999Z',
          recurringDayEnd: '166',
          recurringDayStart: '166'
        }
      }
    })

    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  })
})
