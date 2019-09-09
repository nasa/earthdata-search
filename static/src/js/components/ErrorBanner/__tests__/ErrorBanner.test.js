import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ErrorBanner from '../ErrorBanner'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    error: {
      id: 1,
      title: 'title',
      message: 'message'
    },
    onRemoveError: jest.fn()
  }

  const enzymeWrapper = shallow(<ErrorBanner {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ErrorBanner component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('h1.banner-title').text()).toEqual('title')
    expect(enzymeWrapper.find('p.banner-text').text()).toEqual('message')
  })

  test('clicking the close button calls onRemoveError', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find(Button)
    button.simulate('click')

    expect(props.onRemoveError).toBeCalledTimes(1)
    expect(props.onRemoveError).toBeCalledWith(1)
  })
})
