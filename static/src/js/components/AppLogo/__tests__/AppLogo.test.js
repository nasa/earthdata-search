import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AppLogo from '../AppLogo'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    edscEnv: 'sit',
    portal: {
      portalId: 'edsc'
    },
    ...overrideProps
  }
  const enzymeWrapper = shallow(<AppLogo {...props} />)

  return {
    enzymeWrapper,
    props
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

    expect(enzymeWrapper.find('.app-logo__site-meatball').props().href).toEqual('/')
  })

  test('renders the site title', () => {
    const { enzymeWrapper } = setup({
      edscEnv: 'prod'
    })

    expect(enzymeWrapper.find('h1').text()).toEqual('Earthdata Search')
  })

  describe('when in production', () => {
    test('should hide the environment badge', () => {
      const { enzymeWrapper } = setup({
        edscEnv: 'prod'
      })

      expect(enzymeWrapper.find('.app-logo__site-env').length).toEqual(0)
    })
  })
})
