import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionDetailsTabContainer } from '../CollectionDetailsTabContainer'
import { CollectionDetailsTab } from '../../../components/CollectionDetails/CollectionDetailsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      some: 'location'
    }
  }

  const enzymeWrapper = shallow(<CollectionDetailsTabContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsTabContainer component', () => {
  test('passes its props and renders a single CollectionDetailsTab component', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(CollectionDetailsTab).length).toBe(1)
    expect(enzymeWrapper.find(CollectionDetailsTab).prop('location')).toEqual({
      some: 'location'
    })
  })
})
