import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Card } from 'react-bootstrap'
import { collectionDetailsBodyProps } from './mocks'
import CollectionDetailsDataCenter from '../CollectionDetailsDataCenter'

// TODO: Write more tests

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    dataCenter: collectionDetailsBodyProps.focusedCollectionMetadata
      .formattedMetadata.dataCenters[0],
    item: 0
  }

  const enzymeWrapper = shallow(<CollectionDetailsDataCenter {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetails component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe(Card)
    expect(enzymeWrapper.prop('className')).toEqual('collection-details-data-center')
    expect(enzymeWrapper.prop('as')).toEqual('li')
    expect(enzymeWrapper.prop('bg')).toEqual('light')
    expect(enzymeWrapper.find(Card.Body).length).toEqual(1)
  })
})
