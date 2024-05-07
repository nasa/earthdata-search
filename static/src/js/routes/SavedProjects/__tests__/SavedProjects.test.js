import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Helmet from 'react-helmet'

import * as AppConfig from '../../../../../../sharedUtils/config'

import SavedProjects from '../SavedProjects'
import SavedProjectsContainer
  from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))

function setup() {
  const enzymeWrapper = shallow(<SavedProjects.WrappedComponent />)

  return {
    enzymeWrapper
  }
}

describe('SavedProjects component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('sets the correct Helmet meta information', () => {
    const { enzymeWrapper } = setup()

    const helmet = enzymeWrapper.find(Helmet)

    expect(helmet.childAt(1).props().name).toEqual('title')
    expect(helmet.childAt(1).props().content).toEqual('Saved Projects')
    expect(helmet.childAt(2).props().name).toEqual('robots')
    expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
    expect(helmet.childAt(3).props().rel).toEqual('canonical')
  })

  describe('Saved projects page', () => {
    test('displays the SavedProjectsContainer', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(SavedProjectsContainer).length).toBe(1)
    })
  })
})
