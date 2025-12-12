import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import TemporalDisplay from '../TemporalDisplay'

const setup = setupTest({
  Component: TemporalDisplay,
  defaultZustandState: {
    query: {
      changeQuery: jest.fn()
    }
  }
})

describe('TemporalDisplay component', () => {
  test('with no props should render self without display', () => {
    setup()

    expect(screen.queryByRole('heading', { name: /temporal/i })).not.toBeInTheDocument()
  })

  test('with only a start date should render the start date', () => {
    setup({
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '',
              startDate: '2019-03-30T00:00:00.000Z',
              isRecurring: false
            }
          }
        }
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
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '2019-05-30T00:00:00.000Z',
              startDate: '',
              isRecurring: false
            }
          }
        }
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
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '2019-05-30T00:00:00.000Z',
              startDate: '2019-03-30T00:00:00.000Z',
              isRecurring: true
            }
          }
        }
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

  test('clicking remove calls changeQuery', async () => {
    const { user, zustandState } = setup({
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '2019-05-30T00:00:00.000Z',
              startDate: '2019-03-30T00:00:00.000Z',
              isRecurring: false
            }
          }
        }
      }
    })

    const remove = screen.getByRole('button', { name: /remove temporal filter/i })
    await user.click(remove)

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        temporal: {
          startDate: '',
          endDate: '',
          isRecurring: false
        }
      }
    })
  })
})
