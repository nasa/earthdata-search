import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as config from '../../../../../../sharedUtils/config'

import { FooterContainer } from '../FooterContainer'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    loadTime: 2.2,
    location: {
      pathname: '/search'
    }
  }

  const enzymeWrapper = shallow(<FooterContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FooterContainer component', () => {
  test('displays version', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => {
      return {
        env: 'prod',
        version: '2.0.0'
      }
    })

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__ver-pill').length).toEqual(1)
    expect(enzymeWrapper.find('.footer__ver-pill').text()).toEqual('v2.0.0')
  })

  describe('when in the prod environment', () => {
    test('does not display the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => {
        return {
          env: 'prod',
          version: '2.0.0'
        }
      })

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(0)
    })
  })

  describe('when in a test environment', () => {
    test('displays the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => {
        return {
          env: 'UAT',
          version: '2.0.0'
        }
      })

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(1)
      expect(enzymeWrapper.find('.footer__env').text()).toEqual('UAT')
    })
  })
})
