import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AppLogo from '../AppLogo'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const enzymeWrapper = shallow(<AppLogo />)

  return {
    enzymeWrapper
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('AppLogo component', () => {
  test('should render the site AppLogo', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc'
    }))
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.app-logo__site-meatball').props().to).toEqual({ pathname: '/search' })
  })

  test('renders the site title', () => {
    const { enzymeWrapper } = setup({
      edscEnv: 'prod'
    })

    expect(enzymeWrapper.find('.app-logo__site-name-ent--e').text()).toEqual('Earthdata')
    expect(enzymeWrapper.find('.app-logo__site-name-ent--s').text()).toEqual('Search')
  })
})
