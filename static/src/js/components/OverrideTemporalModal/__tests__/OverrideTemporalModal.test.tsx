import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import OverrideTemporalModal from '../OverrideTemporalModal'
import useEdscStore from '../../../zustand/useEdscStore'

const setup = () => {
  const user = userEvent.setup()

  const props = {
    isOpen: true,
    temporalSearch: {
      endDate: '2019-06-17T23:59:59.999Z',
      startDate: '2015-07-01T06:14:00.000Z'
    },
    onChangeQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  }

  const state = useEdscStore.getState()
  useEdscStore.setState({
    timeline: {
      ...state.timeline,
      query: {
        end: 1548979199999,
        start: 1546300800000
      }
    }
  })

  render(<OverrideTemporalModal {...props} />)

  return {
    props,
    user
  }
}

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
