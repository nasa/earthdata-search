import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Bannner from '../Banner'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    title: 'title',
    message: 'message',
    onClose: jest.fn(),
    type: 'error',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Bannner {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Bannner component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('h2.banner__title').text()).toEqual('title')
    expect(enzymeWrapper.find('p.banner__message').text()).toEqual('message')
  })

  test('clicking the close button calls onClose', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find(Button)
    button.simulate('click')

    expect(props.onClose).toBeCalledTimes(1)
    expect(props.onClose).toBeCalledWith()
  })

  test('error banner should render correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.hasClass('banner--error')).toEqual(true)
  })

  test('does not render a message when no message was provided', () => {
    const { enzymeWrapper } = setup({
      message: undefined
    })

    expect(enzymeWrapper.find('.banner__message').exists()).toBeFalsy()
  })
})
