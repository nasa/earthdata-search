import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import OverrideTemporalModal from '../OverrideTemporalModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    temporalSearch: {
      endDate: '2019-06-17T23:59:59.999Z',
      startDate: '2015-07-01T06:14:00.000Z'
    },
    timeline: {
      query: {
        end: 1548979199999,
        start: 1546300800000
      }
    },
    onChangeQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  }

  const enzymeWrapper = shallow(<OverrideTemporalModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OverrideTemporalModal component', () => {
  describe('when the temporal search is selected', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onTemporalClick()
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
    })
  })

  describe('when the focused date is selected', () => {
    test('the callback fires correctly', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onFocusedClick()
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
    })
  })
})
