import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineContainer } from '../TimelineContainer'
import Timeline from '../../../components/Timeline/Timeline'

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
    expect(enzymeWrapper.childAt(0).props().collectionMetadata).toEqual({
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
    expect(enzymeWrapper.childAt(0).props().collectionMetadata).toEqual({
      projectCollectionId: {
        title: 'project'
      }
    })
  })
})
