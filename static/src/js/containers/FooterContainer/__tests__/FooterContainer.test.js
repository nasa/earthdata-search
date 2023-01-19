import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import * as config from '../../../../../../sharedUtils/config'

import { mapStateToProps, FooterContainer } from '../FooterContainer'
import { FooterLink } from '../../../components/FooterLink/FooterLink'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    earthdataEnvironment: 'prod',
    loadTime: 2.2,
    location: {
      pathname: '/search'
    },
    portal: {
      footer: {
        attributionText: 'Mock text',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://primary.example.com',
          title: 'Primary Example'
        }],
        secondaryLinks: [{
          href: 'http://secondary.example.com',
          title: 'Secondary Example'
        }]
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<FooterContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      searchResults: {
        collections: {
          loadTime: ''
        }
      },
      portal: {}
    }

    const expectedState = {
      loadTime: '',
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FooterContainer component', () => {
  test('displays version', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__ver-pill').length).toEqual(1)
    expect(enzymeWrapper.find('.footer__ver-pill').text()).toEqual('v2.0.0')
  })

  test('does not display version if portal has it disabled', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    const { enzymeWrapper } = setup({
      portal: {
        footer: {
          displayVersion: false
        }
      }
    })

    expect(enzymeWrapper.find('.footer__ver-pill').length).toEqual(1)
    expect(enzymeWrapper.find('.footer__ver-pill').text()).toEqual('')
  })

  test('displays attribution text', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__info-bit').at(1).text()).toEqual('Mock text')
  })

  test('displays primary links', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(FooterLink).first().props().href).toEqual('http://primary.example.com')
    expect(enzymeWrapper.find(FooterLink).first().props().title).toEqual('Primary Example')
  })

  test('displays secondary links', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(FooterLink).last().props().href).toEqual('http://secondary.example.com')
    expect(enzymeWrapper.find(FooterLink).last().props().title).toEqual('Secondary Example')
    expect(enzymeWrapper.find(FooterLink).last().props().secondary).toBeTruthy()
  })

  describe('when in the prod environment', () => {
    test('does not display the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod',
        version: '2.0.0'
      }))

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(0)
    })
  })

  describe('when in a test environment', () => {
    test('displays the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'UAT',
        version: '2.0.0'
      }))

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(1)
      expect(enzymeWrapper.find('.footer__env').text()).toEqual('UAT')
    })
  })
})
