import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import TemporalDisplay from '../../../components/TemporalDisplay/TemporalDisplay'
import { mapDispatchToProps, mapStateToProps, TemporalDisplayContainer } from '../TemporalDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onRemoveTimelineFilter: jest.fn(),
    temporalSearch: {}
  }

  const enzymeWrapper = shallow(<TemporalDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onRemoveTimelineFilter calls actions.removeTemporalFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeTemporalFilter')

    mapDispatchToProps(dispatch).onRemoveTimelineFilter()

    expect(spy).toBeCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {
          temporal: {}
        }
      }
    }

    const expectedState = {
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('TemporalDisplayContainer component', () => {
  test('with start date should render the temporal info', () => {
    const { enzymeWrapper } = setup()
    const temporal = { startDate: '2019-03-30T00:00:00Z' }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    expect(enzymeWrapper.find(TemporalDisplay).length).toEqual(1)

    expect(enzymeWrapper.find(TemporalDisplay).exists()).toBe(true)
  })

  test('pass onRemoveTimelineFilter as a prop', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(TemporalDisplay).props().onRemoveTimelineFilter)
      .toEqual(props.onRemoveTimelineFilter)
  })

  test('with start date and end date should render the temporal info', () => {
    const { enzymeWrapper } = setup()
    const temporal = {
      endDate: '2019-05-30T00:00:00Z',
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    expect(enzymeWrapper.find(TemporalDisplay).length).toEqual(1)

    expect(enzymeWrapper.find(TemporalDisplay).exists()).toBe(true)
  })
})
