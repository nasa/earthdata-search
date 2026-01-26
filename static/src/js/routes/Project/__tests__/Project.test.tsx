import React from 'react'

import { screen, waitFor } from '@testing-library/react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Project from '../Project'

import MapContainer from '../../../containers/MapContainer/MapContainer'
import OverrideTemporalModal from '../../../components/OverrideTemporalModal/OverrideTemporalModal'
// @ts-expect-error This file does not have types
import SidebarContainer from '../../../containers/SidebarContainer/SidebarContainer'
import Spinner from '../../../components/Spinner/Spinner'
import { MODAL_NAMES } from '../../../constants/modalNames'

vi.mock('../../../containers/MapContainer/MapContainer', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../../components/OverrideTemporalModal/OverrideTemporalModal', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../../components/ProjectCollections/ProjectCollections', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../../containers/SidebarContainer/SidebarContainer', () => ({ default: vi.fn(() => <button type="submit">Submit</button>) }))
vi.mock('../../../components/Spinner/Spinner', () => ({ default: vi.fn(() => <div />) }))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/project',
    search: '?p=!C123456-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

vi.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: vi.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'http://localhost:3000'
  }),
  getApplicationConfig: vi.fn().mockReturnValue({
    collectionSearchResultsSortKey: '',
    defaultGranulesPerOrder: 2000
  })
}))

const mockCreateRetrieval = vi.fn()
vi.mock('../../../hooks/useCreateRetrieval', () => ({
  useCreateRetrieval: () => ({ createRetrieval: mockCreateRetrieval })
}))

const setup = setupTest({
  Component: Project,
  defaultZustandState: {
    savedProject: {
      project: {
        name: 'Test Project'
      }
    },
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('Project component', () => {
  test('displays the ProjectCollectionsContainer', async () => {
    setup()

    // Ensure that the map is being lazy loaded; spinner during load
    expect(Spinner).toHaveBeenCalledTimes(1)
    expect(Spinner).toHaveBeenCalledWith({
      className: 'root__spinner spinner spinner--dots spinner--white spinner--small',
      type: 'dots'
    }, {})

    await waitFor(() => {
      expect(document.title).toEqual('Test Project')
    })

    expect(OverrideTemporalModal).toHaveBeenCalledTimes(1)
    expect(SidebarContainer).toHaveBeenCalledTimes(1)
    expect(MapContainer).toHaveBeenCalledTimes(1)
  })

  describe('handleSubmit', () => {
    test('calls createRetrieval', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Submit' })
      await user.click(button)

      expect(mockCreateRetrieval).toHaveBeenCalledTimes(1)
      expect(mockCreateRetrieval).toHaveBeenCalledWith()
    })

    test('calls setOpenModal when any collections require chunking', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['C123456-EDSC'],
              byId: {
                'C123456-EDSC': {
                  granules: {
                    count: 3000
                  },
                  selectedAccessMethod: 'esi0'
                }
              }
            }
          }
        }
      })

      const button = screen.getByRole('button', { name: 'Submit' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.CHUNKED_ORDER)

      expect(mockCreateRetrieval).toHaveBeenCalledTimes(0)
    })
  })

  // RTL Lazy loading issue with mocks between https://github.com/testing-library/react-testing-library/issues/716
  describe('when rendering', () => {
    test('should render helmet data', async () => {
      setup()

      let helmet: {
        title?: string
        metaTags?: Array<{ name: string, content: string }>
        linkTags?: Array<{ rel: string, href: string }>
      } = {}

      await waitFor(() => {
        helmet = Helmet.peek() as typeof helmet
      })

      const {
        title,
        metaTags,
        linkTags
      } = helmet || {}

      expect(title).toBe('Test Project')
      expect(metaTags?.find((tag) => tag.name === 'title')?.content).toBe('Test Project')
      expect(metaTags?.find((tag) => tag.name === 'robots')?.content).toBe('noindex, nofollow')
      expect(linkTags?.find((tag) => tag.rel === 'canonical')?.href).toContain('https://search.earthdata.nasa.gov')
    })
  })
})
