import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsTableHeaderCell from '../GranuleResultsTableHeaderCell'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    column: {
      customProps: {
        collectionId: 'collectionId',
        location: {},
        onExcludeGranule: jest.fn(),
        onFocusedGranuleChange: jest.fn(),
        onMetricsDataAccess: jest.fn()
      }
    },
    cell: {
      value: 'test value'
    },
    row: {
      original: {
        id: 'one',
        isCwic: false,
        dataLinks: [],
        onlineAccessFlag: true,
        handleClick: jest.fn()
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsTableHeaderCell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsTableHeaderCell component', () => {
  test('renders correctly', () => {
    const { enzymeWrapper } = setup()

    const titleButton = enzymeWrapper.find('.granule-results-table__title-button')
    expect(titleButton.props().label).toEqual('test value')
    expect(titleButton.find('h4').text()).toEqual('test value')
  })

  test('clicking the title button calls onFocusedGranuleChange', () => {
    const { enzymeWrapper, props } = setup()

    const titleButton = enzymeWrapper.find('.granule-results-table__title-button')
    titleButton.simulate('click')

    expect(props.row.original.handleClick).toHaveBeenCalledTimes(1)
    expect(props.row.original.handleClick).toHaveBeenCalledWith()
  })

  test('clicking the details button calls onViewCollectionDetails', () => {
    const { enzymeWrapper, props } = setup()

    const detailsButton = enzymeWrapper.find('.granule-results-table__granule-action--info').at(0)
    detailsButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onFocusedGranuleChange).toHaveBeenCalledWith('one')
  })

  test('clicking the remove from granule button calls onExcludeGranule', () => {
    const { enzymeWrapper, props } = setup()

    const removeButton = enzymeWrapper.find('.granule-results-table__granule-action--remove')
    removeButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({ collectionId: 'collectionId', granuleId: 'one' })
  })

  test('clicking the remove from granule button calls onExcludeGranule with a hashed id for CWIC collections', () => {
    const { enzymeWrapper, props } = setup({
      row: {
        original: {
          id: 'one',
          isCwic: true,
          dataLinks: [],
          onlineAccessFlag: true,
          handleClick: jest.fn()
        }
      }
    })

    const removeButton = enzymeWrapper.find('.granule-results-table__granule-action--remove')
    removeButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({ collectionId: 'collectionId', granuleId: '2257684172' })
  })
})
