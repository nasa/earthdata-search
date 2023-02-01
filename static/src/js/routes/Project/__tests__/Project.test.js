import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Helmet from 'react-helmet'

import * as AppConfig from '../../../../../../sharedUtils/config'

import Project from '../Project'
import SavedProjectsContainer
  from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'
import ProjectCollectionsContainer
  from '../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

function setup(overrideProps) {
  const props = {
    location: {},
    name: 'Test Project',
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn(),
    portal: {},
    projectCollectionsRequiringChunking: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Project.WrappedComponent {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Project component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('sets the correct Helmet meta information', () => {
    const { enzymeWrapper } = setup()

    const helmet = enzymeWrapper.find(Helmet)

    expect(helmet.childAt(0).type()).toEqual('title')
    expect(helmet.childAt(0).text()).toEqual('Test Project')
    expect(helmet.childAt(1).props().name).toEqual('title')
    expect(helmet.childAt(1).props().content).toEqual('Test Project')
    expect(helmet.childAt(2).props().name).toEqual('robots')
    expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
    expect(helmet.childAt(3).props().rel).toEqual('canonical')
    expect(helmet.childAt(3).props().href).toEqual('https://search.earthdata.nasa.gov')
  })

  describe('handleSubmit', () => {
    test('calls onSubmitRetrieval', () => {
      const { enzymeWrapper, props } = setup()

      const form = enzymeWrapper.find('form')

      form.simulate('submit', { preventDefault: jest.fn() })
      expect(props.onSubmitRetrieval.mock.calls.length).toBe(1)
    })

    test('calls onToggleChunkedOrderModal when any collections require chunking', () => {
      const { enzymeWrapper, props } = setup({
        projectCollectionsRequiringChunking: {
          collectionId: {}
        }
      })

      const form = enzymeWrapper.find('form')

      form.simulate('submit', { preventDefault: jest.fn() })
      expect(props.onToggleChunkedOrderModal.mock.calls.length).toBe(1)
    })
  })

  describe('Saved projects page', () => {
    test('displays the SavedProjectsContainer', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: ''
        }
      })

      expect(enzymeWrapper.find(SavedProjectsContainer).length).toBe(1)
    })
  })

  describe('Projects page', () => {
    test('displays the ProjectCollectionsContainer', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: '?p=!C123456-EDSC'
        }
      })

      expect(enzymeWrapper.find(ProjectCollectionsContainer).length).toBe(1)
    })
  })
})
