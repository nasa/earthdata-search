import React from 'react'

import { screen, waitFor } from '@testing-library/react'
<<<<<<< HEAD
// @ts-expect-error This file does not have types
=======
>>>>>>> 555489ed1 (EDSC-4536: Separate the project and saved projects routes)
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

<<<<<<< HEAD
import { mapDispatchToProps, Project } from '../Project'

// @ts-expect-error This file does not have types
import actions from '../../../actions'
=======
import { Project } from '../Project'
>>>>>>> 555489ed1 (EDSC-4536: Separate the project and saved projects routes)

import MapContainer from '../../../containers/MapContainer/MapContainer'
import OverrideTemporalModalContainer from '../../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
// @ts-expect-error This file does not have types
import SidebarContainer from '../../../containers/SidebarContainer/SidebarContainer'
import Spinner from '../../../components/Spinner/Spinner'

jest.mock('../../../containers/MapContainer/MapContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/SavedProjectsContainer/SavedProjectsContainer', () => jest.fn(() => <div />))
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

const setup = setupTest({
  Component: Project,
  defaultProps: {
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn()
  },
  defaultZustandState: {
    savedProject: {
      project: {
        name: 'Test Project'
      }
    }
  }
})

<<<<<<< HEAD
describe('mapDispatchToProps', () => {
  test('onSubmitRetrieval calls actions.submitRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'submitRetrieval')

    mapDispatchToProps(dispatch).onSubmitRetrieval()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  test('onToggleChunkedOrderModal calls actions.toggleChunkedOrderModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleChunkedOrderModal')

    mapDispatchToProps(dispatch).onToggleChunkedOrderModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })
})

=======
>>>>>>> 555489ed1 (EDSC-4536: Separate the project and saved projects routes)
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

    expect(OverrideTemporalModalContainer).toHaveBeenCalledTimes(1)
    expect(SidebarContainer).toHaveBeenCalledTimes(1)
    expect(MapContainer).toHaveBeenCalledTimes(1)
  })

  describe('handleSubmit', () => {
    test('calls onSubmitRetrieval', async () => {
      const { props, user } = setup()

      const button = screen.getByRole('button', { name: 'Submit' })
      await user.click(button)

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(1)
      expect(props.onSubmitRetrieval).toHaveBeenCalledWith()
    })

    test('calls onToggleChunkedOrderModal when any collections require chunking', async () => {
      const { props, user } = setup({
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

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(true)

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(0)
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
