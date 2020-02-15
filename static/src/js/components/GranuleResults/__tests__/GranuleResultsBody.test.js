import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SimpleBar from 'simplebar-react'

import GranuleResultsBody from '../GranuleResultsBody'
import GranuleResultsList from '../GranuleResultsList'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

const mockSimpleBarWrapper = (() => {
  const el = document.createElement('div')
  el.classList.add('simplebar-content-wrapper')
  return el
})()

const mockRefElement = (() => {
  const el = document.createElement('div')
  el.classList.add('granule-results-body')
  el.appendChild(mockSimpleBarWrapper)
  return el
})()

jest.spyOn(GranuleResultsBody.prototype, 'getRef').mockImplementation(function mockRef() {
  this.wrapper = {
    current: mockRefElement
  }
})

function setup(options = {
  mount: false
}) {
  const props = {
    collectionId: 'collectionId',
    excludedGranuleIds: [],
    focusedGranule: '',
    granules: {
      one: 'test',
      two: 'test'
    },
    isCwic: false,
    pageNum: 1,
    location: { search: 'value' },
    waypointEnter: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn()
  }

  let enzymeWrapper

  if (options.mount) {
    enzymeWrapper = mount(<GranuleResultsBody {...props} />)
  } else {
    enzymeWrapper = shallow(<GranuleResultsBody {...props} />)
  }

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-body')
  })

  test('renders the SimpleBar correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.children().at(0).type()).toBe(SimpleBar)
    expect(enzymeWrapper.children().at(0).prop('className')).toBe('granule-results-body__scroll-container')
  })

  test('passes the granules to a single GranuleResultsList component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsList).length).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsList).props().granules).toEqual({
      one: 'test',
      two: 'test'
    })
    expect(enzymeWrapper.find(GranuleResultsList).props().pageNum).toEqual(1)
    expect(typeof enzymeWrapper.find(GranuleResultsList).props().waypointEnter).toEqual('function')
  })

  test('passes the onMetricsDataAccess callback to the GranuleResultsList component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(GranuleResultsList).length).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsList).props().onMetricsDataAccess)
      .toEqual(props.onMetricsDataAccess)
  })

  test('should create a ref', () => {
    setup({
      mount: true
    })

    expect(GranuleResultsBody.prototype.getRef).toHaveBeenCalledTimes(1)
  })
})
