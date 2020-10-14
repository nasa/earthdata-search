import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ErrorBannerContainer } from '../ErrorBannerContainer'
import Banner from '../../../components/Banner/Banner'
import { displayNotificationType } from '../../../constants/enums'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    errors: [{
      id: 1,
      title: 'title',
      message: 'message',
      notificationType: displayNotificationType.banner
    }],
    onRemoveError: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ErrorBannerContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ErrorBannerContainer component', () => {
  test('passes its props and renders a single ErrorBanner component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Banner).length).toBe(1)
    expect(enzymeWrapper.find(Banner).props().title).toEqual('title')
    expect(enzymeWrapper.find(Banner).props().message).toEqual('message')
    expect(typeof enzymeWrapper.find(Banner).props().onClose).toEqual('function')
  })

  test('does not render an ErrorBanner with no errors', () => {
    const { enzymeWrapper } = setup({ errors: [] })

    expect(enzymeWrapper.find(Banner).length).toBe(0)
  })

  test('onRemoveError passes the correct id', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(Banner).prop('onClose')()

    expect(props.onRemoveError).toHaveBeenCalledTimes(1)
  })
})
