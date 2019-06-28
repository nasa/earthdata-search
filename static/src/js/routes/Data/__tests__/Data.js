import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'
import Data from '../Data'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onChangePath: jest.fn(),
    order: {
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
      expect(enzymeWrapper.find(Link).length).toEqual(1)
      expect(enzymeWrapper.find(Link).props().to).toEqual({
        pathname: '/projects',
        search: '?some=testparams'
      })
    })

    test('should fire onChangePath on click', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find(Link).simulate('click')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
    })
  })
})
