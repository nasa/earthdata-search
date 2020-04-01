import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TimelineContainer } from '../TimelineContainer'
import Timeline from '../../../components/Timeline/Timeline'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    browser: {
      name: 'browser name'
    },
    collections: {
      allIds: [],
      byId: {}
    },
    focusedCollection: '',
    pathname: '/search',
    project: {},
    temporalSearch: {},
    timeline: { query: {}, state: {} },
    onChangeProjectQuery: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onMetricsTimeline: jest.fn()
  }

  const enzymeWrapper = shallow(<TimelineContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineContainer component', () => {
  test('does not render a timeline if no timeline should be rendered', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Timeline).length).toBe(0)
  })

  test('passes its props and renders a single Timeline component on the search page', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.setProps({
      browser: {
        name: 'browser name'
      },
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            metadata: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      pathname: '/search/granules'
    })

    expect(enzymeWrapper.find(Timeline).length).toBe(1)
    expect(enzymeWrapper.find(Timeline).props()).toEqual({
      ...props,
      focusedCollection: undefined,
      onChangeProjectQuery: undefined,
      collections: undefined,
      pathname: '/search/granules',
      project: undefined,
      collectionMetadata: {
        collectionId: {
          metadata: {
            mock: 'data'
          }
        }
      },
      showOverrideModal: false
    })
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.setProps({
      browser: {
        name: 'browser name'
      },
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      focusedCollection: 'collectionId',
      pathname: '/projects',
      project: {
        collectionIds: ['collectionId']
      }
    })

    expect(enzymeWrapper.find(Timeline).length).toBe(1)
    expect(enzymeWrapper.find(Timeline).props()).toEqual({
      ...props,
      focusedCollection: undefined,
      onChangeProjectQuery: undefined,
      onChangeQuery: props.onChangeProjectQuery,
      collections: undefined,
      pathname: '/projects',
      project: undefined,
      collectionMetadata: {
        collectionId: {
          mock: 'data'
        }
      },
      showOverrideModal: true
    })
  })
})
