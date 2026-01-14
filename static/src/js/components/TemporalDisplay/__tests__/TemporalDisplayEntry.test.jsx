import { screen } from '@testing-library/react'
import moment from 'moment'

import setupTest from '../../../../../../jestConfigs/setupTest'

import TemporalDisplayEntry from '../TemporalDisplayEntry'

const setup = setupTest({
  Component: TemporalDisplayEntry
})

describe('TemporalDisplayEntry component', () => {
  test('with valid startDate renders correctly', () => {
    setup({
      overrideProps: {
        startDate: moment('2019-03-30T00:00:00Z').utc()
      }
    })

    expect(screen.getByText('2019-03-30 00:00:00')).toBeInTheDocument()
  })

  test('with valid endDate renders correctly', () => {
    setup({
      overrideProps: {
        startDate: undefined,
        endDate: moment('2019-03-30T00:00:00Z').utc()
      }
    })

    expect(screen.getByText('2019-03-30 00:00:00')).toBeInTheDocument()
  })

  test('with valid startDate and endDate renders endDate when isRecurring is false', () => {
    setup({
      overrideProps: {
        startDate: moment('2017-01-03T00:00:00Z').utc(),
        endDate: moment('2019-03-30T00:00:00Z').utc()
      }
    })

    expect(screen.getByText('2019-03-30 00:00:00')).toBeInTheDocument()
  })

  test('with valid startDate and endDate renders correctly when isRecurring is true', () => {
    setup({
      overrideProps: {
        startDate: moment('2017-01-03T00:00:00Z').utc(),
        endDate: moment('2019-03-30T00:00:00Z').utc(),
        isRecurring: true
      }
    })

    expect(screen.getByText('2017 - 2019')).toBeInTheDocument()
  })
})
