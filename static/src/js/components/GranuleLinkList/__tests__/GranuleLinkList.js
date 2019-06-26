import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleLinkList } from '../GranuleLinkList'

Enzyme.configure({ adapter: new Adapter() })

describe('Granules component', () => {
  function setup() {
    const props = {
      links: []
    }

    const enzymeWrapper = shallow(<GranuleLinkList {...props} />)

    return {
      enzymeWrapper,
      props
    }
  }

  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})

describe('Granules component', () => {
  function setup() {
    const props = {
      links: [
        'http://google.com',
        'http://google.jp'
      ]
    }

    const enzymeWrapper = shallow(<GranuleLinkList {...props} />)

    return {
      enzymeWrapper,
      props
    }
  }

  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
    expect(enzymeWrapper.find('ul.granules-links-list li').length).toBe(2)
  })
})
