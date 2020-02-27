import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleFiltersHeader from '../GranuleFiltersHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    datasetId: 'Collection ID'
  }

  const enzymeWrapper = shallow(<GranuleFiltersHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  test('sets the dataset ID correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-filters-header__secondary').text()).toEqual('Collection ID')
  })
})
