import React from 'react'

import {
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as AppConfig from '../../../../../../sharedUtils/config'
import { Project } from '../Project'

import MapContainer from '../../../containers/MapContainer/MapContainer'
import OverrideTemporalModalContainer from '../../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
import SavedProjectsContainer from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'
import SidebarContainer from '../../../containers/SidebarContainer/SidebarContainer'
import Spinner from '../../../components/Spinner/Spinner'

jest.mock('../../../containers/MapContainer/MapContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/SavedProjectsContainer/SavedProjectsContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/SidebarContainer/SidebarContainer', () => jest.fn(() => <div />))
jest.mock('../../../components/Spinner/Spinner', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}))

const mockClassListAdd = jest.fn()
const mockClassListRemove = jest.fn()

jest.spyOn(document, 'querySelector').mockImplementation(() => ({
  classList: {
    add: mockClassListAdd,
    remove: mockClassListRemove
  }
}))

const setup = setupTest({
  Component: Project,
  defaultProps: {
    name: 'Test Project',
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn(),
    portal: {},
    projectCollectionsRequiringChunking: {}
  }
})

beforeEach(() => {
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'http://localhost:3000'
  }))
})

describe('Project component', () => {
  describe('Saved projects page', () => {
    test('displays the SavedProjectsContainer', async () => {
      setup()

      expect(SavedProjectsContainer).toHaveBeenCalledTimes(1)

      expect(OverrideTemporalModalContainer).toHaveBeenCalledTimes(0)
      expect(SidebarContainer).toHaveBeenCalledTimes(0)
      expect(MapContainer).toHaveBeenCalledTimes(0)
    })
  })

  describe('Projects page', () => {
    test('displays the ProjectCollectionsContainer', async () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              search: '?p=!C123456-EDSC'
            }
          }
        }
      })

      // Ensure that the map is being lazy loaded; spinner during load
      expect(Spinner).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(document.title).toEqual('Test Project')
      })

      expect(SavedProjectsContainer).toHaveBeenCalledTimes(0)

      expect(OverrideTemporalModalContainer).toHaveBeenCalledTimes(1)
      expect(SidebarContainer).toHaveBeenCalledTimes(1)
      expect(MapContainer).toHaveBeenCalledTimes(1)
    })
  })

  describe('handleSubmit', () => {
    test('calls onSubmitRetrieval', () => {
      const { props } = setup({
        overrideZustandState: {
          location: {
            location: {
              search: '?p=!C123456-EDSC'
            }
          }
        }
      })

      // TODO RTL Does not seem to be able to find by form without the `name` prop on the form element
      // https://github.com/testing-library/dom-testing-library/issues/937
      const formSubmit = screen.getByRole('form')

      // TODO: `UserEvent` does not have submit func and `click` not recognized as submit
      fireEvent.submit(formSubmit)
      formSubmit.focus()

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(1)
      expect(props.onSubmitRetrieval).toHaveBeenCalledWith()
    })

    test('calls onToggleChunkedOrderModal when any collections require chunking', async () => {
      const { props } = setup({
        overrideProps: {
          projectCollectionsRequiringChunking: {
            collectionId: {}
          }
        },
        overrideZustandState: {
          location: {
            location: {
              search: '?p=!C123456-EDSC'
            }
          }
        }
      })

      // TODO RTL Does not seem to be able to find by form without the `name` prop on the form element
      // https://github.com/testing-library/dom-testing-library/issues/937
      const formSubmit = screen.getByRole('form')

      // TODO: `UserEvent` does not have submit func and `click` not recognized as submit
      fireEvent.submit(formSubmit)

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(true)

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(0)
    })
  })

  // RTL Lazy loading issue with mocks between https://github.com/testing-library/react-testing-library/issues/716
  describe('render self', () => {
    test('should render self', async () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              pathname: '/project',
              search: '?p=!C123456-EDSC'
            }
          }
        }
      })

      let helmet
      await waitFor(() => {
        helmet = Helmet.peek()
      })

      expect(helmet.title).toBe('Test Project')
      expect(helmet.metaTags.find((tag) => tag.name === 'title').content).toBe('Test Project')
      expect(helmet.metaTags.find((tag) => tag.name === 'robots').content).toBe('noindex, nofollow')
      expect(helmet.linkTags.find((tag) => tag.rel === 'canonical').href).toContain('https://search.earthdata.nasa.gov')
    })
  })

  describe('when mounting the component', () => {
    test('adds the root__app--fixed-footer class to the root', () => {
      setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      expect(mockClassListRemove).toHaveBeenCalledTimes(0)
    })
  })

  describe('when unmounting the component', () => {
    test('removes the root__app--fixed-footer class to the root', () => {
      const { unmount } = setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      unmount()

      expect(mockClassListRemove).toHaveBeenCalledTimes(1)
      expect(mockClassListRemove).toHaveBeenCalledWith('root__app--fixed-footer')
    })
  })
})
