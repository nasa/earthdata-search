import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { granuleResultsBodyProps } from './test_data'
import GranuleDetailsHeader from '../GranuleDetailsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    json: granuleResultsBodyProps.json
  }

  const enzymeWrapper = shallow(<GranuleDetailsHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.props().className).toEqual('row granule-details-header')
  })

  test('renders a title', () => {
    const { enzymeWrapper } = setup()
    const title = enzymeWrapper.find('.granule-details-header__title')

    expect(title.text()).toEqual('1860_1993_2050_NITROGEN.N-deposition1860.tfw')
  })
})
