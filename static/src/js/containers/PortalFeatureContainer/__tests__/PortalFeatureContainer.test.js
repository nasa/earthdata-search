import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { PortalFeatureContainer } from '../PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    children: (<div>children</div>),
    portal: {
      features: {
        authentication: true
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

describe('PortalFeatureContainer component', () => {
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
})
