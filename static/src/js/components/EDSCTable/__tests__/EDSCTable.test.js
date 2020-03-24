import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCTable from '../EDSCTable'
import Cell from '../../CollectionResultsTable/Cell'

import { collectionData } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    columns: [{
      Header: 'Version',
      Cell,
      accessor: 'versionId',
      width: '100',
      customProps: {
        centerContent: true
      }
    }],
    data: collectionData,
    id: 'test-table',
    infiniteScrollTotal: 2,
    infiniteScrollTrigger: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCTable component', () => {
  test('renders the table header correctly', () => {
    const { enzymeWrapper } = setup()
    const header = enzymeWrapper.find('.edsc-table__thead')
    expect(header.text()).toEqual('Version')
  })

  test('renders the table cell correctly', () => {
    const { enzymeWrapper } = setup()
    const cell = enzymeWrapper.find('Cell')
    expect(cell.props().data).toEqual(collectionData)
  })
})
