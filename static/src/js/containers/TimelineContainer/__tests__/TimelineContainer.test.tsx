import { useLocation } from 'react-router-dom'
import type { Mock } from 'vitest'

import TimelineContainer from '../TimelineContainer'

// @ts-expect-error The file does not have types
import Timeline from '../../../components/Timeline/Timeline'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import { routes } from '../../../constants/routes'

vi.mock('../../../components/Timeline/Timeline', () => ({ default: vi.fn(() => null) }))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn().mockReturnValue({
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
    isOpen: true
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

describe('TimelineContainer component', () => {
  test('does not render a timeline if no timeline should be rendered', () => {
    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })

  test('passes its props and renders a single Timeline component on the search page', () => {
    (useLocation as Mock).mockReturnValue({
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
        onToggleTimeline: expect.any(Function),
        pathname: routes.GRANULES,
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: false
      },
      {}
    )
  })

  test('passes its props and renders a single Timeline component on the project page', () => {
    (useLocation as Mock).mockReturnValue({
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
        onToggleTimeline: expect.any(Function),
        pathname: routes.PROJECT,
        projectCollectionsIds: ['projectCollectionId'],
        showOverrideModal: true
      },
      {}
    )
  })

  test('Does not show the timeline if it is on the saved projects page', () => {
    (useLocation as Mock).mockReturnValue({
      pathname: routes.PROJECTS,
      search: ''
    })

    setup()

    expect(Timeline).toHaveBeenCalledTimes(0)
  })
})
