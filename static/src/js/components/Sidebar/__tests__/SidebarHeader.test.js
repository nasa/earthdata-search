import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Header from '../SidebarHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    portal: {
      portalId: ''
    },
    ...overrideProps
  }
  const enzymeWrapper = shallow(<Header {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Header component', () => {
  test('should render the site header', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.header__site-meatball').props().href).toEqual('/')
    expect(enzymeWrapper.find('.header__portal-logo').length).toEqual(0)
    expect(enzymeWrapper.find('.header__site-name').props().href).toEqual('/')
  })

  describe('with portal information', () => {
    test('should render the portal header', () => {
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

      expect(enzymeWrapper.find('.header__site-meatball').props().href).toEqual('/')
      expect(enzymeWrapper.find('.header__portal-logo').props().href).toEqual('http://example.com')
      expect(enzymeWrapper.find('.header__portal-logo').props().id).toEqual('test-logo')
      expect(enzymeWrapper.find('.header__portal-logo').props().title).toEqual('Test Portal Home')
      expect(enzymeWrapper.find('.header__portal-logo img').props().src).toEqual('http://placehold.it/75x50')
      expect(enzymeWrapper.find('.header__portal-logo img').props().alt).toEqual('Test Portal Home')
      expect(enzymeWrapper.find('.header__site-name').props().href).toEqual('/search?portal=simple')
    })
  })
})
