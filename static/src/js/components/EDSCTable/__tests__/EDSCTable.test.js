import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCTable from '../EDSCTable'

import { collectionData } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    columns: [{
      Header: 'Version',
      // Cell,
      accessor: 'versionId',
      width: '100',
      customProps: {
        centerContent: true
      }
    }],
    data: collectionData,
    id: 'test-table',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCTable component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe('div')
  })
})
