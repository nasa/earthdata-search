import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Data from '../Data'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    match: {
      path: '/search'
    },
    onChangePath: jest.fn(),
    retrieval: {
      jsondata: {
        source: '?some=testparams'
      }
    }
  }

  const enzymeWrapper = shallow(<Data.WrappedComponent {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Data component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  describe('child link', () => {
    test('should render with the correct props', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(PortalLinkContainer).length).toEqual(1)
      expect(enzymeWrapper.find(PortalLinkContainer).props().to).toEqual({
        pathname: '/projects',
        search: '?some=testparams'
      })
    })

    test('should fire onChangePath on click', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find(PortalLinkContainer).simulate('click')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
    })
  })
})
