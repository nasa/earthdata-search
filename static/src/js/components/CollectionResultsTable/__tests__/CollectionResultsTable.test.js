import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsTable from '../CollectionResultsTable'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    bootstrapVariant: 'primary',
    collections: [],
    collectionHits: 0,
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    waypointEnter: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionResultsTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsTable component', () => {
  test('placeholder', () => {
    setup()

    expect(true).toBe(true)
  })
})
