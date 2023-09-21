import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

import TemporalDisplay from '../TemporalDisplay'
import '@testing-library/jest-dom'

const setup = (overrideProps) => {
  const props = {
    onRemoveTimelineFilter: jest.fn(),
    temporalSearch: {
      endDate: '',
      startDate: '',
      isRecurring: false
    },
    ...overrideProps
  }
  act(() => {
    render(
      <TemporalDisplay {...props} />
    )
  })
}

describe('TemporalDisplay component', () => {
  test('with no props should render self without display', () => {
    setup()

    expect(screen.queryByRole('heading', { name: /temporal/i })).not.toBeInTheDocument()
  })

  test('with only a start date should render the start date', () => {
    const overrideProps = {
      temporalSearch: {
        endDate: '',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    }
    setup(overrideProps)

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.queryByText(/stop:/i)).not.toBeInTheDocument()
  })

  test('with only a end date should render the end date', () => {
    const overrideProps = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '',
        isRecurring: false
      }
    }
    setup(overrideProps)

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.queryByText(/start:/i)).not.toBeInTheDocument()
  })

  test('with start date, end date, and isRecurring should render all', () => {
    const overrideProps = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: true
      }
    }
    setup(overrideProps)

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/05-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/range:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019 - 2019/i)).toBeInTheDocument()
  })

  test('with the same props should not rerender', () => {
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
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-30 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-30 00:00:00/i)).toBeInTheDocument()

    rerender(<TemporalDisplay {...props} />)

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
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

    expect(screen.getByRole('heading', { name: /temporal/i })).toBeInTheDocument()
    expect(screen.getByTitle('Temporal')).toHaveTextContent('Temporal')
    expect(screen.getByText(/start:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-03-29 00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/stop:/i)).toBeInTheDocument()
    expect(screen.getByText(/2019-05-29 00:00:00/i)).toBeInTheDocument()
  })

  test('clicking remove calls onTimelineRemove', async () => {
    const overrideProps = {
      onRemoveTimelineFilter: jest.fn(),
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z',
        isRecurring: false
      }
    }
    setup(overrideProps)
    const user = userEvent.setup()
    const remove = screen.getByRole('button', { name: /remove temporal filter/i })
    await user.click(remove)

    expect(overrideProps.onRemoveTimelineFilter).toBeCalledTimes(1)
  })
})
