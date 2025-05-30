import { screen } from '@testing-library/react'

import OverrideTemporalModal from '../OverrideTemporalModal'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: OverrideTemporalModal,
  defaultProps: {
    isOpen: true,
    temporalSearch: {
      endDate: '2019-06-17T23:59:59.999Z',
      startDate: '2015-07-01T06:14:00.000Z'
    },
    onChangeQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  },
  defaultZustandState: {
    timeline: {
      query: {
        end: 1548979199999,
        start: 1546300800000
      }
    }
  }
})

describe('OverrideTemporalModal component', () => {
  describe('when the temporal search is selected', () => {
    test('the callback fires correctly', async () => {
      const { props, user } = setup()

      const button = await screen.findByLabelText('Use Temporal Constraint')
      await user.click(button)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          overrideTemporal: {
            endDate: '2019-06-17T23:59:59.999Z',
            startDate: '2015-07-01T06:14:00.000Z'
          }
        }
      })

      expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledWith(false)
    })
  })

  describe('when the focused date is selected', () => {
    test('the callback fires correctly', async () => {
      const { props, user } = setup()

      const button = await screen.findByLabelText('Use Focused Time Span')
      await user.click(button)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          overrideTemporal: {
            endDate: '2019-01-31T23:59:59.999Z',
            startDate: '2019-01-01T00:00:00.000Z'
          }
        }
      })

      expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledWith(false)
    })
  })
})
