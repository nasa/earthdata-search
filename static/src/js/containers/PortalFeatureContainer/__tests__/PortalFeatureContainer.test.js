import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { mapStateToProps, PortalFeatureContainer } from '../PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    children: (<div>children</div>),
    portal: {
      features: {
        advancedSearch: true,
        authentication: true
      },
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<PortalFeatureContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('PortalFeatureContainer component', () => {
  describe('advancedSearch', () => {
    test('renders children when advancedSearch is enabled', () => {
      const { enzymeWrapper } = setup({
        advancedSearch: true
      })

      expect(enzymeWrapper.find('div').exists()).toBeTruthy()
    })

    test('does not render children when advancedSearch is disabled', () => {
      const { enzymeWrapper } = setup({
        advancedSearch: true,
        portal: {
          features: {
            advancedSearch: false
          }
        }
      })

      expect(enzymeWrapper.find('div').exists()).toBeFalsy()
    })
  })

  describe('authentication', () => {
    test('renders children when authentication is enabled', () => {
      const { enzymeWrapper } = setup({
        authentication: true
      })

      expect(enzymeWrapper.find('div').exists()).toBeTruthy()
    })

    test('does not render children when authentication is disabled', () => {
      const { enzymeWrapper } = setup({
        authentication: true,
        portal: {
          features: {
            authentication: false
          }
        }
      })

      expect(enzymeWrapper.find('div').exists()).toBeFalsy()
    })
  })

  describe('nonEosdisCheckbox', () => {
    test('renders children when nonEosdisCheckbox is enabled', () => {
      const { enzymeWrapper } = setup({
        nonEosdisCheckbox: true
      })

      expect(enzymeWrapper.find('div').exists()).toBeTruthy()
    })

    test('does not render children when nonEosdisCheckbox is disabled', () => {
      const { enzymeWrapper } = setup({
        nonEosdisCheckbox: true,
        portal: {
          ui: {
            showNonEosdisCheckbox: false
          }
        }
      })

      expect(enzymeWrapper.find('div').exists()).toBeFalsy()
    })
  })

  describe('onlyGranulesCheckbox', () => {
    test('renders children when onlyGranulesCheckbox is enabled', () => {
      const { enzymeWrapper } = setup({
        onlyGranulesCheckbox: true
      })

      expect(enzymeWrapper.find('div').exists()).toBeTruthy()
    })

    test('does not render children when onlyGranulesCheckbox is disabled', () => {
      const { enzymeWrapper } = setup({
        onlyGranulesCheckbox: true,
        portal: {
          ui: {
            showOnlyGranulesCheckbox: false
          }
        }
      })

      expect(enzymeWrapper.find('div').exists()).toBeFalsy()
    })
  })
})
