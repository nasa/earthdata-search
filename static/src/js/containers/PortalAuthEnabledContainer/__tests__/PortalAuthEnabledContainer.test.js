import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { PortalAuthEnabledContainer } from '../PortalAuthEnabledContainer'

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

  const enzymeWrapper = shallow(<PortalAuthEnabledContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PortalAuthEnabledContainer component', () => {
  test('renders children when authentication is enabled', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('div').exists()).toBeTruthy()
  })

  test('does not render children when authentication is disabled', () => {
    const { enzymeWrapper } = setup({
      portal: {
        features: {
          authentication: false
        }
      }
    })

    expect(enzymeWrapper.find('div').exists()).toBeFalsy()
  })
})
