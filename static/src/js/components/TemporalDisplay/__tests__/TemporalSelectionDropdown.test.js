import React from 'react'
import ReactDOM from 'react-dom'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import moment from 'moment'

import TemporalSelectionDropdown from '../TemporalSelectionDropdown'

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
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
  })

  afterEach(() => {
    ReactDOM.createPortal.mockClear()
  })

  test('on load should be closed on inital render', () => {
    setup()

    expect(screen.queryByRole('button')).toBeInTheDocument()
    expect(screen.queryByLabelText('Start')).not.toBeInTheDocument()
  })

  test('when clicked toggles the state of show ', async () => {
    const user = userEvent.setup()
    const { unmount } = setup({})

    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()

    await waitFor(async () => {
      await user.click(btn)
    })

    const startLabel = screen.getByText(/Start/i)

    expect(startLabel).toBeInTheDocument()
    unmount()
  })

  test('sets the start date correctly when an valid date is passed', async () => {
    const user = userEvent.setup()

    const { unmount } = setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button'))
    })

    const inputs = screen.getAllByRole('textbox')

    const startTestObj = moment.utc('2012-01-01 12:00:00', true).format('YYYY-MM-DD HH:mm:ss')

    fireEvent.change(inputs[0], { target: { value: startTestObj } })

    expect(inputs[0].value).toBe(startTestObj)
    expect(inputs[1].value).not.toBe(startTestObj)

    unmount()
  })

  test('sets the end date correctly when an valid date is passed', async () => {
    const user = userEvent.setup()

    const { unmount } = setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button'))
    })

    const inputs = screen.getAllByRole('textbox')

    const endTestObj = moment.utc('2015-01-01 12:00:00', true).format('YYYY-MM-DD HH:mm:ss')

    fireEvent.change(inputs[1], { target: { value: endTestObj } })

    expect(inputs[0].value).not.toBe(endTestObj)
    expect(inputs[1].value).toBe(endTestObj)

    unmount()
  })

  test('sets the state correctly with an invalid start date', async () => {
    const user = userEvent.setup()

    const { unmount } = setup()

    await waitFor(async () => {
      await user.click(screen.getByRole('button'))
    })

    const inputs = screen.getAllByRole('textbox')

    const invalidDate = '2012-01-efss 12:00:00'
    const validStartDate = moment.utc('2012-01-01 12:00:00').format('YYYY-MM-DD HH:mm:ss')
    const validEndDate = moment.utc('2012-01-02 12:00:00')

    try {
      fireEvent.change(inputs[0], { target: { value: invalidDate } })
    } catch (e) {
      console.log(e)
    }

    expect(screen.getByText(/Invalid start date/i)).toBeInTheDocument()

    fireEvent.change(inputs[0], { target: { value: validStartDate } })
    fireEvent.change(inputs[1], { target: { value: validEndDate.toISOString() } })

    expect(inputs[0].value).toBe(validStartDate)
    expect(inputs[1].value).toBe(validEndDate.format('YYYY-MM-DD HH:mm:ss'))
    unmount()
  })

  test('clears the values onClearClick', async () => {
    const onChangeQueryMock = jest.fn()
    const user = userEvent.setup()

    const validEndDate = '2019-03-30T00:00:00.000Z'
    const validStartDate = '2019-03-29T00:00:00.000Z'

    const { getByRole, getAllByRole } = setup({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {
        endDate: validEndDate,
        startDate: validStartDate
      }
    })

    await waitFor(async () => {
      await user.click(getByRole('button'))
    })

    const inputs = getAllByRole('textbox')
    expect(inputs[0].value).toBe(moment.utc(validStartDate).format('YYYY-MM-DD HH:mm:ss'))
    expect(inputs[1].value).toBe(moment.utc(validEndDate).format('YYYY-MM-DD HH:mm:ss'))

    const clearBtn = getAllByRole('button', { name: 'Clear' })[2]
    await waitFor(async () => {
      await user.click(clearBtn)
    })

    await waitFor(async () => {
      await user.click(getByRole('button'))
    })

    const updatedInputs = getAllByRole('textbox')
    expect(updatedInputs[0].value).toBe('')
    expect(updatedInputs[1].value).toBe('')

    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  })

  test('applies the values onApplyClick', async () => {
    const onChangeQueryMock = jest.fn()
    const user = userEvent.setup()

    setup({
      onChangeQuery: onChangeQueryMock
    })

    const validEndDate = '2019-03-30T00:00:00.000Z'
    const validStartDate = '2019-03-29T00:00:00.000Z'

    fireEvent.click(screen.getByRole('button'))

    const inputs = screen.getAllByRole('textbox')

    fireEvent.change(inputs[0], { target: { value: validStartDate } })
    fireEvent.change(inputs[1], { target: { value: validEndDate } })

    expect(inputs[0].value).toBe(moment.utc(validStartDate).format('YYYY-MM-DD HH:mm:ss'))
    expect(inputs[1].value).toBe(moment.utc(validEndDate).format('YYYY-MM-DD HH:mm:ss'))

    const applyBtn = screen.getByRole('button', { name: 'Apply' })

    await waitFor(async () => {
      await user.click(applyBtn)
    })

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: {
          isRecurring: false,
          startDate: validStartDate,
          endDate: validEndDate
        }
      }
    })

    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  })
})
