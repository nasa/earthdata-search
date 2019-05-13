import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TimelineContainer } from '../TimelineContainer'
import Timeline from '../../../components/Timeline/Timeline'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: [],
      byId: {}
    },
    focusedCollection: '',
    temporalSearch: {},
    timeline: { query: {}, state: {} },
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onChangeTimelineState: jest.fn()
  }

  const enzymeWrapper = shallow(<TimelineContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineContainer component', () => {
  test('passes its props and renders a single Timeline component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(Timeline).length).toBe(1)
    expect(enzymeWrapper.find(Timeline).props()).toEqual({
      ...props,
      collections: undefined,
      focusedCollection: undefined,
      focusedCollectionMetadata: {}
    })
  })
})
