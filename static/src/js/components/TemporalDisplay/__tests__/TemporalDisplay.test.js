import React from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TemporalDisplay from '../TemporalDisplay'
import '@testing-library/jest-dom'

const setup = (overrideProps) => {
  const user = userEvent.setup()
  const onRemoveTimelineFilter = jest.fn()
  const props = {
    onRemoveTimelineFilter,
    temporalSearch: {
      endDate: '',
      startDate: '',
      isRecurring: false
    },
    ...overrideProps
  }
  render(
    <TemporalDisplay {...props} />
  )

  return {
    onRemoveTimelineFilter,
    user
  }
}

describe('TemporalDisplay component', () => {
  test('with no props should render self without display', () => {
    setup()

    expect(screen.queryByRole('heading', { name: /temporal/i })).not.toBeInTheDocument()
  })

  test('with only a start date should render the start date', () => {
    setup({
      temporalSearch: {
        endDate: '',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    })

    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.queryByText(/stop:/i)).not.toBeInTheDocument()
  })

  test('with only a end date should render the end date', () => {
    setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '',
        isRecurring: false
      }
    })

    expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.queryByText(/start:/i)).not.toBeInTheDocument()
  })

  test('with start date, end date, and isRecurring should render all', async () => {
    setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: true
      }
    })

    expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/05-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/range:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019 - 2019/i)).toBeInTheDocument()
  })

  test('clicking remove calls onTimelineRemove', async () => {
    const { onRemoveTimelineFilter, user } = setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    })
    const remove = screen.getByRole('button', { name: /remove temporal filter/i })

    await act(async () => {
      await user.click(remove)
    })

    expect(onRemoveTimelineFilter).toBeCalledTimes(1)
  })
})

describe('when this memoized component is being re-rendered', () => {
  test('with the same props should not rerender to ensure ', () => {
    const props = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    }

    const { rerender } = render(
      <TemporalDisplay {...props} />
    )
    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-30 00:00:00/i)).toBeInTheDocument()

    rerender(<TemporalDisplay {...props} />)

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-30 00:00:00/i)).toBeInTheDocument()
  })

  test('with new props should rerender', () => {
    const props = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    }

    const { rerender } = render(
      <TemporalDisplay {...props} />
    )

    const newProps = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        isRecurring: false,
        endDate: '2019-05-29T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    }

    rerender(<TemporalDisplay {...newProps} />)

    expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toBeInTheDocument()
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-29 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-29 00:00:00/i)).toBeInTheDocument()
  })
})
