import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import $ from 'jquery' // eslint-disable-line no-unused-vars
import { MetricsEventsContainer } from '../MetricsEventsContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onMetricsClick: jest.fn()
  }

  const enzymeWrapper = mount(<MetricsEventsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('MetricsEventsContainer component', () => {
  describe('metricsClick fires onMetricsClick correctly', () => {
    test('when no title is provided', () => {
      const { enzymeWrapper } = setup()

      const el = document.createElement('a')
      el.href = '/test/href'
      el.label = 'test-label'
      el.innerHTML = 'some test html'

      enzymeWrapper.instance().metricsClick({
        currentTarget: el
      })

      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'some test html'
      })
    })

    test('when a title is provided', () => {
      const { enzymeWrapper } = setup()

      const el = document.createElement('a')
      el.title = 'test-title'
      el.href = '/test/href'
      el.label = 'test-label'
      el.innerHTML = 'some test html'

      enzymeWrapper.instance().metricsClick({
        currentTarget: el
      })

      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'test-title'
      })
    })
  })
})
