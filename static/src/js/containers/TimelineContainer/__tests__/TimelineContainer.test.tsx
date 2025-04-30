import React from 'react'
import { render } from '@testing-library/react'

// @ts-expect-error The file does not have types
import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  TimelineContainer
} from '../TimelineContainer'

// @ts-expect-error The file does not have types
import Timeline from '../../../components/Timeline/Timeline'

// @ts-expect-error The file does not have types
import * as metricsTimeline from '../../../middleware/metrics/actions'

jest.mock('../../../components/Timeline/Timeline', () => jest.fn(() => <div />))

const setup = (overrideProps = {}) => {
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
    onMetricsTimeline: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onToggleTimeline: jest.fn(),
    pathname: '/search',
    temporalSearch: {},
    isOpen: true,
    search: '?p=C123456-EDSC',
    ...overrideProps
  }

  render(<TimelineContainer {...props} />)

  return {
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onToggleOverrideTemporalModal calls actions.toggleOverrideTemporalModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleOverrideTemporalModal')

    mapDispatchToProps(dispatch).onToggleOverrideTemporalModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  test('onMetricsTimeline calls metricsTimeline', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsTimeline, 'metricsTimeline')

    mapDispatchToProps(dispatch).onMetricsTimeline('mock-type')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mock-type')
  })

  test('onToggleTimeline calls actions.toggleTimeline', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTimeline')

    mapDispatchToProps(dispatch).onToggleTimeline(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
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
      ui: {
        timeline: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      collectionsMetadata: {},
      focusedCollectionId: 'collectionId',
      pathname: '',
      projectCollectionsIds: [],
      temporalSearch: {},
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('TimelineContainer component', () => {
  test('does not render a timeline if no timeline should be rendered', () => {
    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })

  test('passes its props and renders a single Timeline component on the search page', () => {
    setup({
      pathname: '/search/granules'
    })

    expect(Timeline).toHaveBeenCalledTimes(1)
    expect(Timeline).toHaveBeenCalledWith(
      expect.objectContaining({
        collectionMetadata: {
          focusedCollectionId: {
            title: 'focused'
          }
        },
        isOpen: true,
        onChangeQuery: expect.any(Function),
        onMetricsTimeline: expect.any(Function),
        onToggleOverrideTemporalModal: expect.any(Function),
        onToggleTimeline: expect.any(Function),
        pathname: '/search/granules',
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: false,
        temporalSearch: {}
      }),
      {}
    )
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    setup({
      pathname: '/projects'
    })

    expect(Timeline).toHaveBeenCalledTimes(1)
    expect(Timeline).toHaveBeenCalledWith(
      expect.objectContaining({
        collectionMetadata: {
          projectCollectionId: {
            title: 'project'
          }
        },
        isOpen: true,
        onChangeQuery: expect.any(Function),
        onMetricsTimeline: expect.any(Function),
        onToggleOverrideTemporalModal: expect.any(Function),
        onToggleTimeline: expect.any(Function),
        pathname: '/projects',
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: true,
        temporalSearch: {}
      }),
      {}
    )
  })

  test('Does not show the timeline if it is on the saved projects page', () => {
    setup({
      pathname: '/projects',
      search: ''
    })

    expect(Timeline).toHaveBeenCalledTimes(0)
  })
})
