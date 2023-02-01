import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import CollectionResultsTable from '../CollectionResultsTable'
import EDSCTable from '../../EDSCTable/EDSCTable'
import { collectionData } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionsMetadata: collectionData,
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
    expect(columns[7]).toEqual(expect.objectContaining({
      accessor: 'cloudHosted'
    }))
    expect(columns[8]).toEqual(expect.objectContaining({
      accessor: 'hasMapImagery'
    }))
    expect(columns[9]).toEqual(expect.objectContaining({
      accessor: 'isNrt'
    }))
    expect(columns[10]).toEqual(expect.objectContaining({
      Header: 'Spatial Subsetting',
      accessor: 'hasSpatialSubsetting'
    }))
    expect(columns[11]).toEqual(expect.objectContaining({
      Header: 'Temporal Subsetting',
      accessor: 'hasTemporalSubsetting'
    }))
    expect(columns[12]).toEqual(expect.objectContaining({
      Header: 'Variable Subsetting',
      accessor: 'hasVariables'
    }))
    expect(columns[13]).toEqual(expect.objectContaining({
      Header: 'Transformation',
      accessor: 'hasTransforms'
    }))
    expect(columns[14]).toEqual(expect.objectContaining({
      Header: 'Reformatting',
      accessor: 'hasFormats'
    }))

    expect(table.props().data).toEqual(collectionData)
    expect(table.props().itemCount).toEqual(props.itemCount)
    expect(table.props().loadMoreItems).toEqual(props.loadMoreItems)
    expect(table.props().isItemLoaded).toEqual(props.isItemLoaded)
    expect(table.props().visibleMiddleIndex).toEqual(props.visibleMiddleIndex)
    expect(table.props().setVisibleMiddleIndex).toEqual(props.setVisibleMiddleIndex)
  })
})
