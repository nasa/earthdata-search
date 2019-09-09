import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ErrorBannerContainer } from '../ErrorBannerContainer'
import ErrorBanner from '../../../components/ErrorBanner/ErrorBanner'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    errors: [{
      id: 1,
      title: 'title',
      message: 'message'
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

    expect(enzymeWrapper.find(ErrorBanner).length).toBe(1)
    expect(enzymeWrapper.find(ErrorBanner).props().error).toEqual({
      id: 1,
      title: 'title',
      message: 'message'
    })

    expect(typeof enzymeWrapper.find(ErrorBanner).props().onRemoveError).toEqual('function')
  })

  test('does not render an ErrorBanner with no errors', () => {
    const { enzymeWrapper } = setup({ errors: [] })

    expect(enzymeWrapper.find(ErrorBanner).length).toBe(0)
  })
})
