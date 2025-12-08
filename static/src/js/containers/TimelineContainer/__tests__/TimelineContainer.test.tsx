import React from 'react'
import { useLocation } from 'react-router-dom'

import { mapDispatchToProps, TimelineContainer } from '../TimelineContainer'

// @ts-expect-error The file does not have types
import Timeline from '../../../components/Timeline/Timeline'

// @ts-expect-error The file does not have types
import * as metricsTimeline from '../../../middleware/metrics/actions'
import setupTest from '../../../../../../jestConfigs/setupTest'
import { routes } from '../../../constants/routes'

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
  test('onMetricsTimeline calls metricsTimeline', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsTimeline, 'metricsTimeline')

    mapDispatchToProps(dispatch).onMetricsTimeline('mock-type')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mock-type')
  })
})

describe('TimelineContainer component', () => {
  test('does not render a timeline if no timeline should be rendered', () => {
    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })

  test('passes its props and renders a single Timeline component on the search page', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: routes.GRANULES
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
        onToggleTimeline: expect.any(Function),
        pathname: routes.GRANULES,
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: false
      },
      {}
    )
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: routes.PROJECT,
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
        onToggleTimeline: expect.any(Function),
        pathname: routes.PROJECT,
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: true
      },
      {}
    )
  })

  test('Does not show the timeline if it is on the saved projects page', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: routes.PROJECTS,
      search: ''
    })

    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })
})
