import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsTable from '../CollectionResultsTable'
import EDSCTable from '../../EDSCTable/EDSCTable'
import { collectionData } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collections: collectionData,
    isItemLoaded: jest.fn(),
    itemCount: 1,
    loadMoreItems: jest.fn(),
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    portal: {
      features: {
        authentication: true
      }
    },
    setVisibleMiddleIndex: jest.fn(),
    visibleMiddleIndex: 1,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionResultsTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsTable component', () => {
  test('renders EDSCTable', () => {
    const { enzymeWrapper, props } = setup()
    const table = enzymeWrapper.find(EDSCTable)

    const { columns } = table.props()
    expect(columns[0]).toEqual(expect.objectContaining({
      Header: 'Collection',
      accessor: 'datasetId'
    }))
    expect(columns[1]).toEqual(expect.objectContaining({
      Header: 'Version',
      accessor: 'versionId'
    }))
    expect(columns[2]).toEqual(expect.objectContaining({
      Header: 'Start',
      accessor: 'temporalStart'
    }))
    expect(columns[3]).toEqual(expect.objectContaining({
      Header: 'End',
      accessor: 'temporalEnd'
    }))
    expect(columns[4]).toEqual(expect.objectContaining({
      Header: 'Granules',
      accessor: 'granuleCount'
    }))
    expect(columns[5]).toEqual(expect.objectContaining({
      Header: 'Provider',
      accessor: 'displayOrganization'
    }))
    expect(columns[6]).toEqual(expect.objectContaining({
      Header: 'Short Name',
      accessor: 'shortName'
    }))

    expect(table.props().data).toEqual(collectionData)
    expect(table.props().itemCount).toEqual(props.itemCount)
    expect(table.props().loadMoreItems).toEqual(props.loadMoreItems)
    expect(table.props().isItemLoaded).toEqual(props.isItemLoaded)
    expect(table.props().visibleMiddleIndex).toEqual(props.visibleMiddleIndex)
    expect(table.props().setVisibleMiddleIndex).toEqual(props.setVisibleMiddleIndex)
  })
})
