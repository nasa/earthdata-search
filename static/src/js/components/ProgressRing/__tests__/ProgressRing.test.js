import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import ProgressRing from '../ProgressRing'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    ...overrideProps
  }
  const enzymeWrapper = shallow(<ProgressRing {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('ProgressRing component', () => {
  const { enzymeWrapper } = setup()

  test('should render an svg progress ring', () => {
    expect(enzymeWrapper.find('.progress-ring__ring').type()).toEqual('svg')
  })

  test('should add the correct classname', () => {
    expect(enzymeWrapper.find('.progress-ring').props().className).toEqual('progress-ring')
  })

  describe('when no size is provided', () => {
    test('should render an svg at the correct size', () => {
      expect(enzymeWrapper.find('.progress-ring__ring').props().width).toEqual(16)
      expect(enzymeWrapper.find('.progress-ring__ring').props().height).toEqual(16)
    })

    test('should render the inner circle at the correct size', () => {
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(8)
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(8)
      expect(enzymeWrapper.find('.progress-ring__progress').props().r).toEqual(5)
    })
  })

  describe('when a custom classname is provided', () => {
    const { enzymeWrapper } = setup({
      className: 'test-classname'
    })

    test('should add the correct classname', () => {
      expect(enzymeWrapper.find('.progress-ring').props().className).toEqual('progress-ring test-classname')
    })
  })

  describe('when a custom size is provided', () => {
    const { enzymeWrapper } = setup({
      width: 20
    })

    test('should render an svg at the custom size', () => {
      expect(enzymeWrapper.find('.progress-ring__ring').props().width).toEqual(20)
      expect(enzymeWrapper.find('.progress-ring__ring').props().height).toEqual(20)
    })

    test('should render the inner circle at the correct size', () => {
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(10)
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(10)
      expect(enzymeWrapper.find('.progress-ring__progress').props().r).toEqual(7)
    })
  })

  describe('when a custom stroke width is provided', () => {
    const { enzymeWrapper } = setup({
      strokeWidth: 2,
      width: 20
    })

    test('should render an svg at 16px wide', () => {
      expect(enzymeWrapper.find('.progress-ring__ring').props().width).toEqual(20)
      expect(enzymeWrapper.find('.progress-ring__ring').props().height).toEqual(20)
    })

    test('should render the inner circle at the correct size', () => {
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(10)
      expect(enzymeWrapper.find('.progress-ring__progress').props().cx).toEqual(10)
      expect(enzymeWrapper.find('.progress-ring__progress').props().r).toEqual(8)
    })
  })
})
