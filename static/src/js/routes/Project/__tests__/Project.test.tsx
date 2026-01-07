import React from 'react'

import { screen, waitFor } from '@testing-library/react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Project from '../Project'

import MapContainer from '../../../containers/MapContainer/MapContainer'
import OverrideTemporalModal from '../../../components/OverrideTemporalModal/OverrideTemporalModal'
// @ts-expect-error This file does not have types
import SidebarContainer from '../../../containers/SidebarContainer/SidebarContainer'
import Spinner from '../../../components/Spinner/Spinner'
import { MODAL_NAMES } from '../../../constants/modalNames'

jest.mock('../../../containers/MapContainer/MapContainer', () => jest.fn(() => <div />))
jest.mock('../../../components/OverrideTemporalModal/OverrideTemporalModal', () => jest.fn(() => <div />))
jest.mock('../../../components/ProjectCollections/ProjectCollections', () => jest.fn(() => <div />))
jest.mock('../../../containers/SidebarContainer/SidebarContainer', () => jest.fn(() => <button type="submit">Submit</button>))
jest.mock('../../../components/Spinner/Spinner', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/project',
    search: '?p=!C123456-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

jest.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'http://localhost:3000'
  }),
  getApplicationConfig: jest.fn().mockReturnValue({
    collectionSearchResultsSortKey: '',
    defaultGranulesPerOrder: 2000
  })
}))

const mockCreateRetrieval = jest.fn()
jest.mock('../../../hooks/useCreateRetrieval', () => ({
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
        setOpenModal: jest.fn()
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
