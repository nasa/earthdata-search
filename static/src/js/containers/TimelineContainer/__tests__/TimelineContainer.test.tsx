import React from 'react'
import { useLocation } from 'react-router-dom'

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
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/Timeline/Timeline', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search',
    search: '?p=C123456-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: TimelineContainer,
  defaultProps: {
    isOpen: true,
    onMetricsTimeline: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onToggleTimeline: jest.fn()
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: {
          title: 'focused'
        },
        projectCollectionId: {
          title: 'project'
        }
      }
    },
    project: {
      collections: {
        allIds: ['projectCollectionId']
      }
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
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
      ui: {
        timeline: {
          isOpen: false
        }
      }
    }

    const expectedState = {
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
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/search/granules'
    })

    setup()

    expect(Timeline).toHaveBeenCalledTimes(1)
    expect(Timeline).toHaveBeenCalledWith(
      {
        collectionMetadata: {
          collectionId: {
            title: 'focused'
          }
        },
        isOpen: true,
        onMetricsTimeline: expect.any(Function),
        onToggleOverrideTemporalModal: expect.any(Function),
        onToggleTimeline: expect.any(Function),
        pathname: '/search/granules',
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: false
      },
      {}
    )
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/projects',
      search: '?p=projectCollectionId'
    })

    setup()

    expect(Timeline).toHaveBeenCalledTimes(1)
    expect(Timeline).toHaveBeenCalledWith(
      {
        collectionMetadata: {
          projectCollectionId: {
            title: 'project'
          }
        },
        isOpen: true,
        onMetricsTimeline: expect.any(Function),
        onToggleOverrideTemporalModal: expect.any(Function),
        onToggleTimeline: expect.any(Function),
        pathname: '/projects',
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: true
      },
      {}
    )
  })

  test('Does not show the timeline if it is on the saved projects page', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/projects',
      search: ''
    })

    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })
})
