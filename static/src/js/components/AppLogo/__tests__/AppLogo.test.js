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
    expect(enzymeWrapper.find('.app-logo__portal-logo').length).toEqual(0)
    expect(enzymeWrapper.find('.app-logo__site-name').props().href).toEqual('/')
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

  describe('with portal information', () => {
    test('should render the portal AppLogo', () => {
      const { enzymeWrapper } = setup({
        portal: {
          portalId: 'simple',
          hasStyles: false,
          hasScripts: false,
          logo: {
            id: 'test-logo',
            image: 'http://placehold.it/75x50',
            link: 'http://example.com',
            title: 'Test Portal Home'
          },
          query: {
            echoCollectionId: 'C203234523-LAADS'
          },
          title: 'Simple'
        }
      })

      expect(enzymeWrapper.find('.app-logo__site-meatball').props().href).toEqual('/')
      expect(enzymeWrapper.find('.app-logo__portal-logo').props().href).toEqual('http://example.com')
      expect(enzymeWrapper.find('.app-logo__portal-logo').props().id).toEqual('test-logo')
      expect(enzymeWrapper.find('.app-logo__portal-logo').props().title).toEqual('Test Portal Home')
      expect(enzymeWrapper.find('.app-logo__portal-logo img').props().src).toEqual('http://placehold.it/75x50')
      expect(enzymeWrapper.find('.app-logo__portal-logo img').props().alt).toEqual('Test Portal Home')
      expect(enzymeWrapper.find('.app-logo__site-name').props().href).toEqual('/portal/simple/search')
    })
  })
})
