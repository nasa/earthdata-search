import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, TimelineContainer } from '../TimelineContainer'
import Timeline from '../../../components/Timeline/Timeline'
import * as metricsTimeline from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collectionsMetadata: {
      projectCollectionId: {
        title: 'project'
      },
      focusedCollectionId: {
        title: 'focused'
      }
    },
    projectCollectionsIds: ['projectCollectionId'],
    focusedCollectionId: 'focusedCollectionId',
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onMetricsTimeline: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onToggleTimeline: jest.fn(),
    pathname: '/search',
    temporalSearch: {},
    timeline: {
      query: {},
      state: {}
    },
    isOpen: true,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelineContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeTimelineQuery calls actions.changeTimelineQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeTimelineQuery')

    mapDispatchToProps(dispatch).onChangeTimelineQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleOverrideTemporalModal calls actions.toggleOverrideTemporalModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleOverrideTemporalModal')

    mapDispatchToProps(dispatch).onToggleOverrideTemporalModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onMetricsTimeline calls metricsTimeline', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsTimeline, 'metricsTimeline')

    mapDispatchToProps(dispatch).onMetricsTimeline(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onToggleTimeline calls actions.toggleTimeline', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTimeline')

    mapDispatchToProps(dispatch).onToggleTimeline(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      browser: {},
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {}
        }
      },
      router: {
        location: {
          pathname: ''
        }
      },
      timeline: {},
      ui: {
        timeline: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      browser: {},
      collectionsMetadata: {},
      focusedCollectionId: 'collectionId',
      pathname: '',
      projectCollectionsIds: [],
      temporalSearch: {},
      timeline: {},
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('TimelineContainer component', () => {
  test('does not render a timeline if no timeline should be rendered', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Timeline).length).toBe(0)
  })

  test('passes its props and renders a single Timeline component on the search page', () => {
    const { enzymeWrapper } = setup({
      pathname: '/search/granules'
    })
    expect(enzymeWrapper.find(Timeline).at(1))
    expect(enzymeWrapper.props().collectionMetadata).toEqual({
      focusedCollectionId: {
        title: 'focused'
      }
    })
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    const { enzymeWrapper } = setup({
      pathname: '/projects'
    })

    expect(enzymeWrapper.find(Timeline).at(1))
    expect(enzymeWrapper.props().collectionMetadata).toEqual({
      projectCollectionId: {
        title: 'project'
      }
    })
  })
})
